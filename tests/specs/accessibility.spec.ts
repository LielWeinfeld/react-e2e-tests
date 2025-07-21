import { expect, test } from "../fixtures/index";
import AxeBuilder from "@axe-core/playwright";
import { HomePage } from "../pages/HomePage";

/*  Accessibility scan (a11y)  */
test("A11y scan", async ({ home }) => {
  await home.goto();

  const results = await new AxeBuilder({ page: home.page }).analyze();

  if (results.violations.length) {
    console.log(
      `\n  ${results.violations.length} accessibility issues found:\n` +
        `─────────────────────────────────────────────`,
    );

    for (const v of results.violations) {
      console.log(`id: ${v.id}`);
      console.log(`impact: ${v.impact}`);
      console.log(`description: ${v.description}`);
      console.log(`Help URL: ${v.helpUrl}`);
      console.log(`affected nodes: ${v.nodes.length}`);
      for (const node of v.nodes) {
        const selector =
          typeof node.target[0] === "string" ? node.target[0] : "";
        const summary = await home.page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return "unknown";

          // Check what "big container" it's inside
          const container = el.closest(
            "section, header, main, nav, footer, article",
          );
          const containerLabel = container ? container.tagName : "BODY";

          // Provide short identifier
          const elLabel = el.id ? `#${el.id}` : el.tagName;

          return `${elLabel} inside <${containerLabel.toLowerCase()}>`;
        }, selector);
        console.warn(`  - element: ${summary}`);
      }
      console.log("\n");
      console.log(`─────────────────────────────────────────────`);
    }
  }
});

/*  Keyboard traversal test */

test("Keyboard accessibility", async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  const forwardVisited = new Set();

  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");

    const key = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;

      const id = el.id ? `#${el.id}` : "";
      const firstClass = el.classList[0] ? `.${el.classList[0]}` : "";
      return `${el.tagName}${id}${firstClass}`;
    });

    if (key) {
      forwardVisited.add(key);

      // If it's an A or BUTTON element, press Enter on it for realism
      const tag = key.split("#")[0]; // just get tagName portion
      if (tag === "A" || tag === "BUTTON") {
        console.log(`🔹 Pressing Enter on: ${key}`);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(100); // short pause after action
      }
    }
  }

  console.log(`forwardVisited.size = ${forwardVisited.size}`);
  expect(forwardVisited.size).toBeGreaterThanOrEqual(10);

  const backwardVisited = new Set();

  for (let i = 0; i < 30; i++) {
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");

    const key = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;

      const id = el.id ? `#${el.id}` : "";
      const firstClass = el.classList[0] ? `.${el.classList[0]}` : "";
      return `${el.tagName}${id}${firstClass}`;
    });

    if (key) backwardVisited.add(key);
  }

  console.log(`backwardVisited.size = ${backwardVisited.size}`);
  expect(backwardVisited.size).toBeGreaterThanOrEqual(3);

  // Final explicit Enter on first button for sanity
  const firstButton = await page.$("button");
  if (firstButton) {
    await firstButton.focus();
    await page.keyboard.press("Enter");
    console.log("Pressed Enter on the first button (explicit sanity check).");
  }
});
