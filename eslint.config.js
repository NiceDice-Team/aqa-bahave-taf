// @ts-check
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const playwright = require('eslint-plugin-playwright');
const prettierConfig = require('eslint-config-prettier');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.features-gen/**',
      'reports/**',
      'test-results/**',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      playwright,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-console': 'warn',
    },
  },
  {
    // BDD step definitions: expect() is valid inside Given/When/Then callbacks
    files: ['steps/**/*.ts', 'support/**/*.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // False positive in BDD: expect() inside step callbacks is a valid test context
      'playwright/no-standalone-expect': 'off',
    },
  },
  // Prettier must come last to disable conflicting rules
  prettierConfig,
];
