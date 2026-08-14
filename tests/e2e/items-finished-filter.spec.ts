import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "pammy2026";

async function login(page: import("@playwright/test").Page, next: string) {
  await page.goto(`/admin/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  // Match on pathname: "/admin/login" itself starts with "/admin", so a substring match here
  // would wave the test through while it is still on the sign-in form.
  const target = new URL(next, "http://localhost").pathname;
  await page.waitForURL((url) => url.pathname === target, { timeout: 30000 });
}

/**
 * Read-only: nothing here writes to the database. Marking finished/available is exercised by
 * hand — these assertions only prove the controls exist and are reachable, which is what was
 * missing before (an item could be marked finished with no way to find it again).
 */
test("finished items are findable and restorable from the items screen", async ({ page }) => {
  await login(page, "/admin/items?filter=finished");

  // Deep link from the dashboard opens on the Finished filter, not the full list.
  const filter = page.getByRole("group", { name: "Availability filter" });
  await expect(filter.getByRole("button", { name: /^Finished/ })).toBeVisible();
  await expect(page.getByText(/items? · drinks · marked finished/)).toBeVisible();
  await page.screenshot({ path: "test-results/screenshots/items-finished-filter.png", fullPage: true });

  // Bulk mode offers a restore action, not just "Mark Finished".
  await filter.getByRole("button", { name: "All", exact: true }).click();
  await page.getByRole("button", { name: "☰ Bulk" }).click();
  await page.locator('input[type="checkbox"]').first().check();
  await expect(page.getByRole("button", { name: "Mark Finished" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark Available" })).toBeVisible();
  await page.screenshot({ path: "test-results/screenshots/items-bulk-restore.png" });

  // Per-item route back: ⋮ → Mark Available on an item that is currently finished.
  await page.getByRole("button", { name: "☰ Bulk" }).click();
  await page.getByRole("button", { name: "Item options" }).first().click();
  await expect(page.getByRole("button", { name: /^Mark (Finished|Available)$/ })).toBeVisible();
});

test("dashboard links through to the finished list", async ({ page }) => {
  await login(page, "/admin");

  const tile = page.getByRole("link", { name: /Marked finished/ });
  await expect(tile).toBeVisible();
  await tile.click();
  await expect(page).toHaveURL(/\/admin\/items\?filter=finished$/, { timeout: 30000 });
  await expect(
    page.getByRole("group", { name: "Availability filter" }).getByRole("button", { name: /^Finished/ }),
  ).toBeVisible();
});
