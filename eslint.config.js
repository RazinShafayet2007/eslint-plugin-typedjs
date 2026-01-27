const path = require('path');

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      parser: require('./lib/parser.js'),
      ecmaVersion: 2024,
      sourceType: "module"
    },
    plugins: {
      typedjs: require('./index.js')
    },
    rules: {
      "typedjs/no-op": "error"
    }
  }
];