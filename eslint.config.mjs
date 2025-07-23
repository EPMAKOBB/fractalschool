// eslint.config.mjs  

// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',   // или 'warn'
      'no-unused-vars': 'off',                      // или 'warn'
      'prefer-const': 'off',                        // или 'warn'
      'no-case-declarations': 'off',
      'no-useless-escape': 'off',
    },
  },
]);
