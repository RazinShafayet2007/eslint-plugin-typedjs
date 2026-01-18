// eslint.config.js (new file in plugin root – for linting the plugin itself)

module.exports = [
    {
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: "commonjs"
      },
      rules: {
        "no-undef": "off"  // Lenient for dev
      }
    }
  ];