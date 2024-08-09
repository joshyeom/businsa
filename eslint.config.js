import { ESLint } from 'eslint';
import typescriptParser from '@typescript-eslint/parser';
import eslintRecommended from 'eslint/configs/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginTypescript from '@typescript-eslint/eslint-plugin';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  // 파일 패턴 지정
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },

  // 언어 옵션 설정
  {
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...ESLint.recommendedGlobals,
        ...ESLint.browserGlobals,
      },
    },
  },

  // 플러그인 설정 및 확장
  eslintRecommended,
  pluginReact.configs.recommended,
  pluginReactHooks.configs.recommended,
  pluginTypescript.configs.recommended,
  pluginPrettier.configs.recommended,

  // 규칙 설정
  {
    rules: {
      quotes: ['error', 'single'],
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'error',
      'no-multiple-empty-lines': 'error',
    },
  },

  // import/resolver 설정
  {
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
];
