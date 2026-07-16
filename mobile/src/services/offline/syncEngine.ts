import { networkService } from './network';
import { offlineQueue } from './queue';
import { defaultRetryStrategy } from './retry';
import { conflictResolver } from './conflicts';
import { apiClient } from '../../api/client';
import { monitoringService } from '../monitoring';
import type { SyncOperation } from './types';
import { QueryClient } from '@tanstack/react-query';

class SyncEngine {
  private isSyncing: boolean = false;
  private isPaused: boolean = false;
  private queryClient?: QueryClient;

  constructor() {
    networkService.addListener((isOnline) => {
      if (isOnline) {
        this.flush();
      }
    });
  }

  public setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  public async flush(): Promise<void> {
    if (this.isSyncing || this.isPaused || !networkService.isOnline) {
      return;
    }

    this.isSyncing = true;
    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;
    let conflictCount = 0;

    try {
      const pendingOps = await offlineQueue.getPendingOperations();
      monitoringService.captureMessage(`sync_started: queueSize=${pendingOps.length}`);

      for (const op of pendingOps) {
        if (this.isPaused || !networkService.isOnline) {
          break; // Stop syncing if paused or went offline
        }

        try {
          await this.processOperation(op);
          await offlineQueue.remove(op.id);
          successCount++;
        } catch (error: any) {
          // Failure handling
          const isConflict = error.response?.status === 409;
          
          if (isConflict) {
            conflictCount++;
            const serverState = error.response.data;
            const resolution = await conflictResolver.resolve(op, serverState, op.payload);
            
            if (resolution.resolved) {
              if (resolution.dropOperation) {
                await offlineQueue.remove(op.id);
              } else {
                // Retry with resolved payload
                await offlineQueue.update(op.id, { payload: resolution.resolutionPayload });
                // We'll retry this on the next flush
              }
            }
          } else if (defaultRetryStrategy.shouldRetry(error, op.retryCount)) {
            // Temporary failure
            const newRetryCount = op.retryCount + 1;
            await offlineQueue.update(op.id, { 
              retryCount: newRetryCount,
              status: 'retrying'
            });
            failureCount++;
            // We do NOT stop the whole queue, or maybe we do? 
            // Sequential processing means if one fails we might block others of the same entity.
            // For now, continue to next operation.
          } else {
            // Permanent failure
            await offlineQueue.update(op.id, { status: 'failed' });
            monitoringService.captureException(error, { context: 'sync_permanent_failure', operationId: op.id });
            failureCount++;
          }
        }
      }

      if (successCount > 0 && this.queryClient) {
        // Invalidate all queries to refresh state from backend
        this.queryClient.invalidateQueries();
      }

    } finally {
      this.isSyncing = false;
      const duration = Date.now() - startTime;
      monitoringService.captureMessage(`sync_completed: duration=${duration} successCount=${successCount} failureCount=${failureCount} conflictCount=${conflictCount}`);
    }
  }

  private async processOperation(op: SyncOperation): Promise<void> {
    const { endpoint, method, payload } = op;
    const url = endpoint;
    
    switch (method) {
      case 'POST':
        await apiClient.post(url, payload);
        break;
      case 'PUT':
        await apiClient.put(url, payload);
        break;
      case 'PATCH':
        await apiClient.patch(url, payload);
        break;
      case 'DELETE':
        await apiClient.delete(url, { data: payload });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this.flush();
  }

  public cancel() {
    this.pause();
    offlineQueue.clearQueue();
  }

  public get isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }
}

export const syncEngine = new SyncEngine();
