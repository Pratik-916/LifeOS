export const requestCameraPermission = async (): Promise<boolean> => {
  // TODO: Implement expo-camera or expo-image-picker permission abstraction
  console.log('Camera permission requested');
  return true;
};

export const checkCameraPermission = async (): Promise<boolean> => {
  return true;
};
