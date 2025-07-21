import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

type Fixtures = {
  home: HomePage;
};

export const test = base.extend<Fixtures>({
  home: async ({ page, baseURL }, use) => {
    const home = new HomePage(page);
    await home.goto(baseURL ?? "https://react.dev");
    await use(home);
  },
});

export { expect };
