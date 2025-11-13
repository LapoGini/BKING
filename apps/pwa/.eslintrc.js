module.exports = {
  extends: ["../../packages/shared/.eslintrc.js"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
  },
};
