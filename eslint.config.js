const { defineConfig, globalIgnores } = require('eslint/config')

const _import = require('eslint-plugin-import')
const importHelpers = require('eslint-plugin-import-helpers')

const { fixupPluginRules } = require('@eslint/compat')

const js = require('@eslint/js')

const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})
const path = require('path')

module.exports = defineConfig([
  globalIgnores([
    '**/declarations.d.ts',
    '**/babel.config.js',
    '**/jest.config.js',
    '**/metro.config.js',
    '**/scripts/',
    '**/libraries/',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['e2e/**/*'],

    extends: compat.extends(
      '@react-native',
      'plugin:@typescript-eslint/recommended',
    ),

    languageOptions: {
      sourceType: 'module',

      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },

    plugins: {
      import: fixupPluginRules(_import),
      'import-helpers': importHelpers,
    },

    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/dot-notation': 'error',

      '@typescript-eslint/explicit-member-accessibility': [
        'off',
        {
          accessibility: 'explicit',
        },
      ],

      '@typescript-eslint/indent': 'off',

      '@typescript-eslint/member-delimiter-style': [
        'off',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true,
          },

          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],

      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-shadow': ['warn'],
      '@typescript-eslint/no-this-alias': 'warn',

      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowTaggedTemplates: true,
        },
      ],

      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/quotes': 'off',
      '@typescript-eslint/semi': ['off', null],

      '@typescript-eslint/triple-slash-reference': [
        'off',
        {
          path: 'always',
          types: 'prefer-import',
          lib: 'always',
        },
      ],

      '@typescript-eslint/type-annotation-spacing': 'off',
      '@typescript-eslint/unified-signatures': 'warn',
      'arrow-parens': ['off', 'always'],
      'brace-style': ['off', 'off'],
      'comma-dangle': 'off',
      complexity: 'off',
      'constructor-super': 'error',
      'eol-last': 'off',
      eqeqeq: ['error', 'smart'],
      'guard-for-in': 'error',
      'id-blacklist': 'off',
      'id-match': 'off',
      'import/order': 'off',
      'linebreak-style': 'off',
      'max-classes-per-file': 'off',
      'max-len': 'off',
      'new-parens': 'off',
      'newline-per-chained-call': 'off',
      'no-bitwise': 'warn',
      'no-caller': 'error',
      'no-cond-assign': 'error',

      'no-console': [
        'error',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],

      'no-debugger': 'error',
      'no-empty': 'off',
      'no-eval': 'error',
      'no-extra-semi': 'off',
      'no-fallthrough': 'off',
      'no-invalid-this': 'off',
      'no-irregular-whitespace': 'off',
      'no-multiple-empty-lines': 'off',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'off',
      'no-undef-init': 'error',
      'no-underscore-dangle': 'off',
      'no-unsafe-finally': 'error',
      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'prefer-const': 'warn',
      'prefer-spread': 'warn',
      'quote-props': 'off',
      radix: 'off',
      'react/jsx-boolean-value': 'off',
      'react/jsx-curly-spacing': 'off',
      'react/jsx-equals-spacing': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-bind': 'off',

      'react/jsx-tag-spacing': [
        'off',
        {
          afterOpening: 'allow',
          closingSlash: 'allow',
        },
      ],

      'react/jsx-wrap-multilines': 'off',
      'react/self-closing-comp': 'error',
      'space-before-function-paren': 'off',
      'space-in-parens': ['off', 'never'],
      'use-isnan': 'error',
      'valid-typeof': 'off',

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            '/^react$/',
            '/^react-native$/',
            'module',
            '/^assets/',
            '/^components/',
            '/^hooks/',
            '/^mutations/',
            '/^providers/',
            '/^queries/',
            '/^shared/',
            '/^utils/',
            '/^views/',
            ['parent', 'sibling', 'index'],
          ],

          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],

      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
])
