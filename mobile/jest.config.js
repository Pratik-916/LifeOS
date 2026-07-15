module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|@sentry|native-base|react-native-svg|lucide-react-native)',
  ],
  collectCoverage: false,
  moduleNameMapper: {
    // Map nativewind to our manual mock
    '^nativewind$': '<rootDir>/__mocks__/nativewind.js',
    // Map lucide-react-native ESM to CJS to avoid "Unexpected token 'export'"
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'setup.ts', 'utils.tsx', 'mocks/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
