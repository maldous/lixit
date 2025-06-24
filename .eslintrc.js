module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended"],
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
      },
    },
    {
      files: [
        "**/__tests__/**/*.{ts,tsx}",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/setupTests.{ts,tsx}",
      ],
      env: {
        jest: true,
      },
    },
    {
      files: [
        "apps/mobile/**/*.{ts,tsx,js,jsx}",
        "packages/ui-kit/**/*.{ts,tsx}",
      ],
      plugins: ["@typescript-eslint", "react", "react-native"],
      extends: ["eslint:recommended"],
      env: {
        browser: true,
        "react-native/react-native": true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
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
    },
    {
      files: ["apps/web/**/*.{ts,tsx,js,jsx}"],
      plugins: ["@typescript-eslint", "react"],
      extends: ["eslint:recommended", "next/core-web-vitals"],
      env: {
        browser: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
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
    },
    {
      files: ["services/ingestion-api/**/*.ts"],
      env: {
        node: true,
        jest: true,
      },
      rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
