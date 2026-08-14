"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import QRCode from "qrcode";

/**
 * Draws a REAL, scannable QR code encoding `data` (the actual URL). Uses error-correction
 * level H (~30% recoverable) so a small centered logo knockout doesn't break scanning.
 * Renders synchronously via `QRCode.create` + manual pixel fill (rather than the async
 * `QRCode.toCanvas`) so callers that draw into the canvas immediately after (e.g. the print
 * asset composer) never see a still-blank canvas.
 */
export function renderQrPattern(canvas: HTMLCanvasElement, data: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvas.width;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);
  if (!data) return;

  const qr = QRCode.create(data, { errorCorrectionLevel: "H" });
  const modules = qr.modules;
  const count = modules.size;
  const margin = 2; // quiet-zone modules, matches the library's own default
  const cell = size / (count + margin * 2);

  ctx.fillStyle = "#1E1B16";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules.get(row, col)) {
        ctx.fillRect((col + margin) * cell, (row + margin) * cell, cell + 0.5, cell + 0.5);
      }
    }
  }
}

export const QrCanvas = forwardRef<HTMLCanvasElement, { seed: string; size?: number; className?: string }>(
  function QrCanvas({ seed, size = 224, className = "" }, forwardedRef) {
    const innerRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLCanvasElement);

    useEffect(() => {
      if (innerRef.current) renderQrPattern(innerRef.current, seed);
    }, [seed]);

    return (
      <canvas
        ref={innerRef}
        width={size}
        height={size}
        role="img"
        aria-label={`QR code linking to ${seed}`}
        className={className}
      />
    );
  },
);

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

/** Creates a standalone offscreen canvas with a real QR code painted at `size` px — for
 * embedding into a larger composition (print assets) or downloading directly. */
export function createQrCanvas(seed: string, size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  renderQrPattern(canvas, seed);
  return canvas;
}

/**
 * Renders a real, print-quality QR code (independent of whatever size is shown on screen) and
 * downloads it. `size` is in raster pixels — use something like 1200 for a screen-sized
 * download, 2400+ for large print assets (posters, table tents).
 */
export function downloadQr(seed: string, size: number, filename: string) {
  triggerDownload(createQrCanvas(seed, size).toDataURL("image/png"), filename);
}
