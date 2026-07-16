export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE' | 'PATCH' | 'POST' | 'PUT';

export type QueueItemStatus = 'pending' | 'retrying' | 'failed' | 'conflict';

export interface SyncOperation {
  id: string;
  entityType: string;
  entityId?: string; // Optional because a create operation might not have a known backend ID yet, unless client-generated
  mutationType: OperationType;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: any;
  localTimestamp: number;
  retryCount: number;
  status: QueueItemStatus;
  priority: number;
  version: number;
}

export type ConflictResolutionResult = {
  resolved: boolean;
  resolutionPayload?: any;
  dropOperation?: boolean;
};

export interface ConflictStrategy {
  name: string;
  resolve: (
    operation: SyncOperation,
    serverState: any,
    localState: any
  ) => Promise<ConflictResolutionResult>;
}

export interface OfflineQueueStatus {
  size: number;
  isSyncing: boolean;
  pendingOperations: SyncOperation[];
  failedOperations: SyncOperation[];
}
