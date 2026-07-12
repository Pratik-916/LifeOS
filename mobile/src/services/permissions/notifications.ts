export const requestNotificationsPermission = async (): Promise<boolean> => {
  // TODO: Implement expo-notifications permission abstraction
  console.log('Notifications permission requested');
  return true;
};

export const checkNotificationsPermission = async (): Promise<boolean> => {
  return true;
};
