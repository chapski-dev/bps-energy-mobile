const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */


const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const svgConfig = {
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer/react-native'
    ),
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(defaultConfig, svgConfig));
