import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

test("mobile drawer menu shows all labels including Drinks", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/menu");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Toggle menu" }).click();
  // Scoped to the header: the menu pages also carry a Drinks link in the MenuSwitch row.
  await expect(page.locator("header").getByRole("link", { name: "Drinks", exact: true })).toBeVisible();

  await page.screenshot({ path: "test-results/screenshots/mobile-drawer.png" });

  expect(errors, `console/page errors: ${errors.join("\n")}`).toEqual([]);
});
