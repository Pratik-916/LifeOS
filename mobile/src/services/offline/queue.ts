import { SyncOperation } from './types';
import { storage } from './storage';
import { generateId } from '../../utils/uuid';

class OfflineQueue {
  private queue: SyncOperation[] = [];
  private initialized: boolean = false;

  public async init(): Promise<void> {
    if (!this.initialized) {
      this.queue = await storage.loadQueue();
      this.initialized = true;
    }
  }

  public async enqueue(operation: Omit<SyncOperation, 'id' | 'localTimestamp' | 'retryCount' | 'status' | 'version'>): Promise<SyncOperation | null> {
    await this.init();
    
    // Queue Compaction Logic
    if (operation.entityId && operation.entityType) {
      const existingOps = this.queue.filter(
        op => op.entityId === operation.entityId && op.entityType === operation.entityType && op.status === 'pending'
      );

      if (existingOps.length > 0) {
        const lastOp = existingOps[existingOps.length - 1];

        // UPDATE + UPDATE -> merge payloads
        if (operation.mutationType === 'UPDATE' && lastOp.mutationType === 'UPDATE' && operation.method === lastOp.method && operation.endpoint === lastOp.endpoint) {
          lastOp.payload = { ...lastOp.payload, ...operation.payload };
          await this.persist();
          return lastOp;
        }

        // CREATE + UPDATE -> merge payloads into CREATE
        if (operation.mutationType === 'UPDATE' && lastOp.mutationType === 'CREATE') {
          lastOp.payload = { ...lastOp.payload, ...operation.payload };
          await this.persist();
          return lastOp;
        }

        // ANY + DELETE -> remove previous ops. If CREATE + DELETE, remove all, return null.
        if (operation.mutationType === 'DELETE') {
          if (lastOp.mutationType === 'CREATE') {
            // It was created and deleted entirely offline, drop it.
            this.queue = this.queue.filter(op => !(op.entityId === operation.entityId && op.entityType === operation.entityType));
            await this.persist();
            return null;
          } else if (lastOp.mutationType === 'UPDATE') {
            // Replace UPDATE with DELETE
            this.queue = this.queue.filter(op => !(op.entityId === operation.entityId && op.entityType === operation.entityType));
            // Will continue to enqueue the DELETE below
          }
        }
      }
    }

    const newOp: SyncOperation = {
      ...operation,
      id: generateId(),
      localTimestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
      version: 1,
    };

    this.queue.push(newOp);
    this.sortQueue();
    await this.persist();
    return newOp;
  }

  public async dequeue(): Promise<SyncOperation | undefined> {
    await this.init();
    const op = this.queue.shift();
    if (op) {
      await this.persist();
    }
    return op;
  }

  public async peek(): Promise<SyncOperation | undefined> {
    await this.init();
    return this.queue[0];
  }

  public async remove(id: string): Promise<void> {
    await this.init();
    this.queue = this.queue.filter(op => op.id !== id);
    await this.persist();
  }

  public async update(id: string, updates: Partial<SyncOperation>): Promise<void> {
    await this.init();
    const index = this.queue.findIndex(op => op.id === id);
    if (index !== -1) {
      this.queue[index] = { ...this.queue[index], ...updates };
      this.sortQueue();
      await this.persist();
    }
  }

  public async getPendingOperations(): Promise<SyncOperation[]> {
    await this.init();
    return [...this.queue];
  }

  public async clearQueue(): Promise<void> {
    this.queue = [];
    await storage.clearQueue();
  }

  private sortQueue() {
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // higher priority first
      }
      return a.localTimestamp - b.localTimestamp; // older first
    });
  }

  private async persist(): Promise<void> {
    await storage.saveQueue(this.queue);
  }
}

export const offlineQueue = new OfflineQueue();
