import js from '@eslint/js'
import parser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // ── Global ignores ──────────────────────────────────────────────
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/drizzle/**'],
  },

  // ── Base JavaScript rules for all files ──────────────────────────
  js.configs.recommended,

  // ── API: TypeScript type-checked rules ───────────────────────────
  {
    name: 'api/ts',
    files: ['api/src/**/*.ts'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowNullish: true },
      ],
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },

  // ── Web: TypeScript type-checked rules + React ───────────────────
  {
    name: 'web/ts',
    files: ['web/src/**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'warn',
      // Common route/prop sync patterns are acceptable in this starter UI.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Stylistic preferences that conflict with idiomatic React
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // localStorage + JSON.parse are inherently dynamic
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      // JSX template literals commonly mix string/numbers
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowNullish: true },
      ],
      // navigate() / signIn() in event handlers are common patterns
      '@typescript-eslint/no-floating-promises': 'warn',
      // strict null checks often noisy in React codebases
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
      // Date.now() in render is impure but common for "last seen" UI
      'react-hooks/purity': 'warn',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },

  // ── Shared types package ─────────────────────────────────────────
  {
    name: 'packages/types',
    files: ['packages/types/src/**/*.ts'],
    extends: [...tseslint.configs.strict],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
    },
  },

  // ── Root & workspace config files (no type checking) ─────────────
  {
    name: 'config-files',
    files: [
      '*.config.{js,mjs,cjs,ts,mts,cts}',
      '**/*.config.{js,mjs,cjs,ts,mts,cts}',
      '.prettierrc.{js,cjs}',
    ],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      parser,
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // ── Prettier — must come last ────────────────────────────────────
  prettier,
)
