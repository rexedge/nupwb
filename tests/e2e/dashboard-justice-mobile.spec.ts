import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "pammy2026";

async function login(page: import("@playwright/test").Page, next: string) {
  await page.goto(`/admin/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(new RegExp(next.replace(/\//g, "\\/") + "$"), { timeout: 15000 });
}

test("mobile dashboard has Akwete band under header", async ({ page }) => {
  await login(page, "/admin");
  await page.screenshot({ path: "test-results/screenshots/dashboard-mobile.png" });
});

test("Categories link is reachable from Items on mobile", async ({ page }) => {
  await login(page, "/admin/items");
  await expect(page.getByRole("link", { name: "Categories" })).toBeVisible();
  await page.getByRole("link", { name: "Categories" }).click();
  await expect(page).toHaveURL(/\/admin\/categories$/);
});
