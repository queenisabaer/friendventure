import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'], 
    languageOptions: { globals: globals.browser },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', 

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    overrides: [
      {
        files: ['**/*.tsx'],
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          parser: '@typescript-eslint/parser',
        },
        plugins: {
          '@typescript-eslint': '@typescript-eslint/eslint-plugin',
        },
        extends: [
          'plugin:@typescript-eslint/recommended',
          'plugin:react/recommended',
          'plugin:react-hooks/recommended',
        ],
        rules: {
          'react/react-in-jsx-scope': 'off',
        },
      },
    ],
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
