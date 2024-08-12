const path = require("path");

module.exports = {
  root: true,
  extends: [path.resolve(__dirname, "../.eslintrc.js")],
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.json"),
    tsconfigRootDir: __dirname,
  },
  settings: {
    "import/resolver": {
      node: {
        paths: [path.resolve(__dirname, "../node_modules")],
        paths: [path.resolve(__dirname, "node_modules")],
      },
    },
    jest: {
      version: "detect",
      packageJson: path.resolve(__dirname, "package.json"),
    },
  },
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "off",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "jest/no-mocks-import": "off",
    "jest/expect-expect": "off",
    "jest/no-export": "off",
  },
};
