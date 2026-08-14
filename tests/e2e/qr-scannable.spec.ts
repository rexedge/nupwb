import { test, expect } from "@playwright/test";
import jsQR from "jsqr";

test("the share page QR code actually decodes to the menu URL", async ({ page }) => {
  await page.goto("/share");
  await page.waitForLoadState("networkidle");

  const canvasEl = page.locator("canvas").first();
  await expect(canvasEl).toBeVisible();

  const pixels = await canvasEl.evaluate((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return { data: Array.from(img.data), width: img.width, height: img.height };
  });

  const decoded = jsQR(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height);
  expect(decoded, "jsQR failed to decode any QR code from the canvas").not.toBeNull();
  expect(decoded!.data).toMatch(/^https:\/\/.+\/nwoke-udi$/);
});

test("a downloaded print-asset QR decodes correctly (counter card)", async ({ page }) => {
  await page.goto("/share");
  await page.waitForLoadState("networkidle");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PNG" }).nth(2).click(),
  ]);
  const path = await download.path();
  expect(path).toBeTruthy();

  // Decode the downloaded PNG in-page via a temporary <img>/<canvas>, since jsQR needs raw pixels.
  const fs = await import("node:fs");
  const buffer = fs.readFileSync(path!);
  const base64 = buffer.toString("base64");

  const pixels = await page.evaluate(async (dataUrl) => {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("image failed to load"));
      img.src = dataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return { data: Array.from(imgData.data), width: imgData.width, height: imgData.height };
  }, `data:image/png;base64,${base64}`);

  const decoded = jsQR(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height);
  expect(decoded, "jsQR failed to decode the downloaded counter card PNG").not.toBeNull();
  expect(decoded!.data).toMatch(/^https:\/\/.+\/nwoke-udi$/);
});
