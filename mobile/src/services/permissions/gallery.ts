export const requestGalleryPermission = async (): Promise<boolean> => {
  // TODO: Implement expo-image-picker permission abstraction
  console.log('Gallery permission requested');
  return true;
};

export const checkGalleryPermission = async (): Promise<boolean> => {
  return true;
};
