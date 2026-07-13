import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { CheckCircle2, CloudOff } from 'lucide-react-native';

interface AutosaveIndicatorProps {
  status: 'saved' | 'saving' | 'offline' | 'error' | 'idle';
}

export const AutosaveIndicator = ({ status }: AutosaveIndicatorProps) => {
  if (status === 'idle') return null;

  return (
    <View className="flex-row items-center px-2 py-1 bg-slate-100 rounded-full">
      {status === 'saving' && (
        <>
          <ActivityIndicator size="small" color="#64748B" style={{ transform: [{ scale: 0.6 }] }} />
          <Typography variant="caption" className="text-slate-500 ml-1">Saving...</Typography>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <CheckCircle2 size={12} color="#10B981" />
          <Typography variant="caption" className="text-emerald-600 ml-1">Saved</Typography>
        </>
      )}
      
      {status === 'offline' && (
        <>
          <CloudOff size={12} color="#F59E0B" />
          <Typography variant="caption" className="text-amber-600 ml-1">Offline Draft</Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <Typography variant="caption" className="text-rose-600 ml-1">Failed to save</Typography>
        </>
      )}
    </View>
  );
};
