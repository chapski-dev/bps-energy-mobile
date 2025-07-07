const moduleResolver = [
  require.resolve('babel-plugin-module-resolver'),
  {
    root: ['./'],
    alias: {
      '@src': './src',
      '@assets': './assets',
    },
  },
];


module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [moduleResolver, 'react-native-reanimated/plugin', 'hot-updater/babel-plugin'],

};
