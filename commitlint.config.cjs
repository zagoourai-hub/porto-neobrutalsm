module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "style", "docs", "test", "chore", "perf", "ci", "revert", "build"],
    ],
    "scope-enum": [
      1,
      "always",
      ["frontend", "docker", "prisma", "auth", "ui", "api"],
    ],
    "subject-max-length": [2, "always", 72],
    "subject-case": [2, "always", "lower-case"],
  },
};
