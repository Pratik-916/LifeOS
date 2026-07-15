module.exports = function (api) {
  const isTest = api.env('test');
  api.cache.using(() => isTest);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Skip nativewind Babel transform in Jest — NativeWind is fully mocked
      ...(isTest ? [] : ['nativewind/babel']),
      'react-native-reanimated/plugin',
    ],
  };
};
