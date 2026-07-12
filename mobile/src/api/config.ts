import { Platform } from 'react-native';

const getBaseUrl = () => {
  // If running on Android emulator, localhost is 10.0.2.2
  // If running on iOS simulator, localhost is 127.0.0.1
  // If testing on a physical device, this MUST be your computer's local IP address
  
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000';
    }
    return 'http://127.0.0.1:8000';
  }
  
  // Production URL would go here
  return 'https://api.lifeos.example.com';
};

export const API_CONFIG = {
  baseURL: getBaseUrl(),
  timeout: 10000,
};
