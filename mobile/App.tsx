import React, { useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './src/design-system/feedback/ErrorBoundary';
import { OfflineBanner } from './src/design-system/feedback/OfflineBanner';
import { ThemeProvider } from './src/theme/ThemeProvider';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

import { monitoringService } from './src/services/monitoring';

// Initialize production observability
monitoringService.initialize();

function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <QueryClientProvider client={queryClient}>
            <StatusBar style="auto" />
            <OfflineBanner />
            <RootNavigator />
          </QueryClientProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default monitoringService.wrapApp(App);
