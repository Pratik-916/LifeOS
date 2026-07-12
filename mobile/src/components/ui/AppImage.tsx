import React from 'react';
import { Image, ImageProps, View } from 'react-native';

interface AppImageProps extends ImageProps {
  fallback?: React.ReactNode;
}

export const AppImage: React.FC<AppImageProps> = ({ fallback, style, ...props }) => {
  const [error, setError] = React.useState(false);

  if (error && fallback) {
    return <View style={style}>{fallback}</View>;
  }

  return (
    <Image 
      {...props} 
      style={style} 
      onError={() => setError(true)} 
    />
  );
};
