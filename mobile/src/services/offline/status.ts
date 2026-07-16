import { offlineQueue } from './queue';
import { syncEngine } from './syncEngine';
import type { OfflineQueueStatus } from './types';

export async function getQueueStatus(): Promise<OfflineQueueStatus> {
  const operations = await offlineQueue.getPendingOperations();
  const pendingOperations = operations.filter(op => op.status !== 'failed');
  const failedOperations = operations.filter(op => op.status === 'failed');

  return {
    size: operations.length,
    isSyncing: syncEngine.isCurrentlySyncing,
    pendingOperations,
    failedOperations,
  };
}
