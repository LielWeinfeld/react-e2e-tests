import { defineConfig, devices, PlaywrightTestConfig } from "@playwright/test";

/**
 * Playwright configuration for end-to-end tests
 * targeting https://react.dev/.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,          
  forbidOnly: false,
  retries: process.env.CI ? 2 : 0,                  

  timeout: 30_000,          // per test
  expect: { timeout: 5_000 },

  reporter: [
    ["list"],                                        // CLI output
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],

  use: {
  baseURL: "https://react.dev/",
  headless: false,
  trace: "retain-on-failure",
  screenshot: "only-on-failure",
  video: "retain-on-failure",
  actionTimeout: 10_000,
  navigationTimeout: 30_000
},

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
} satisfies PlaywrightTestConfig);
