import { test, expect } from "../fixtures/index";
import { HomePage } from "../pages/HomePage";

const viewports = [
  { name: "mobile-small", width: 320, height: 568 },
  { name: "mobile", width: 375, height: 812 },
  { name: "mobile-large", width: 414, height: 896 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "desktop-small", width: 1280, height: 800 },
  { name: "desktop-medium", width: 1440, height: 900 },
  { name: "desktop-large", width: 1920, height: 1080 },
];

/*  UI basics  */
test.describe("UI basics", () => {
  test.beforeEach(async ({ home }) => {
    await home.goto();
  });

  test("Header & footer are visible", async ({ home }) => {
    await home.header.expectVisible();
    await home.footer.expectVisible();
  });

  test("Theme toggle works and persists", async ({ home }) => {
    const wasDark = await home.header.isDark();

    await home.header.toggleTheme();
    expect(await home.header.isDark()).toBe(!wasDark);

    await home.reload();
    expect(await home.header.isDark()).toBe(!wasDark);
  });

  test("All internal links on home page should be valid", async ({ home }) => {
    await home.checkAllLinksAreValid();
  });
});

/*  Responsive layout test  */
for (const vp of viewports) {
  test.describe(vp.name, () => {
    test.use({ viewport: vp });

    test(`layout on ${vp.name}`, async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();
      // Checking that the Header exists
      await expect(homePage.header.navbar).toBeVisible();
    });
  });
}

/*  Scroll behavior test  */
test("Anchor scroll works", async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  // Scroll down manually to a target section using evaluate()
  await home.page.evaluate(() => {
    const section = document.querySelector("section");
    if (section) section.scrollIntoView();
  });

  const position = await home.page.evaluate(() => window.scrollY);
  expect(position).toBeGreaterThan(0);
});
