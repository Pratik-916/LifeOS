import React, { useState, useEffect } from 'react';
import { View, InteractionManager } from 'react-native';

interface LazyRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyRender = ({ children, fallback = <View className="h-48" /> }: LazyRenderProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
