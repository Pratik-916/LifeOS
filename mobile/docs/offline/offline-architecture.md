# Offline Architecture

The LifeOS offline architecture enables a seamless user experience regardless of network connectivity by persisting mutations locally and synchronizing them when the network is restored.

## Core Components

- **Offline Queue**: A priority-based, persistent queue built on top of React Native's `AsyncStorage`. All mutations generated while offline are enqueued here.
- **Sync Engine**: The orchestration layer. It listens for network status changes via `NetInfo` and automatically flushes the queue upon reconnection.
- **Conflict Resolver**: Implements a pluggable strategy pattern to automatically resolve data conflicts when the backend rejects a mutation with a 409 Conflict.
- **React Query Hooks**: We intercept feature mutations (e.g., `useTaskMutations`) to selectively return optimistic mock objects and enqueue the mutation logic when offline, preserving the UI flow without raising unhandled errors.

## Principles
- Backend remains the single source of truth.
- Clients implement optimistic updates via React Query's `onMutate`.
- Operations are isolated: A failure in one mutation does not necessarily halt the entire queue.
