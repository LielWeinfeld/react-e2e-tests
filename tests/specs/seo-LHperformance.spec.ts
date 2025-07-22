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

test("Lighthouse audit (non-blocking)", async ({ browserName }) => {
  test.skip(browserName !== "chromium", "Lighthouse audit requires Chromium");
  test.setTimeout(120_000);
  const { playAudit } = await import("playwright-lighthouse");

  const { default: ReportGenerator } =
    (await import(
      "lighthouse/report/generator/report-generator.js"
    )) as unknown as { default: any };

  const fs = await import("node:fs/promises");
  const port = await getFreePort();

  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${port}`],
  });

  const page = await browser.newPage();
  const home = new HomePage(page);
  await home.goto();

  const auditResult = await playAudit({
    page,
    port,
    thresholds: { performance: 0 }, // never fail the test
  });

  const rawScore = auditResult.lhr.categories.performance?.score;
  const perfScore =
    rawScore != null ? (rawScore * 100).toFixed(0) : "N/A";
  console.log(`Lighthouse performance score: ${perfScore}`);

  const reportHtml: string = ReportGenerator.generateReport(
    auditResult.lhr,
    "html"
  );

  const reportPath = "lighthouse-report.html";
  await fs.writeFile(reportPath, reportHtml);
  console.log(`Lighthouse report saved to: ${reportPath}`);

  await browser.close();
});
