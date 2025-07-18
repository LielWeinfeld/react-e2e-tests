import {test,expect} from "playwright/test";

test("Smoke Test: homepage",async({page})=>{
    await page.goto('https://react.dev/'); //Visit the homepage
    await expect.soft(page).toHaveTitle(/React/); // Check that the page title contains 'React'
    await expect.soft(page.getByRole('link', { name: 'React', exact: true })).toBeVisible();
    await expect.soft(page.locator('footer')).toBeVisible();
}); 