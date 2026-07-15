import { ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { Caption, Icon } from '../../../design-system';

interface AutosaveIndicatorProps {
  status: 'saved' | 'saving' | 'offline' | 'error' | 'idle';
}

export const AutosaveIndicator = ({ status }: AutosaveIndicatorProps) => {
  const opacity = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    if (status === 'saved') {
      opacity.setValue(1);
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      opacity.setValue(1);
    }
  }, [status, opacity]);

  if (status === 'idle') return null;

  return (
    <Animated.View style={{ opacity }} className="flex-row items-center px-2 py-1 bg-slate-100 rounded-full">
      {status === 'saving' && (
        <>
          <ActivityIndicator size="small" color="#64748B" style={{ transform: [{ scale: 0.6 }] }} />
          <Caption className="text-slate-500 ml-1">Saving...</Caption>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <Icon name="CheckCircle2" size={12} color="#10B981" />
          <Caption className="text-emerald-600 ml-1">Saved</Caption>
        </>
      )}
      
      {status === 'offline' && (
        <>
          <Icon name="CloudOff" size={12} color="#F59E0B" />
          <Caption className="text-amber-600 ml-1">Offline Draft</Caption>
        </>
      )}

      {status === 'error' && (
        <>
          <Caption className="text-rose-600 ml-1">Failed to save</Caption>
        </>
      )}
    </Animated.View>
  );
};
