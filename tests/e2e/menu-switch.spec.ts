import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["iPhone 13"] });

/**
 * A guest who scans a table QR lands on one menu. The Home/Drinks/Food switcher must be on
 * screen without scrolling, or they cannot find the other menu without opening the hamburger.
 */
for (const entry of ["/nwoke-udi", "/menu", "/drinks"]) {
  test(`${entry}: menu switcher is above the fold and works`, async ({ page }) => {
    await page.goto(entry);
    await page.waitForLoadState("networkidle");

    const nav = page.getByRole("navigation", { name: "Menu sections" });
    await expect(nav).toBeVisible();

    // "Visible at a glance" — inside the first viewport, before any scrolling.
    const box = await nav.boundingBox();
    const viewport = page.viewportSize();
    expect(box, "switcher has no layout box").not.toBeNull();
    expect(box!.y + box!.height).toBeLessThan(viewport!.height);

    // Generous timeouts: these are force-dynamic pages, so a cold `next dev` compiles the
    // route on the first click.
    const nav_timeout = { timeout: 30_000 };

    await nav.getByRole("link", { name: "Drinks" }).click();
    await expect(page).toHaveURL(/\/drinks$/, nav_timeout);
    await expect(nav.getByRole("link", { name: "Drinks" })).toHaveAttribute("aria-current", "page");

    await nav.getByRole("link", { name: "Food" }).click();
    await expect(page).toHaveURL(/\/menu$/, nav_timeout);
    await expect(nav.getByRole("link", { name: "Food" })).toHaveAttribute("aria-current", "page");

    await nav.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL(/localhost:\d+\/$/, nav_timeout);
  });
}

test("sharwama prices show on the food menu, below the other food sections", async ({ page }) => {
  await page.goto("/menu");
  await page.waitForLoadState("networkidle");

  const section = page.locator('[data-slug="sharwama"]');
  await expect(section).toBeVisible();
  await expect(section.getByText("Beef Sharwama")).toBeVisible();
  await expect(section.getByText("₦4,500")).toBeVisible();
  await expect(section.getByText("₦5,500")).toBeVisible();
  await expect(section.getByText("₦7,000")).toBeVisible();

  // A category added in the CMS must append, not jump ahead of Signature Dishes.
  const sections = page.locator("section[data-slug]");
  const slugs = await sections.evaluateAll((els) => els.map((e) => e.getAttribute("data-slug")));
  expect(slugs.indexOf("sharwama")).toBeGreaterThan(slugs.indexOf("signature-dishes"));
});
