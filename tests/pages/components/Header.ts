import { expect, Locator, Page } from "@playwright/test";

export class Header {
  readonly page: Page;
  readonly navbar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator("nav");
  }
  /*Elements in the Header */
  private get root() {
    return this.page.getByRole("navigation").first();
  }

  private get themeButton() {
    return this.page.getByRole("button", { name: /dark|light/i });
  }

  /* queries */
  async isDark() {
    return this.page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark"));
  }

  /* actions & assertions*/
  async toggleTheme() {
    await this.themeButton.click();
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
  }
}
