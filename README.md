# React E2E Tests

This repository contains end-to-end (E2E) tests for the [React documentation site](https://react.dev) using [Playwright](https://playwright.dev).

## Features

- Accessibility tests (keyboard traversal, focusable elements)
- SEO and Lighthouse performance audits
- Layout tests for key UI components
- Runs automatically in GitHub Actions CI/CD pipeline

## Project structure

├── .github/workflows/ # GitHub Actions workflow for CI
├── tests/ # All test specs, fixtures, and page objects
│ ├── specs/
│ ├── pages/
│ └── fixtures/
├── playwright.config.ts # Playwright project configuration
├── package.json # NPM dependencies and scripts
├── README.md
├── .gitignore
├── tsconfig.json # TypeScript configuration
