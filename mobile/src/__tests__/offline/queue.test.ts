import { offlineQueue } from '../../services/offline/queue';
import { storage } from '../../services/offline/storage';

jest.mock('../../services/offline/storage', () => ({
  storage: {
    loadQueue: jest.fn().mockResolvedValue([]),
    saveQueue: jest.fn().mockResolvedValue(undefined),
    clearQueue: jest.fn().mockResolvedValue(undefined),
  }
}));

jest.mock('../../utils/uuid', () => ({
  generateId: () => Math.random().toString(36).substring(7),
}));

describe('Offline Queue Validation', () => {
  beforeEach(async () => {
    await offlineQueue.clearQueue();
    jest.clearAllMocks();
  });

  it('Part 1: Queue Ordering Validation', async () => {
    const entityId = 'task-123';
    
    // Simulate Create -> Update -> Complete -> Delete
    await offlineQueue.enqueue({
      entityType: 'task',
      entityId,
      mutationType: 'CREATE',
      endpoint: '/api/v1/planner/tasks/',
      method: 'POST',
      payload: { title: 'Test Task' },
      priority: 1,
    });

    // Wait a tick to ensure chronological difference if any
    await new Promise(r => setTimeout(r, 10));

    await offlineQueue.enqueue({
      entityType: 'task',
      entityId,
      mutationType: 'UPDATE',
      endpoint: `/api/v1/planner/tasks/${entityId}/`,
      method: 'PATCH',
      payload: { title: 'Updated Task' },
      priority: 1,
    });

    const pending = await offlineQueue.getPendingOperations();
    
    // Since Compaction is active, CREATE + UPDATE should merge!
    expect(pending.length).toBe(1);
    expect(pending[0].mutationType).toBe('CREATE');
    expect(pending[0].payload.title).toBe('Updated Task');
  });

  it('Part 4: Queue Capacity Stress Test (1000 ops)', async () => {
    const startTime = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      await offlineQueue.enqueue({
        entityType: 'task',
        entityId: `task-${i}`, // Different IDs to avoid compaction
        mutationType: 'CREATE',
        endpoint: '/api/v1/planner/tasks/',
        method: 'POST',
        payload: { title: `Task ${i}` },
        priority: 1,
      });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const pending = await offlineQueue.getPendingOperations();
    expect(pending.length).toBe(1000);
    
    console.log(`[Capacity Audit] 1000 operations queued in ${duration}ms`);
    // Assert it takes less than 5 seconds
    expect(duration).toBeLessThan(5000);
  });
});
