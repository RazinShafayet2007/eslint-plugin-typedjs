# ESLint Plugin for TypedJS

> **⚠️ Note:** This is an internal validation engine for the [TypedJS VSCode Extension](https://marketplace.visualstudio.com/items?itemName=razinshafayet.typedjs-vscode). Most users don't need to install this separately - just install the VSCode extension!

Comprehensive ESLint plugin for TypedJS with full TypeScript-compatible type system support.

## When Should You Use This?

### ✅ Use the TypedJS VSCode Extension (Recommended)
For most developers, the **[TypedJS VSCode Extension](https://marketplace.visualstudio.com/items?itemName=razinshafayet.typedjs-vscode)** is all you need:
- Built-in validation (no setup required)
- Syntax highlighting
- IntelliSense
- Hover information
- Just install and start coding!
```bash
code --install-extension razinshafayet.typedjs-vscode
```

### ✅ Use This ESLint Plugin If:
- You want to integrate TypedJS validation into existing ESLint workflows
- You need CI/CD linting for TypedJS files
- You're using a non-VSCode editor (Vim, Emacs, Sublime)
- You want standalone command-line linting

## Installation
```bash
npm install -g eslint-plugin-typedjs
```

## Quick Start

### Option 1: CLI Usage (Standalone)
```bash
# Lint a single file
typedjs-eslint app.tjs

# Lint a directory
typedjs-eslint src/

# Lint and auto-fix issues
typedjs-eslint --fix app.tjs

# Lint files matching pattern
typedjs-eslint "**/*.tjs"

# Show help
typedjs-eslint --help

# Show version
typedjs-eslint --version
```

### Option 2: Integrate with Existing ESLint

#### Using Flat Config (ESLint 9+)
```javascript
// eslint.config.js
const typedjs = require('eslint-plugin-typedjs');

module.exports = [
  {
    files: ["**/*.tjs", "**/*.js"],
    languageOptions: {
      parser: typedjs.parser,
      ecmaVersion: 2024,
      sourceType: "module"
    },
    plugins: {
      typedjs
    },
    rules: {
      "typedjs/no-op": "error"
    }
  }
];
```

#### Using Legacy Config (.eslintrc)
```json
{
  "parser": "eslint-plugin-typedjs/lib/parser",
  "plugins": ["typedjs"],
  "rules": {
    "typedjs/no-op": "error"
  }
}
```

## Supported Type Features

This plugin validates all TypeScript types:

### Basic Types
```javascript
let name: string = "TypedJS";
let age: number = 25;
let isActive: boolean = true;
let nothing: null = null;
let undef: undefined = undefined;
let big: bigint = 9007199254740991n;
let sym: symbol = Symbol("unique");
```

### Advanced Types
```javascript
// Any, Unknown, Never, Void
let anyValue: any = "anything";
let unknownValue: unknown = getValue();
let neverValue: never;
let voidFunc: void;

// Literal Types
type Status = "active" | "inactive";
type Count = 1 | 2 | 3;

// Union & Intersection
type ID = string | number;
type Person = Named & Aged;
```

### Collections
```javascript
// Arrays
let scores: Array<number> = [10, 20, 30];
let names: string[] = ["Alice", "Bob"];

// Tuples
let point: [number, number] = [10, 20];
let labeled: [x: number, y: number] = [5, 10];
let optional: [string, number?] = ["test"];
let rest: [string, ...number[]] = ["items", 1, 2, 3];

// Maps, Sets, Records
let userMap: Map<string, number> = new Map();
let uniqueIds: Set<number> = new Set([1, 2, 3]);
let ages: Record<string, number> = { alice: 30 };
```

### Interfaces & Objects
```javascript
interface User {
  id: number;
  name: string;
  email?: string;  // Optional
  readonly created: Date;  // Readonly
}

// Index signatures
interface Dictionary {
  [key: string]: number;
}
```

### Enums
```javascript
enum Color {
  Red,
  Green,
  Blue
}

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}
```

### Utility Types
```javascript
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutEmail = Omit<User, "email">;
```

### Template Literals
```javascript
type EventName = `on${Capitalize<string>}`;
type Direction = "left" | "right";
type Position = `${Direction}-${number}`;
```

## Validation Features

### Type Mismatch Detection
```javascript
// ❌ Error: Type mismatch
let age: number = "25";  // Expected number, got string

// ✅ Correct
let age: number = 25;
```

### Missing Property Detection
```javascript
interface User {
  id: number;
  name: string;
}

// ❌ Error: Missing property 'name'
const user: User = { id: 1 };

// ✅ Correct
const user: User = { id: 1, name: "Alice" };
```

### Extra Property Detection
```javascript
interface User {
  id: number;
  name: string;
}

// ❌ Error: Unexpected property 'email'
const user: User = { 
  id: 1, 
  name: "Alice",
  email: "alice@example.com"  // Not in interface
};
```

### Union Type Validation
```javascript
type ID = string | number;

// ✅ Both valid
let id1: ID = "abc123";
let id2: ID = 12345;

// ❌ Error: Not in union
let id3: ID = true;  // boolean not in union
```

### Enum Validation
```javascript
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// ❌ Error: Invalid enum value
let status: Status = "PENDING";  // Not a valid Status value

// ✅ Correct
let status: Status = Status.Active;
```

### Tuple Validation
```javascript
// ❌ Error: Wrong tuple length
let point: [number, number] = [10];

// ❌ Error: Wrong element type
let point: [number, number] = [10, "20"];

// ✅ Correct
let point: [number, number] = [10, 20];
```

## Configuration Options

### Rule: `typedjs/no-op`

This is the main validation rule that checks all type annotations.

**Severity Levels:**
- `"error"` - Show as errors (recommended for CI/CD)
- `"warn"` - Show as warnings
- `"off"` - Disable validation
```javascript
// eslint.config.js
module.exports = [{
  rules: {
    "typedjs/no-op": "error"  // Recommended
  }
}];
```

## CI/CD Integration

### GitHub Actions
```yaml
name: TypedJS Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g eslint-plugin-typedjs
      - run: typedjs-eslint "src/**/*.tjs"
```

### GitLab CI
```yaml
lint:
  script:
    - npm install -g eslint-plugin-typedjs
    - typedjs-eslint "src/**/*.tjs"
```

### Pre-commit Hook
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "typedjs-eslint --fix $(git diff --cached --name-only --diff-filter=ACM | grep '\\.tjs$')"
    }
  }
}
```

## Editor Integration

### Vim/Neovim (ALE)
```vim
let g:ale_linters = {
\   'typedjs': ['eslint'],
\}
let g:ale_fixers = {
\   'typedjs': ['eslint'],
\}
```

### Sublime Text (SublimeLinter)

Install SublimeLinter-eslint and this plugin will work automatically.

### VS Code

**Just install the [TypedJS Extension](https://marketplace.visualstudio.com/items?itemName=razinshafayet.typedjs-vscode)** - it includes this plugin automatically!

## Troubleshooting

### "Cannot find module 'eslint-plugin-typedjs'"

Make sure it's installed globally:
```bash
npm install -g eslint-plugin-typedjs
```

### Parser errors

Ensure you're using the TypedJS parser:
```javascript
languageOptions: {
  parser: require('eslint-plugin-typedjs/lib/parser')
}
```

### No errors shown

Check your ESLint config includes the rule:
```javascript
rules: {
  "typedjs/no-op": "error"
}
```

## CLI Options
```bash
typedjs-eslint [options] [file.tjs] [dir]

