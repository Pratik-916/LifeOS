// __mocks__/nativewind.js
// Full NativeWind v2 mock for Jest
// The nativewind/babel plugin injects NativeWindStyleSheet.create() calls at transpile time,
// so this mock MUST export a proper NativeWindStyleSheet object.

const NativeWindStyleSheet = {
  create: (styles) => styles,
  setOutput: () => {},
  generate: () => {},
  reset: () => {},
};

module.exports = {
  __esModule: true,
  styled: (Component) => Component,
  useTailwind: () => () => ({}),
  useColorScheme: () => ({ colorScheme: 'light', setColorScheme: () => {} }),
  NativeWindStyleSheet,
  default: { NativeWindStyleSheet },
};
