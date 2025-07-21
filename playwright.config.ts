import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for testing https://react.dev/
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "https://react.dev/",
    trace: "retain-on-failure", 
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000, 
    navigationTimeout: 30_000, 
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
});
