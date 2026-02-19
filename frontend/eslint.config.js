import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import { defineConfig } from "eslint/config"


export default defineConfig([
    { files: [ "**/*.{js,mjs,cjs,ts,mts,cts,vue}" ], plugins: { js }, extends: [ "js/recommended" ] },
    { files: [ "**/*.{js,mjs,cjs,ts,mts,cts,vue}" ], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
    pluginVue.configs["flat/strongly-recommended"],
    { files: [ "**/*.vue" ], languageOptions: { parserOptions: { parser: tseslint.parser } } },

    {
        files: [ "**/*.{js,mjs,cjs,ts,mts,cts,vue}" ],
        rules: {
            "vue/multi-word-component-names": "off",
            "vue/max-attributes-per-line": "off",
            "vue/html-closing-bracket-newline": "off",
            "vue/first-attribute-linebreak": "off",

            "vue/html-indent": [ "error", 4 ],

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