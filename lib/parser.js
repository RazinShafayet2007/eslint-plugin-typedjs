// Updated lib/parser.js – Simplified and robust for acorn-typescript v1.4.13+

// @ts-nocheck  // Silence any TypeScript-like checks in editor (since this is plain JS)

const acorn = require("acorn");
const acornTS = require("acorn-typescript");

// acorn-typescript exports a factory function (or default function) that returns the plugin
const tsFactory = acornTS.default || acornTS;  // Handle CommonJS default export

if (typeof tsFactory !== 'function') {
  throw new Error("acorn-typescript did not export a function – check installation/version");
}

const tsPlugin = tsFactory();

module.exports = acorn.Parser.extend(tsPlugin);