import React from 'react';
import { Alert } from 'react-native';
import { Button } from '../../../design-system';

export const ImagePickerButton = () => {
  const handlePress = () => {
    Alert.alert("Coming Soon", "Image upload will be available in a future update.");
  };

  return (
    <Button 
      variant="secondary"
      size="sm"
      leftIcon="Image"
      title="Add Photo"
      onPress={handlePress}
    />
  );
};
