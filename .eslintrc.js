module.exports = {
  root: true,
  extends: ["./packages/shared/.eslintrc.js"],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".next/",
    "out/",
    ".turbo/",
    "coverage/",
  ],
};
