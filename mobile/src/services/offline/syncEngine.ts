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
          } else if (error.response?.status === 401) {
            // Authentication Recovery Validation (Part 3)
            this.pause();
            monitoringService.captureMessage('sync_paused_due_to_auth', 'warning');
            break; // Stop syncing. Let the external auth listener resume() later.
          } else if (defaultRetryStrategy.shouldRetry(error, op.retryCount)) {
            // Temporary failure
            const newRetryCount = op.retryCount + 1;
            await offlineQueue.update(op.id, { 
              retryCount: newRetryCount,
              status: 'retrying'
            });
            failureCount++;
          } else {
            // Permanent failure
            await offlineQueue.update(op.id, { status: 'failed' });
            monitoringService.captureException(error, { context: 'sync_permanent_failure', operationId: op.id });
            failureCount++;

            // Partial Failure Validation (Part 5)
            // If a root operation (e.g. CREATE) permanently fails, subsequent operations on the same entity will also fail (e.g. 404).
            // We implement cascading failure here:
            if (op.entityId && op.entityType) {
              const remainingOps = await offlineQueue.getPendingOperations();
              const dependentOps = remainingOps.filter(
                (depOp) => depOp.entityId === op.entityId && depOp.entityType === op.entityType && depOp.id !== op.id
              );
              for (const depOp of dependentOps) {
                await offlineQueue.update(depOp.id, { status: 'failed' });
                monitoringService.captureMessage(`cascading_failure: operationId=${depOp.id} due to parent operation=${op.id}`, 'warning');
              }
            }
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
