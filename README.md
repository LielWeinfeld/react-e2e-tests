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

## Requirements

- monimal node version 22.0.0

## Run Playwright tests

Install dependencies:

```bash
npm ci
```

# Run all tests locally:

```bash
npx playwright test
```

# Run tests for a specific browser:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

# View Playwright HTML report:

```bash
npx playwright show-report
```
