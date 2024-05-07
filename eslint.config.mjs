import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { rules: {
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'max-len': ['error', { code: 90 }],
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off',
    radix: 'off',
  }},
  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
];