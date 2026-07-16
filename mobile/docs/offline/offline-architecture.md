# Offline Architecture

The LifeOS offline architecture enables a seamless user experience regardless of network connectivity by persisting mutations locally and synchronizing them when the network is restored.

## 1. Core Components

- **Offline Queue**: A priority-based, persistent queue built on top of React Native's `AsyncStorage`. All mutations generated while offline are enqueued here.
- **Sync Engine**: The orchestration layer. It listens for network status changes via `NetInfo` and automatically flushes the queue upon reconnection.
- **Conflict Resolver**: Implements a pluggable strategy pattern to automatically resolve data conflicts when the backend rejects a mutation with a 409 Conflict.
- **React Query Hooks**: We intercept feature mutations (e.g., `useTaskMutations`) to selectively return optimistic mock objects and enqueue the mutation logic when offline, preserving the UI flow without raising unhandled errors.

## 2. Queue Compaction & Optimization
To minimize unnecessary backend requests, the `OfflineQueue` automatically compacts operations during `enqueue`:
- **CREATE + UPDATE**: The UPDATE payload is merged directly into the pending CREATE payload. The UPDATE operation is discarded.
- **UPDATE + UPDATE**: The payloads are merged if they target the same endpoint.
- **ANY + DELETE**: If an entity is deleted before synchronization, all prior operations on it are removed from the queue (if it was a CREATE, the entity is dropped entirely since it never reached the server).

## 3. Reliability & Failure Recovery
The SyncEngine is designed for maximum reliability with built-in mechanisms for edge cases.

### Cascading Failures (Partial Failures)
If a root operation (e.g., `CREATE`) fails permanently (e.g., HTTP 400 Validation Error), all subsequent dependent operations (e.g., `UPDATE`) on that same entity ID will be automatically marked as `failed`. This prevents cascading 404s and queue corruption.

### Authentication Recovery
If the `SyncEngine` encounters an HTTP 401 Unauthorized error during synchronization, the queue automatically pauses itself and stops retrying. It waits for the application to refresh the authentication token and call `resume()`.

### Locking & Concurrency (Synchronization Worker)
The `SyncEngine` utilizes a strict, synchronous mutex (`isSyncing` flag) that guarantees only one synchronization worker processes the queue at any given time, eliminating race conditions during rapid disconnect/reconnect cycles.

## 4. Principles
- Backend remains the single source of truth.
- Clients implement optimistic updates via React Query's `onMutate`.
- Operations are isolated: A failure in one mutation does not halt the entire queue, except for its dependents.
