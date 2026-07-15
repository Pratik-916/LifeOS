import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import { Loader } from '../design-system/loaders/Loader';

export const RootNavigator = () => {
  const { isAuthenticated, isInitializing, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
