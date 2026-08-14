import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "pammy2026";

test("FAB clears the bottom tab bar and price edit uses the system keyboard", async ({ page }) => {
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

  // Switch to Food scope and tap-to-edit "Isi Ewu" (single-variant) — field should start
  // empty (not pre-filled with the old price) and accept typed digits directly.
  await page.getByRole("button", { name: "Food" }).click();
  await page.getByText("Isi Ewu", { exact: true }).waitFor();
  await page.getByText("tap to edit").first().click();

  const priceInput = page.locator("input[inputmode='numeric']");
  await expect(priceInput).toBeVisible();
  await expect(priceInput).toBeFocused();
  await expect(priceInput).toHaveValue("");
  await expect(page.getByText("was ₦12,000")).toBeVisible();

  await priceInput.fill("1300");
  await priceInput.press("Enter");
  await expect(page.getByText("₦1,300", { exact: true })).toBeVisible();

  await page.screenshot({ path: "test-results/screenshots/items-price-edit.png" });
});
