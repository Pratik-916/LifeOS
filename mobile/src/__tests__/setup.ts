// Mobile test setup for jest-expo
// @testing-library/react-native v14+ includes matchers automatically

// Mock React Native Reanimated v4 (manual mock — /mock path breaks with worklets)
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  const createAnimatedComponent = (Component: any) => Component;

  const Reanimated = {
    __esModule: true,
    default: {
      call: () => {},
      createAnimatedComponent,
      View,
      Text,
      FlatList: require('react-native').FlatList,
      ScrollView: require('react-native').ScrollView,
    },
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: (fn: any) => ({}),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
    withDelay: (delay: any, anim: any) => anim,
    withSequence: (...anims: any[]) => anims[anims.length - 1],
    withRepeat: (anim: any) => anim,
    interpolate: (v: any) => v,
    Extrapolation: { CLAMP: 'clamp' },
    runOnJS: (fn: any) => fn,
    createAnimatedComponent,
    Animated: {
      View,
      Text,
      createAnimatedComponent,
      FlatList: require('react-native').FlatList,
    },
  };

  return Reanimated;
});

// Mock NativeWind / Tailwind
jest.mock('nativewind', () => ({
  styled: (Component: any) => Component,
  useTailwind: () => ({}),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => React.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaProvider: ({ children }: any) => children,
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const { View, ScrollView, TouchableOpacity } = require('react-native');
  return {
    GestureHandlerRootView: View,
    ScrollView,
    TouchableOpacity,
    PanGestureHandler: View,
    Swipeable: View,
  };
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-gifted-charts
jest.mock('react-native-gifted-charts', () => ({
  BarChart: () => null,
  LineChart: () => null,
  PieChart: () => null,
}));

// Mock axios globally for all tests
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  })),
  defaults: { headers: { common: {} } },
}));

afterEach(() => {
  jest.clearAllMocks();
});

// Provide required environment variables for Zod validation in config/environment.ts
process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8000';
