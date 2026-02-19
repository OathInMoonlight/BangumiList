import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"


export default defineConfig([
    { files: [ "**/*.{js,mjs,cjs,ts,mts,cts}" ], plugins: { js }, extends: [ "js/recommended" ] },
    { files: [ "**/*.js" ], languageOptions: { sourceType: "module" } },
    { files: [ "**/*.{js,mjs,cjs,ts,mts,cts}" ], languageOptions: { globals: globals.node } },
    tseslint.configs.recommended,

    {
        files: [ "**/*.{js,mjs,cjs,ts,mts,cts}" ],
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [ "warn" ], // 提示未使用的变量

            indent: [ "error", 4 ], // 缩进4个空格
            semi: [ "error", "never" ], // 不使用分号
            "eol-last": [ "error", "never" ], // 文件末尾不换行
            quotes: [ "error", "double" ], // 使用双引号
            "comma-dangle": [ "error", "never" ], // 不使用尾逗号
            "array-bracket-spacing": [ "error", "always" ],
            "object-curly-spacing": [ "error", "always" ], // 大括号内有空格
            "space-before-blocks": [ "error", "always" ], // 块前有空格
            "brace-style": [ "error", "1tbs", { "allowSingleLine": true } ] // 大括号风格为1TBS，允许单行
        }
    }
])