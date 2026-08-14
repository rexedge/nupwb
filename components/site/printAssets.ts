"use client";

import { jsPDF } from "jspdf";
import { createQrCanvas } from "./QrCanvas";

/** Design spec previews are drawn at 96dpi-equivalent CSS px; print wants 300dpi. */
const SCALE = 300 / 96;
const S = (px: number) => Math.round(px * SCALE);

const INK = "#1E1B16";
const MUTED = "#6E6455";
const PALM = "#0E5C34";
const GOLD = "#D4A32C";
const TERRACOTTA = "#B5562A";
const CREAM = "#FBF6EC";
const CARD = "#FFFDF8";

export type PriceRow = { name: string; price: string };

export type PrintAssetVenue = {
  venueName: string;
  phone: string;
  menuUrlDisplay: string;
  logoSrc: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function getFonts() {
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready.catch(() => {});
  }
  const root = getComputedStyle(document.documentElement);
  const display = root.getPropertyValue("--font-playfair-display").trim() || "Georgia, serif";
  const body = root.getPropertyValue("--font-source-sans").trim() || "Arial, sans-serif";
  return { display, body };
}

function fillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  font: string,
  color: string,
  letterSpacing = 0,
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  if (!letterSpacing) {
    ctx.textAlign = "center";
    ctx.fillText(text, cx, y);
    return;
  }
  let total = 0;
  for (const ch of text) total += ctx.measureText(ch).width + letterSpacing;
  total -= letterSpacing;
  ctx.textAlign = "left";
  let x = cx - total / 2;
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + letterSpacing;
  }
}

/** Diagonal gold/terracotta triangle band on a palm-green base — the Akwete accent strip. */
function drawAkweteStripe(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, tile: number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = PALM;
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let px = x; px <= x + w + tile; px += tile) {
    ctx.lineTo(px + tile / 2, y + h);
    ctx.lineTo(px + tile, y);
  }
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = TERRACOTTA;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  for (let px = x; px <= x + w + tile; px += tile) {
    ctx.lineTo(px + tile / 2, y);
    ctx.lineTo(px + tile, y + h);
  }
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Gold-bracketed QR frame with a center knockout circle holding the venue logo. */
function drawQrBlock(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  qrSize: number,
  framePad: number,
  cornerLen: number,
  seed: string,
  logo: HTMLImageElement | null,
  knockoutSize: number,
) {
  const boxX = cx - qrSize / 2;
  const boxY = cy - qrSize / 2;
  const frameX = boxX - framePad;
  const frameY = boxY - framePad;
  const frameSize = qrSize + framePad * 2;
  const borderW = S(1);
  const cornerW = S(2);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(frameX, frameY, frameSize, frameSize);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = borderW;
  ctx.strokeRect(frameX + borderW / 2, frameY + borderW / 2, frameSize - borderW, frameSize - borderW);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = cornerW;
  const corner = (px: number, py: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.moveTo(px, py + dy * cornerLen);
    ctx.lineTo(px, py);
    ctx.lineTo(px + dx * cornerLen, py);
    ctx.stroke();
  };
  corner(frameX, frameY, 1, 1);
  corner(frameX + frameSize, frameY, -1, 1);
  corner(frameX, frameY + frameSize, 1, -1);
  corner(frameX + frameSize, frameY + frameSize, -1, -1);

  const qrCanvas = createQrCanvas(seed, Math.round(qrSize));
  ctx.drawImage(qrCanvas, boxX, boxY, qrSize, qrSize);

  const knockR = knockoutSize / 2;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx, cy, knockR, 0, Math.PI * 2);
  ctx.fill();

  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, knockR, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalCompositeOperation = "multiply";
    const logoH = knockR * 1.7;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, cx - logoW / 2, cy - logoH / 2, logoW, logoH);
    ctx.restore();
  }
}

function drawCenteredLogo(ctx: CanvasRenderingContext2D, logo: HTMLImageElement, cx: number, top: number, h: number) {
  const w = (logo.width / logo.height) * h;
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(logo, cx - w / 2, top, w, h);
  ctx.restore();
}

