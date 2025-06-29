// Apply ESLint patch for Next.js compatibility
require("@rushstack/eslint-patch/modern-module-resolution");

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
const storybook = require("eslint-plugin-storybook");

const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const reactNative = require("eslint-plugin-react-native");
const nextPlugin = require("@next/eslint-plugin-next");

module.exports = [
// Base configuration for all files
{
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/coverage/**",
    "**/.turbo/**",
    "**/.expo/**",
  ],
}, 
// JavaScript/TypeScript base config
{
  files: ["**/*.{js,mjs,cjs,ts,tsx}"],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    globals: {
      console: "readonly",
      process: "readonly",
      Buffer: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      exports: "readonly",
      global: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
  },
  rules: {
    ...js.configs.recommended.rules,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
  },
}, 
// Test files
{
  files: [
    "**/__tests__/**/*.{ts,tsx}",
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
    "**/setupTests.{ts,tsx}",
  ],
  languageOptions: {
    globals: {
      jest: "readonly",
      describe: "readonly",
      it: "readonly",
      test: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
      beforeAll: "readonly",
      afterAll: "readonly",
      setTimeout: "readonly",
      clearTimeout: "readonly",
      setInterval: "readonly",
      clearInterval: "readonly",
    },
  },
}, 
// React/React Native files
{
  files: [
    "apps/mobile/**/*.{ts,tsx,js,jsx}",
    "packages/ui-kit/**/*.{ts,tsx}",
  ],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      React: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
    react: react,
    "react-native": reactNative,
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}, 
// Next.js web app
{
  files: ["apps/web/**/*.{ts,tsx,js,jsx}"],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      React: "readonly",
      window: "readonly",
      document: "readonly",
      navigator: "readonly",
      localStorage: "readonly",
      sessionStorage: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
    react: react,
    "@next/next": nextPlugin,
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "@next/next/no-html-link-for-pages": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}, 
// NestJS API service
{
  files: ["services/ingestion-api/**/*.ts"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
}, 
// GrapesJS server
{
  files: ["services/grapesjs-server/**/*.ts"],
  languageOptions: {
    globals: {
      Express: "readonly",
    },
  },
}, 
...storybook.configs["flat/recommended"]
];
