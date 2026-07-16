# Offline Write Queue Design

The Queue is the central nervous system of the Offline Synchronization engine. 

## Data Structure
Each queue item (`SyncOperation`) represents a generic REST API call:
```ts
interface SyncOperation {
  id: string; // Unique ID (UUIDv4)
  entityType: string;
  entityId?: string;
  mutationType: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: any;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'retrying';
  priority: number;
}
```

## Storage Layer
The queue is persisted in `AsyncStorage` under the key `@offline_queue`. 
We manage an in-memory replica that is initialized on app startup, ensuring ultra-fast reads. Writes are flushed to `AsyncStorage` immediately.

## Sorting and Dependencies
When the queue flushes:
1. Operations are sorted by `priority` (ascending).
2. Within the same priority, operations are sorted chronologically by `timestamp`.
This ensures that a `CREATE` operation on an entity happens before a subsequent `UPDATE` or `DELETE` on the same entity.
