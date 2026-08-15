import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES = ["/", "/about", "/menu", "/food", "/contact", "/share"];

for (const route of PUBLIC_ROUTES) {
  test(`${route || "home"} renders with no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(route);
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: `test-results/screenshots${route === "/" ? "/home" : route}.png`,
      fullPage: true,
    });

    expect(errors, `console/page errors on ${route}: ${errors.join("\n")}`).toEqual([]);
  });
}
