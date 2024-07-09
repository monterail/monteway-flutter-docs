# 🤖 GitHub Actions setup

To enable automated code quality tests, head to `.github/workflows/lint-and-test-pr.yml` and uncomment lines:

```yml
on:
  pull_request:
    branches:
      - development
```

It's off by default to not slow down development, but if your project have 3+ developers
working on it, turning it on may be beneficial.
