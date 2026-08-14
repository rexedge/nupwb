import { test, expect } from "@playwright/test";

test("print asset downloads produce real files", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/share");
  await page.waitForLoadState("networkidle");

  const [pngDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PNG" }).nth(2).click(), // Counter Card (single file)
  ]);
  expect(pngDownload.suggestedFilename()).toMatch(/counter-card\.png$/);
  const pngPath = await pngDownload.path();
  expect(pngPath).toBeTruthy();

  const [pdfDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PDF" }).nth(1).click(), // Wall Poster
  ]);
  expect(pdfDownload.suggestedFilename()).toMatch(/wall-poster\.pdf$/);
  const pdfPath = await pdfDownload.path();
  expect(pdfPath).toBeTruthy();

  expect(errors, `console/page errors: ${errors.join("\n")}`).toEqual([]);
});
