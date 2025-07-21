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

## Run Playwright tests

Install dependencies:

```bash
$ npm ci
```

# Run all tests locally:

$ npx playwright test$

# Run tests for a specific browser:

$ npx playwright test --project=chromium
$ npx playwright test --project=firefox
$ npx playwright test --project=webkit
$

# View Playwright HTML report:

$ npx playwright show-report