async function loadLogo(src: string): Promise<HTMLImageElement | null> {
  try {
    return await loadImage(src);
  } catch {
    return null;
  }
}

export async function renderTableTentFront(venue: PrintAssetVenue, seed: string): Promise<HTMLCanvasElement> {
  const { display, body } = await getFonts();
  const logo = await loadLogo(venue.logoSrc);
  const w = S(397);
  const h = S(559);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = CARD;
  ctx.fillRect(0, 0, w, h);

  if (logo) drawCenteredLogo(ctx, logo, w / 2, S(22), S(104));

  const qrCy = S(22) + S(104) + S(14) + S(14) + S(105);
  drawQrBlock(ctx, w / 2, qrCy, S(210), S(14), S(26), seed, logo, S(56));

  fillText(ctx, "Scan for our full menu", w / 2, qrCy + S(105) + S(16) + S(24), `700 ${S(24)}px ${display}`, INK);
  fillText(
    ctx,
    venue.menuUrlDisplay,
    w / 2,
    qrCy + S(105) + S(16) + S(24) + S(30),
    `600 ${S(16)}px ${body}`,
    INK,
    S(1.4),
  );

  const stripeY = h - S(12) - S(56);
  drawAkweteStripe(ctx, 0, stripeY, w, S(12), S(12));

  ctx.fillStyle = PALM;
  ctx.fillRect(0, stripeY + S(12), w, S(56));
  ctx.textAlign = "left";
  ctx.font = `400 ${S(15)}px ${body}`;
  ctx.fillStyle = CREAM;
  ctx.fillText(venue.phone, S(24), stripeY + S(12) + S(34));
  ctx.textAlign = "right";
  ctx.fillText("WhatsApp us", w - S(24), stripeY + S(12) + S(34));

  return canvas;
}

