import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      '@angular-eslint': angularEslintPlugin,
    },
    rules: {
      // Angular
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // JS
      'eqeqeq': ['error', 'smart'],
      'no-console': 'warn',
      'no-debugger': 'error',
    }
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
    },
  }
];
