import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "pammy2026";

test("FAB clears the bottom tab bar and price edit shows comma-formatted keypad", async ({ page }) => {
  await page.goto("/admin/login?next=%2Fadmin%2Fitems");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin\/items$/, { timeout: 15000 });

  // FAB must not be covered by the fixed bottom tab bar.
  const fab = page.getByRole("link", { name: "Add new item" });
  await expect(fab).toBeVisible();
  const fabBox = await fab.boundingBox();
  const tabBar = page.locator("nav.fixed.bottom-0");
  const tabBox = await tabBar.boundingBox();
  if (!fabBox || !tabBox) throw new Error("missing bounding boxes");
  expect(fabBox.y + fabBox.height).toBeLessThanOrEqual(tabBox.y + 1);
  await page.screenshot({ path: "test-results/screenshots/items-fab.png" });

  // Switch to Food scope and tap-to-edit "Isi Ewu" (single-variant) to check the keypad.
  await page.getByRole("button", { name: "Food" }).click();
  await page.getByText("Isi Ewu", { exact: true }).waitFor();
  await page.getByText("tap to edit").first().click();

  await expect(page.getByRole("button", { name: "00", exact: true })).toBeVisible();
  // Fresh entry: field starts empty, typing "13" + "00" should read exactly ₦13,00 -> with
  // the dedicated "00" key this becomes 1,3,0,0 -> "1300" -> ₦1,300 formatted.
  await page.getByRole("button", { name: "1", exact: true }).click();
  await page.getByRole("button", { name: "3", exact: true }).click();
  await page.getByRole("button", { name: "00", exact: true }).click();
  await expect(page.getByText("₦1,300", { exact: true })).toBeVisible();

  await page.screenshot({ path: "test-results/screenshots/items-price-edit.png" });
});
