import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"

export default [
    {
        name: "app/files-to-lint",
        files: ["**/*.{js,mjs,jsx,vue}"]
    },

    {
        name: "app/files-to-ignore",
        ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
    },

    js.configs.recommended,
    ...pluginVue.configs["flat/recommended"],

    {
        rules: {
            "vue/multi-word-component-names": "off"
        }
    },

    {
        files: ["**/*.{js,ts,vue}"],
        rules: {
            "vue/max-attributes-per-line": ["off"], // 每行属性不限制个数
            "vue/v-slot-style": ["off"], // v-slot 不限制使用方式
            "vue/first-attribute-linebreak": ["off"], // 第一行属性不限制换行
            "vue/html-closing-bracket-newline": ["error", {
                "singleline": "never",
                "multiline": "never",
                "selfClosingTag": {
                    "singleline": "never",
                    "multiline": "never"
                }
            }], // html 结束标签换行不限制
            "vue/component-tags-order": ["error", {
                "order": [["style", "template"], "script"]
            }], // 组件标签顺序
            
            "vue/html-indent": ["error", 4], // html 缩进4个空格
            indent: ["error", 4], // 缩进4个空格
            semi: ["error", "never"], // 不使用分号
            "eol-last": ["off"], // 文件末尾不换行
            quotes: ["error", "double"], // 使用双引号
            "comma-dangle": ["error", "never"] // 不使用尾逗号
        }
    }
]