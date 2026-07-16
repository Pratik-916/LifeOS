import { createNavigationContainerRef } from '@react-navigation/native';
import { MainStackParamList } from './types'; // assume it exists, but might need to create

export const navigationRef = createNavigationContainerRef<MainStackParamList>();

type RouteParamsPair = {
  [K in keyof MainStackParamList]: {
    route: K;
    params?: MainStackParamList[K];
  };
}[keyof MainStackParamList];

const navigationQueue: RouteParamsPair[] = [];

export const navigateSafely = <RouteName extends keyof MainStackParamList>(route: RouteName, params?: MainStackParamList[RouteName]) => {
  if (navigationRef.isReady()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigationRef.navigate(route as any, params as any);
  } else {
    // Queue the navigation for when the container becomes ready
    navigationQueue.push({ route, params } as RouteParamsPair);
  }
};

export const processNavigationQueue = () => {
  if (!navigationRef.isReady()) return;
  while (navigationQueue.length > 0) {
    const next = navigationQueue.shift();
    if (next) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigationRef.navigate(next.route as any, next.params as any);
    }
  }
};
