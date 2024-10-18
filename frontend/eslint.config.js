import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default [
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    {
        files: ["**/*.{js,mjs,cjs,jsx}"]
    },
    {
        languageOptions: { 
            globals: globals.browser 
        }, 
        rules: {
            // suppress errors for missing 'import React' in files
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off"
        },
        settings: {
            react: {
              version: "detect"
            }
        }
    }
];