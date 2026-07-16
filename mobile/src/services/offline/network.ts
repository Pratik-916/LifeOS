import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

type NetworkChangeListener = (isOnline: boolean) => void;

class NetworkService {
  private isOnlineStatus: boolean = true;
  private unsubscribe: NetInfoSubscription | null = null;
  private listeners: Set<NetworkChangeListener> = new Set();

  constructor() {
    this.init();
  }

  private async init() {
    const state = await NetInfo.fetch();
    this.isOnlineStatus = !!state.isConnected && !!state.isInternetReachable;

    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const newStatus = !!state.isConnected && (state.isInternetReachable ?? true); // Default to true if null (e.g. some emulators)
      if (this.isOnlineStatus !== newStatus) {
        this.isOnlineStatus = newStatus;
        this.notifyListeners(newStatus);
      }
    });
  }

  public get isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public addListener(listener: NetworkChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((listener) => listener(isOnline));
  }

  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.listeners.clear();
  }
}

export const networkService = new NetworkService();
