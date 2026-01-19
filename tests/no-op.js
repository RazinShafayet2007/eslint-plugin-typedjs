const { RuleTester } = require("eslint");
const rule = require("../lib/rules/no-op");
const parser = require("../lib/parser"); // Import your custom parser

const tester = new RuleTester({
  // This is the critical part: tell the tester to use your TypedJS parser
  languageOptions: {
    parser: parser,
    ecmaVersion: 2024,
    sourceType: "module"
  }
});

tester.run("no-op", rule, {
  valid: [
    "let x = 1;",                                 // Standard JS
    "let staticBad: number | bigint = 'wrong';",  // TypedJS Union Type
    "function badReturn(): bigint { return 42n; }", // TypedJS Return Type
    "interface User { name: string; }"             // TypedJS Interface
  ],
  invalid: []
});