import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SearchOption } from "./components/SearchOption";
import { type Page, Locator } from "@playwright/test";

/*  HomePage class definition and properties  */
export class HomePage {
  readonly header: Header;
  readonly footer: Footer;
  readonly search: SearchOption;
  readonly metaDescription: Locator;

  expectedTitle = "React";
  expectedDescription =
    "React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. React is designed to let you seamlessly combine components written by independent people, teams, and organizations.";

  /*  Constructor: initialize components and locators  */
  constructor(readonly page: Page) {
    this.header = new Header(page);
    this.footer = new Footer(page);
    this.search = new SearchOption(page);
    this.metaDescription = page.locator('meta[name="description"]');
  }

  /*  Page navigation helpers */

  async goto(url?: string) {
    await this.page.goto(url ?? "https://react.dev");
    return this;
  }

  /* Page metadata accessors */
  async reload() {
    await this.page.reload();
  }

  async close() {
    await this.page.close();
  }

  async getTitle() {
    return this.page.title();
  }

  async getMetaDescriptionContent() {
    return this.metaDescription.getAttribute("content");
  }

  /*  Internal link extraction and validation */

  async getInternalLinks(): Promise<string[]> {
    const hrefs = await this.page.$$eval("a[href]", (anchors) =>
      anchors
        .map((a) => a.getAttribute("href") || "")
        .filter(
          (h) => h.startsWith("/") && !h.startsWith("//") && !h.startsWith("#"),
        ),
    );
    return Array.from(new Set(hrefs));
  }

  async checkAllLinksAreValid() {
    const links = await this.page.$$eval("a[href]", (anchors) =>
      anchors
        .map((a) => a.getAttribute("href"))
        .filter((href) => href !== null),
    );

    console.log(`Found ${links.length} links on page.`);

    const brokenLinks = [];

    for (const href of links) {
      let fullUrl = href;

      // Convert relative URLs to absolute
      if (href.startsWith("/")) {
        const base = new URL(this.page.url());
        fullUrl = new URL(href, base).toString();
      }

      const myDomain = "react.dev";
      if (!fullUrl.includes(myDomain)) {
        continue;
      }

      console.log(`Checking: ${fullUrl}`);

      const response = await this.page.request.get(fullUrl);
      const status = response.status();

      if (status >= 400) {
        console.log(`Broken link: ${fullUrl} responded with status ${status}`);
        brokenLinks.push({ url: fullUrl, status });
      } else {
        console.log(`OK: ${fullUrl} (${status})`);
      }
    }

    if (brokenLinks.length > 0) {
      console.log(`Test failed. Found ${brokenLinks.length} broken link(s):`);
      for (const link of brokenLinks) {
        console.log(` - ${link.url} responded with status ${link.status}`);
      }
      throw new Error(`Broken links detected.`);
    } else {
      console.log("All internal links are valid.");
    }
  }
}
