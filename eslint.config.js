import eslintPluginAstro from "eslint-plugin-astro";
import js from "@eslint/js";
import * as astroParser from "astro-eslint-parser";

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },
];
