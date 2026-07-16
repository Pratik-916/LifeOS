import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types'; // assume it exists, but might need to create

export const navigationRef = createNavigationContainerRef<any>();

let navigationQueue: { route: string; params: any }[] = [];

export const navigateSafely = (route: string, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(route, params);
  } else {
    // Queue the navigation for when the container becomes ready
    navigationQueue.push({ route, params });
  }
};

export const processNavigationQueue = () => {
  if (!navigationRef.isReady()) return;
  while (navigationQueue.length > 0) {
    const next = navigationQueue.shift();
    if (next) {
      navigationRef.navigate(next.route, next.params);
    }
  }
};
