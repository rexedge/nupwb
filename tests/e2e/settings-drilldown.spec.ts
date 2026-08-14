import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "pammy2026";

test("settings accordion sections expand on click", async ({ page }) => {
  await page.goto("/admin/login?next=%2Fadmin%2Fsettings");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin\/settings$/, { timeout: 15000 });

  const venueField = page.getByLabel("Venue name");
  await expect(venueField).toBeHidden();

  await page.getByRole("button", { name: /Venue details/ }).click();
  await expect(venueField).toBeVisible({ timeout: 5000 });

  await page.screenshot({ path: "test-results/screenshots/settings-expanded.png", fullPage: true });
});
