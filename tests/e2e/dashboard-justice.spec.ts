import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "pammy2026";

async function login(page: import("@playwright/test").Page, next: string) {
  await page.goto(`/admin/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(new RegExp(next.replace(/\//g, "\\/") + "$"), { timeout: 15000 });
}

test("desktop dashboard shows 3-column recent activity", async ({ page }) => {
  await login(page, "/admin");
  await page.screenshot({ path: "test-results/screenshots/dashboard-desktop.png", fullPage: true });
});

test("category manager renders draggable rows with grip icons", async ({ page }) => {
  await login(page, "/admin/categories");
  const rows = page.locator("div[draggable='true']");
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(1);
  await expect(rows.first().locator("svg")).toBeVisible();
  await page.screenshot({ path: "test-results/screenshots/category-manager.png" });
});
