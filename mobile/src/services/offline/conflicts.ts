import { ConflictStrategy, SyncOperation, ConflictResolutionResult } from './types';

// Default strategy: Last Write Wins
export const lastWriteWinsStrategy: ConflictStrategy = {
  name: 'LastWriteWins',
  resolve: async (
    operation: SyncOperation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serverState: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localState: any
  ): Promise<ConflictResolutionResult> => {
    
    // In a LWW scenario, if the operation's timestamp is newer than the server's last updated time,
    // we let it overwrite. Otherwise, we drop our local operation.
    // For simplicity, we just assume LWW lets the local operation proceed to overwrite.
    // A robust LWW would parse serverState.updated_at.
    
    if (serverState && serverState.updated_at) {
      const serverTime = new Date(serverState.updated_at).getTime();
      if (serverTime > operation.localTimestamp) {
        // Server is newer. Drop local.
        return { resolved: true, dropOperation: true };
      }
    }

    // Local is newer or no server timestamp provided. Apply local.
    return { resolved: true, dropOperation: false, resolutionPayload: operation.payload };
  },
};

class ConflictResolver {
  private strategies: Record<string, ConflictStrategy> = {};
  private defaultStrategy: ConflictStrategy = lastWriteWinsStrategy;

  constructor() {
    this.registerStrategy(lastWriteWinsStrategy);
  }

  public registerStrategy(strategy: ConflictStrategy) {
    this.strategies[strategy.name] = strategy;
  }

  public setDefaultStrategy(strategyName: string) {
    if (this.strategies[strategyName]) {
      this.defaultStrategy = this.strategies[strategyName];
    }
  }

  public async resolve(
    operation: SyncOperation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serverState: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localState: any,
    strategyName?: string
  ): Promise<ConflictResolutionResult> {
    const strategy = strategyName && this.strategies[strategyName]
      ? this.strategies[strategyName]
      : this.defaultStrategy;
    
    return strategy.resolve(operation, serverState, localState);
  }
}

export const conflictResolver = new ConflictResolver();
