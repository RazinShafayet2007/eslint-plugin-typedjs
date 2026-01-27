#!/usr/bin/env node

const { ESLint } = require('eslint');
const path = require('path');
const fs = require('fs');

async function runCLI() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
TypedJS ESLint CLI

Usage:
  typedjs-eslint [options] [file.js] [dir]

Options:
  --help, -h     Show this help message
  --version, -v  Show version
  --fix          Automatically fix problems

Examples:
  typedjs-eslint file.js              # Lint a single file
  typedjs-eslint src/                  # Lint a directory
  typedjs-eslint --fix file.js         # Lint and fix a file
  typedjs-eslint "*.js"               # Lint files matching pattern (requires quotes)
`);
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    const packagePath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`v${packageJson.version}`);
    process.exit(0);
  }

  // Remove --fix flag from args if present
  const fix = args.includes('--fix');
  const filesToLint = args.filter(arg => arg !== '--fix');

  if (filesToLint.length === 0) {
    console.error('Error: No files specified. Use --help for usage information.');
    process.exit(1);
  }

  try {
    const eslint = new ESLint({
      overrideConfig: {
        extends: ['plugin:eslint-plugin-typedjs/recommended']
      },
      rulePaths: [path.join(__dirname, '../')],
      fix: fix,
      baseConfig: {
        env: {
          es6: true,
          node: true
        }
      }
    });

    const results = await eslint.lintFiles(filesToLint);
    
    let errorCount = 0;
    let warningCount = 0;
    let fixableCount = 0;

    results.forEach(result => {
      errorCount += result.errorCount;
      warningCount += result.warningCount;
      fixableCount += result.fixableErrorCount + result.fixableWarningCount;

      if (result.messages.length > 0) {
        console.log(`\n${path.relative(process.cwd(), result.filePath)}:`);
        result.messages.forEach(message => {
          const severity = message.severity === 2 ? 'error' : 'warning';
          console.log(`  ${message.line}:${message.column}  ${severity}  ${message.message} (${message.ruleId})`);
        });
      }

      // Apply fixes if --fix was used
      if (fix && result.output) {
        ESLint.outputFixes(result);
      }
    });

    console.log(`\n✨ Done.`);
    if (errorCount > 0 || warningCount > 0) {
      console.log(`Found ${errorCount} error${errorCount !== 1 ? 's' : ''} and ${warningCount} warning${warningCount !== 1 ? 's' : ''}${fixableCount > 0 ? ` (${fixableCount} fixable${fixableCount !== 1 ? '' : ''})` : ''}.`);
    } else {
      console.log('No issues found! 🎉');
    }

    if (errorCount > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runCLI().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});