/* eslint-env node */
require('@rushstack/eslint-patch/lib/patch-require')

const { defineConfig } = require('eslint-plugin-vue')

module.exports = defineConfig({
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 您可以在這裡添加或修改 Vue 和 JS 的 ESLint 規則
  }
})