export async function renderTableTentBack(
  venue: PrintAssetVenue,
  seed: string,
  rows: PriceRow[],
  note: string,
): Promise<HTMLCanvasElement> {
  const { display, body } = await getFonts();
  const w = S(397);
  const h = S(559);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  drawAkweteStripe(ctx, 0, 0, w, S(12), S(12));

  let y = S(12) + S(22) + S(10);
  fillText(ctx, "THE HOUSE SPECIALITY", w / 2, y, `600 ${S(12)}px ${body}`, TERRACOTTA, S(1.6));
  y += S(28);
  ctx.font = `700 ${S(28)}px ${display}`;
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.fillText("Fresh Palm Wine", w / 2, y);
  y += S(28);
  ctx.font = `italic 500 ${S(22)}px ${display}`;
  ctx.fillText("Tapped Daily", w / 2, y);

  const listTop = y + S(24);
  const listBottom = h - S(46);
  ctx.strokeStyle = "#E0CD98";
  ctx.lineWidth = S(1);
  ctx.strokeRect(S(26) + S(0.5), listTop + S(0.5), w - S(52) - S(1), listBottom - listTop - S(1));

  const rowH = (listBottom - listTop - S(4)) / Math.max(rows.length, 1);
  rows.forEach((row, i) => {
    const ry = listTop + rowH * i + rowH / 2 + S(6);
    ctx.textAlign = "left";
    ctx.font = `600 ${S(17)}px ${body}`;
    ctx.fillStyle = INK;
    const nameW = ctx.measureText(row.name).width;
    ctx.fillText(row.name, S(42), ry);

    ctx.textAlign = "right";
    ctx.font = `700 ${S(17)}px ${body}`;
    const priceW = ctx.measureText(row.price).width;
    ctx.fillText(row.price, w - S(42), ry);

    const dotsX1 = S(42) + nameW + S(10);
    const dotsX2 = w - S(42) - priceW - S(10);
    if (dotsX2 > dotsX1) {
      ctx.strokeStyle = "#C9BCA0";
      ctx.lineWidth = S(1);
      ctx.setLineDash([S(1.5), S(3)]);
      ctx.beginPath();
      ctx.moveTo(dotsX1, ry - S(5));
      ctx.lineTo(dotsX2, ry - S(5));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (i < rows.length - 1) {
      ctx.strokeStyle = "rgba(212,163,44,.28)";
      ctx.beginPath();
      ctx.moveTo(S(30), listTop + rowH * (i + 1));
      ctx.lineTo(w - S(30), listTop + rowH * (i + 1));
      ctx.stroke();
    }
  });

  fillText(ctx, note, w / 2, h - S(18), `400 ${S(15)}px ${body}`, MUTED);

  void venue;
  return canvas;
}

export async function renderWallPoster(venue: PrintAssetVenue, seed: string): Promise<HTMLCanvasElement> {
  const { display, body } = await getFonts();
  const logo = await loadLogo(venue.logoSrc);
  const w = S(559);
  const h = S(794);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = CARD;
  ctx.fillRect(0, 0, w, h);

  if (logo) drawCenteredLogo(ctx, logo, w / 2, S(34), S(158));

  let y = S(34) + S(158) + S(16) + S(30);
  ctx.font = `italic 400 ${S(30)}px ${display}`;
  ctx.fillStyle = PALM;
  ctx.textAlign = "center";
  ctx.fillText("Nnọọ — bịa nọdụ", w / 2, y);
  y += S(24);
  fillText(ctx, "Welcome. Come and sit with us.", w / 2, y, `400 ${S(17)}px ${body}`, MUTED);

  const qrCy = y + S(20) + S(150);
  drawQrBlock(ctx, w / 2, qrCy, S(300), S(18), S(34), seed, logo, S(80));

  let ty = qrCy + S(150) + S(18) + S(32);
  fillText(ctx, "Scan for our full menu", w / 2, ty, `700 ${S(32)}px ${display}`, INK);
  ty += S(28);
  fillText(ctx, venue.menuUrlDisplay, w / 2, ty, `600 ${S(19)}px ${body}`, INK, S(1.6));
  ty += S(26);
  fillText(ctx, "Drinks, food and today's prices — always current.", w / 2, ty, `400 ${S(17)}px ${body}`, MUTED);

  drawAkweteStripe(ctx, 0, h - S(32), w, S(32), S(16));

  return canvas;
}

export async function renderCounterCard(venue: PrintAssetVenue, seed: string): Promise<HTMLCanvasElement> {
  const { body } = await getFonts();
  const logo = await loadLogo(venue.logoSrc);
  const size = S(378);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = CARD;
  ctx.fillRect(0, 0, size, size);

  const pad = S(22);
  let y = pad;
  if (logo) {
    drawCenteredLogo(ctx, logo, size / 2, y, S(70));
    y += S(70) + S(14);
  }

  const qrCy = y + S(85);
  drawQrBlock(ctx, size / 2, qrCy, S(148), S(10), S(0), seed, logo, S(40));

  const urlY = qrCy + S(85) + S(14) + S(15);
  fillText(ctx, venue.menuUrlDisplay, size / 2, urlY, `600 ${S(15)}px ${body}`, INK, S(1.4));

  const barY = urlY + S(14);
  drawAkweteStripe(ctx, size / 2 - S(60), barY, S(120), S(6), S(12));

  return canvas;
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  triggerDownload(canvas.toDataURL("image/png"), filename);
}

/** Embeds one or more canvases into a PDF sized to the asset's real physical dimensions (mm). */
export function downloadCanvasesAsPdf(
  canvases: HTMLCanvasElement[],
  widthMm: number,
  heightMm: number,
  filename: string,
) {
  const pdf = new jsPDF({
    orientation: widthMm > heightMm ? "landscape" : "portrait",
    unit: "mm",
    format: [widthMm, heightMm],
  });
  canvases.forEach((canvas, i) => {
    if (i > 0) pdf.addPage([widthMm, heightMm]);
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, widthMm, heightMm);
  });
  pdf.save(filename);
}
