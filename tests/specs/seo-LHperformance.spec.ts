import { expect, test } from "@playwright/test";
import { chromium } from "playwright";
import net from "node:net";
import { HomePage } from "../pages/HomePage";

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      // @ts-ignore – Node gives a number or string; cast is fine here
      const { port } = srv.address() as net.AddressInfo;
      srv.close(() => resolve(port));
    }).on('error', reject);
  });
}

/* SEO meta description test */

test("Home page should have correct SEO tags", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  const title = await homePage.getTitle();
  expect(title).toBe(homePage.expectedTitle);

  const description = await homePage.getMetaDescriptionContent();
  expect(description).toBe(homePage.expectedDescription);
});

/*   Lighthouse performance test  */
test("Lighthouse performance score ≥ 60 (Chromium only)", async ({
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Lighthouse audit requires Chromium");
  const { playAudit } = await import('playwright-lighthouse'); 
  const port = await getFreePort();

  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${port}`],
  });

  const page = await browser.newPage();
  const home = new HomePage(page);
  await home.goto();

  await playAudit({
    page,
    port,
    thresholds: { performance: 60 },
  });

  await browser.close();
});
