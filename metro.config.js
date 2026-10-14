const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const defaultConfig = getDefaultConfig(__dirname)
const { assetExts, sourceExts, blockList } = defaultConfig.resolver

// Linked libraries keep their own react and react-native for their example
// apps; the app must bundle only one copy of each
const SHARED_MODULES = ['react', 'react-native']
const LIBRARY_SHARED_MODULES = new RegExp(
  `^${path.resolve(__dirname, 'libraries')}/[^/]+/(example/)?node_modules/(${SHARED_MODULES.join('|')})/.*$`
)
const sharedModulePaths = Object.fromEntries(
  SHARED_MODULES.map(name => [
    name,
    path.resolve(__dirname, 'node_modules', name),
  ])
)

const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer/react-native'
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
        allowOptionalDependencies: true,
      },
    }),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    blockList: [blockList, LIBRARY_SHARED_MODULES],
    extraNodeModules: sharedModulePaths,
  },
}

module.exports = mergeConfig(defaultConfig, config)
