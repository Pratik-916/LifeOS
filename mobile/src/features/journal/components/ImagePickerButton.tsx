import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';

export const ImagePickerButton = () => {
  const handlePress = () => {
    Alert.alert("Coming Soon", "Image upload will be available in a future update.");
  };

  return (
    <TouchableOpacity 
      className="flex-row items-center bg-slate-100 px-3 py-2 rounded-lg"
      onPress={handlePress}
    >
      <ImageIcon size={18} color="#64748B" />
      <Typography variant="body" className="text-slate-600 ml-2">
        Add Photo
      </Typography>
    </TouchableOpacity>
  );
};
