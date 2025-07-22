import { expect, test } from "@playwright/test";
import { chromium } from "playwright";
import net from "node:net";
import { HomePage } from "../pages/HomePage";

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server
      .listen(0, () => {
        const { port } = server.address() as net.AddressInfo;
        server.close(() => resolve(port));
      })
      .on("error", reject);
  });
}

test("Home page should have correct SEO tags", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  expect(await homePage.getTitle()).toBe(homePage.expectedTitle);
  expect(await homePage.getMetaDescriptionContent()).toBe(
    homePage.expectedDescription
  );
});

test("Lighthouse audit (non-blocking)", async ({ browserName }) => {
  test.skip(browserName !== "chromium", "Lighthouse audit requires Chromium");
  test.setTimeout(120_000);

  const { playAudit } = await import("playwright-lighthouse");
  const { ReportGenerator } = await import(
    "lighthouse/report/generator/report-generator.js"
  );
  const fs = await import("node:fs/promises");

  const port = await getFreePort();
  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${port}`],
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  const homePage = new HomePage(page);
  await homePage.goto();
  await page.waitForLoadState("networkidle");

  const auditResult = await playAudit({
    page,
    port,
    thresholds: { performance: 0 }, 
  });

  const perfScore =
    auditResult.lhr.categories.performance?.score != null
      ? (auditResult.lhr.categories.performance.score * 100).toFixed(0)
      : "N/A";

  const reportPath = "lighthouse-report.html";
  const reportHtml = ReportGenerator.generateReport(auditResult.lhr, "html");
  await fs.writeFile(reportPath, reportHtml);

  console.log(`Lighthouse performance score: ${perfScore}`);
  console.log(`Lighthouse report: file://${process.cwd()}/${reportPath}`);

  await browser.close();
});
