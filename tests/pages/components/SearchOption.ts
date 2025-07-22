import { expect, type Page } from "@playwright/test";

const SHORTCUT = process.platform === "darwin" ? "Meta+k" : "Control+k";

export class SearchOption {
  constructor(private readonly page: Page) {}

  /* Methods to open and close the Search UI */

  async openByButton() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByRole("button", { name: /search/i }).click();
    await this.input().waitFor();
  }

  async openByShortcut() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.keyboard.press(SHORTCUT);
    await this.input().waitFor();
  }

  async close() {
    await this.page.keyboard.press("Escape");
  }

  /* Search functionality and save actions */

  async searchAndOpenFirst(query: string) {
    await this.input().fill(query);
    const first = this.page
      .getByRole("link", { name: query, exact: false })
      .first();
    await first.click();
    await expect(this.page).toHaveURL(
      new RegExp(query.replace(/\s+/g, ".*"), "i"),
    );
  }

  async starCurrentQuery() {
    const star = this.page.locator('button[title="Save this search"]').first();
    await star.click();
    await star.waitFor({ state: "detached" });
  }

  async expectSaved(query: string) {
    await this.openByButton(); // reopen DocSearch
    await expect(
      this.page.getByRole("link", { name: query, exact: false }).first(),
    ).toBeVisible(); // it should be in “Saved”
    await this.close(); // close the modal
  }

  /* Locator helpers */

  private input() {
    return this.page.getByRole("searchbox", { name: /search/i });
  }
}
