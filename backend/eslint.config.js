import js from "@eslint/js"
import globals from "globals"

export default [
    js.configs.recommended,

   {
        languageOptions: {
            ecmaVersion: 'latest', 
            sourceType: 'module',
            globals: {
                ...globals.node
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "semi": ["warn", "never"]
        },
        ignores: ['dist', '.eslintrc.cjs']
   }
];
