// Updated index.js for eslint-plugin-typedjs – Parser as object for flat config compatibility

const acorn = require("acorn");
const acornTS = require("acorn-typescript");

const tsFactory = acornTS.default || acornTS;
const tsPlugin = tsFactory();

const TypedJSParser = acorn.Parser.extend(tsPlugin);

// Export parser as object with parseForESLint (preferred by ESLint)
const parser = {
  parse(code, options) {
    return TypedJSParser.parse(code, options);
  },
  parseForESLint(code, options) {
    return {
      ast: TypedJSParser.parse(code, options),
      services: {},
      visitorKeys: TypedJSParser.acorn.visitorKeys || {},
      scopeManager: null
    };
  }
};

module.exports = {
  meta: {
    name: "eslint-plugin-typedjs",
    version: "0.1.0"
  },
  configs: {
    recommended: [
      {
        languageOptions: {
          parser: parser,  // Now an object with parse/parseForESLint
          ecmaVersion: 2024,
          sourceType: "module",
          globals: {
            process: "readonly",
            Buffer: "readonly",
            console: "readonly",
            global: "readonly",
            __dirname: "readonly",
            __filename: "readonly",
            exports: "readonly",
            module: "readonly",
            require: "readonly"
          }
        },
        plugins: {
          typedjs: module.exports
        }
      }
    ]
  },
  rules: {
    "no-op": {
      meta: { type: "suggestion" },
      create() { return {}; }
    }
  }
};