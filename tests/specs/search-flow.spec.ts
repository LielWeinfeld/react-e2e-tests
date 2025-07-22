import { test } from "../fixtures";

test.describe("Test search functionality", () => {
  test("UI-button flow", async ({ home }) => {
    await home.search.openByButton();
    await home.search.searchAndOpenFirst("custom hook");
    await home.search.openByButton();
    await home.search.starCurrentQuery();
    await home.search.close();

    await home.search.expectSaved("custom hook");
  });

  test("Keyboard-shortcut search flow", async ({ home }) => {
    await home.search.openByShortcut();
    await home.search.searchAndOpenFirst("custom hook");
    await home.search.openByShortcut();
    await home.search.starCurrentQuery();
    await home.search.close();

    await home.search.expectSaved("custom hook");
  });

  test("Saved query persists after refresh", async ({ home }) => {
    await home.search.openByButton();
    await home.search.searchAndOpenFirst("custom hook");
    await home.search.openByButton();
    await home.search.starCurrentQuery();
    await home.search.close();

    await home.reload(); // refresh the browser

    await home.search.expectSaved("custom hook");
  });
});
