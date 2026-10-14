module.exports = {
  preset: '@react-native/jest-preset',
  // mobx resolves to its ESM build under the react-native export condition
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|mobx)/)',
  ],
  testMatch: ['<rootDir>/{__tests__,src}/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '^@types(.*)$': ['src/@types/*'],
    '^assets(.*)$': '<rootDir>/src/assets$1',
    '^shared(.*)$': '<rootDir>/src/shared$1',
    '^tests(.*)$': '<rootDir>/__tests__$1',
    '^src(.*)$': '<rootDir>/src$1',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup-tests.ts'],
}
