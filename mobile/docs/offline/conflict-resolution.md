# Conflict Resolution

When synchronizing the offline queue with the backend, multiple clients might have modified the same entity. The backend identifies this and responds with a HTTP 409 Conflict.

## Strategy Pattern
We have designed a pluggable conflict resolution engine. 
A strategy implements the following interface:
```ts
interface ConflictStrategy {
  name: string;
  resolve(operation: SyncOperation, serverState: any, localState: any): Promise<ConflictResolutionResult>;
}
```

## Last Write Wins (LWW)
Currently, LifeOS defaults to the `LastWriteWins` strategy. 
- It compares the server's `updated_at` timestamp with the local `SyncOperation.localTimestamp`.
- If the server has a newer timestamp, the local operation is dropped.
- Otherwise, the local operation overrides the server state (retry is triggered with the same payload).

## Future Proofing
Because of the strategy pattern, developers can easily inject domain-specific strategies, e.g. merging notes, auto-resolving tags, or popping a manual resolution dialog to the user via the UI.
