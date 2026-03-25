module.exports = {
  presets: [
    'module:@react-native/babel-preset'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          '@': './app',
          '@component': './app/shared/component',
          '@shared': './app/shared',
          '@constants': './app/shared/constants',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-worklets/plugin',
  ],
};
