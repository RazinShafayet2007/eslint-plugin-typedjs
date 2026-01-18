// lib/parser.js (unchanged – working)

const acorn = require("acorn");
const acornTS = require("acorn-typescript");

const tsFactory = acornTS.default || acornTS;
const tsPlugin = tsFactory();

const TypedJSParser = acorn.Parser.extend(tsPlugin);

module.exports = {
  parse(code, options) {
    return TypedJSParser.parse(code, options);
  },
  parseForESLint(code, options) {
    const ast = TypedJSParser.parse(code, options);
    return {
      ast,
      services: {},
      visitorKeys: acorn.visitorKeys,
      scopeManager: null
    };
  }
};