Options:
  --help, -h     Show help message
  --version, -v  Show version
  --fix          Automatically fix problems

Examples:
  typedjs-eslint file.tjs              # Lint a single file
  typedjs-eslint src/                  # Lint a directory
  typedjs-eslint --fix file.tjs        # Lint and fix
  typedjs-eslint "*.tjs"               # Pattern matching
```

## API Usage
```javascript
const { ESLint } = require('eslint');
const typedjs = require('eslint-plugin-typedjs');

async function lintFiles() {
  const eslint = new ESLint({
    overrideConfig: {
      languageOptions: {
        parser: typedjs.parser
      },
      plugins: { typedjs },
      rules: {
        'typedjs/no-op': 'error'
      }
    }
  });

  const results = await eslint.lintFiles(['src/**/*.tjs']);
  const formatter = await eslint.loadFormatter('stylish');
  console.log(formatter.format(results));
}
```

## Related Projects

- **[TypedJS CLI](https://www.npmjs.com/package/@razinshafayet/typedjs)** - Runtime type checking for TypedJS
- **[TypedJS VSCode Extension](https://marketplace.visualstudio.com/items?itemName=razinshafayet.typedjs-vscode)** - Full IDE support with built-in validation

## Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [GitHub Repository](https://github.com/RazinShafayet2007/eslint-plugin-typedjs)
- [Report Issues](https://github.com/RazinShafayet2007/eslint-plugin-typedjs/issues)
- [TypedJS Main Project](https://github.com/RazinShafayet2007/typedjs)
- [TypedJS CLI on npm](https://www.npmjs.com/package/@razinshafayet/typedjs)

---

**Made with ❤️ by [Razin Shafayet](https://github.com/RazinShafayet2007)**

---

## Quick Reference

| Need | Solution |
|------|----------|
| Editor validation | [TypedJS VSCode Extension](https://marketplace.visualstudio.com/items?itemName=razinshafayet.typedjs-vscode) |
| Runtime checking | [TypedJS CLI](https://www.npmjs.com/package/@razinshafayet/typedjs) |
| CI/CD linting | This ESLint plugin |
| Non-VSCode editor | This ESLint plugin |

**For 90% of users: Just install the VSCode extension!** 🚀