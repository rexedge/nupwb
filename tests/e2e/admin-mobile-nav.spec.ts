import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "pammy2026";

test("mobile admin bottom nav shows icons for every tab", async ({ page }) => {
  await page.goto("/admin/login?next=%2Fadmin%2Fsettings");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin\/settings$/, { timeout: 15000 });

  const tabs = page.locator("nav.fixed.bottom-0 a");
  await expect(tabs).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await expect(tabs.nth(i).locator("svg")).toBeVisible();
  }

  await page.screenshot({ path: "test-results/screenshots/admin-mobile-nav.png" });
});
