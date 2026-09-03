const SRC_MODULES = ['@types', 'assets', 'shared']

module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      {
        unstable_disableES6Transforms: true,
        lazyImports: true,
      },
    ],
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          /**
           * Regular expression is used to match all files inside `./src` directory and map each `.src/folder/[..]` to `~folder/[..]` path
           */
          [`^(${SRC_MODULES.join('|')})\/(.+)`]: './src/\\0',
        },
      },
    ],
    // Caution: react-native-worklets/plugin has to be listed last.
    'react-native-worklets/plugin',
  ],
}
