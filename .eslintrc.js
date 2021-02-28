module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort'],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'import/default': 'off',
    'import/order': 'off',
    'no-console': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
  },
  overrides: [
    {
      files: '*.js',
      rules: {
        'import/order': ['error', { 'newlines-between': 'always' }],
        'simple-import-sort/imports': 'off',
      },
    },
    {
      files: ['*.{config,d,test}.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
      typescript: {},
      alias: {
        map: [['@/*', './src/*']],
        extensions: ['.ts', '.js', '.json'],
      },
    },
  },
}
