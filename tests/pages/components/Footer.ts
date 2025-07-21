import { Page, expect } from "@playwright/test";

export class Footer {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get root() {
    return this.page.locator("footer");
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
  }
}
