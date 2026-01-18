// tests/no-op.js (updated – Use CommonJS, proper parser)

const { RuleTester } = require("eslint");
const rule = require("../lib/rules/no-op");

const tester = new RuleTester({
  languageOptions: {
    parser: require("../lib/parser"),
    ecmaVersion: 2024
  }
});

tester.run("no-op", rule, {
  valid: [
    "let x: number = 1;"  // TypedJS syntax – parser handles it
  ],
  invalid: []
});