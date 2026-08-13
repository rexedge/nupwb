"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/** Deterministic 0..1 PRNG seeded from a string, so the same URL always renders the same pattern. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Draws a QR-shaped visual placeholder — finder/alignment/timing patterns, NOT a scannable code. */
function render(canvas: HTMLCanvasElement, seed: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const modules = 29;
  const size = canvas.width;
  const cell = size / modules;
  const rand = seededRandom(seed);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#1E1B16";

  const grid: boolean[][] = Array.from({ length: modules }, () => Array(modules).fill(false));

  const drawFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const border = x === 0 || x === 6 || y === 0 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[oy + y][ox + x] = border || core;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);

  // Timing patterns
  for (let i = 8; i < modules - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Alignment pattern, bottom-right quadrant
  const ax = modules - 9;
  const ay = modules - 9;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const border = x === 0 || x === 4 || y === 0 || y === 4;
      const core = x === 2 && y === 2;
      grid[ay + y][ax + x] = border || core;
    }
  }

  // Random-but-deterministic data modules, skipping finder/alignment/timing zones and the
  // center knockout reserved for the logo.
  const centerStart = Math.floor(modules / 2) - 4;
  const centerEnd = centerStart + 8;
  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      const inFinder =
        (x < 8 && y < 8) || (x >= modules - 8 && y < 8) || (x < 8 && y >= modules - 8);
      const inAlignment = x >= ax - 1 && x <= ax + 5 && y >= ay - 1 && y <= ay + 5;
      const inTiming = x === 6 || y === 6;
      const inCenter = x >= centerStart && x < centerEnd && y >= centerStart && y < centerEnd;
      if (inFinder || inAlignment || inTiming || inCenter) continue;
      grid[y][x] = rand() > 0.55;
    }
  }

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (grid[y][x]) ctx.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5);
    }
  }
}

export const QrCanvas = forwardRef<HTMLCanvasElement, { seed: string; size?: number; className?: string }>(
  function QrCanvas({ seed, size = 224, className = "" }, forwardedRef) {
    const innerRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLCanvasElement);

    useEffect(() => {
      if (innerRef.current) render(innerRef.current, seed);
    }, [seed]);

    return (
      <canvas
        ref={innerRef}
        width={size}
        height={size}
        role="img"
        aria-label="Decorative QR-style graphic — not a scannable code"
        className={className}
      />
    );
  },
);

export function downloadCanvasPng(canvas: HTMLCanvasElement | null, filename: string) {
  if (!canvas) return;
  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}
