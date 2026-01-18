// index.js (updated – CommonJS, fixed)

const parser = require("./lib/parser");

module.exports = {
  meta: {
    name: "eslint-plugin-typedjs",
    version: "0.1.0"
  },
  configs: {
    recommended: [
      {
        languageOptions: {
          parser: parser,
          ecmaVersion: 2024,
          sourceType: "module"
        },
        plugins: {
          typedjs: module.exports
        },
        rules: {
          "typedjs/no-op": "warn"
        }
      }
    ]
  },
  rules: {
    "no-op": require("./lib/rules/no-op")
  }
};