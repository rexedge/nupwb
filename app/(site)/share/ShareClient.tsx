"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { WhatsAppGlyph } from "@/components/site/WhatsAppGlyph";
import { QrCanvas, downloadCanvasPng } from "@/components/site/QrCanvas";

const PRINT_ASSETS = [
  { name: "Table Tent", dims: "A6, 105 × 148 mm (double-sided)", formats: ["PDF", "PNG"] },
  { name: "Wall Poster", dims: "A5, 148 × 210 mm", formats: ["PDF", "PNG"] },
  { name: "Counter Card", dims: "100 × 100 mm (square)", formats: ["PNG"] },
] as const;

export function ShareClient({ menuUrl, waHref, venueName }: { menuUrl: string; waHref: string; venueName: string }) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard unavailable — silently ignore, Copy Link is a convenience action
    }
  }

  return (
    <>
      <div className="relative flex flex-col items-center gap-6 rounded-lg border-2 border-[#D4A32C] bg-[#FFFDF8] p-6 text-center shadow-md sm:p-10">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-bold text-[#1E1B16] sm:text-3xl">
            Scan to view our menu
          </h2>
          <p className="text-xs text-[#6E6455]">
            Always displays our live daily menu, palm wine inventory &amp; prices.
          </p>
        </div>

        <div className="relative flex h-64 w-64 items-center justify-center rounded-lg border border-[#D4A32C] bg-white p-4 shadow-inner">
          <QrCanvas ref={canvasRef} seed={menuUrl} size={224} className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D4A32C] bg-white p-1 shadow-md">
              <Image
                src="/assets/nupwb-logo.jpeg"
                alt="Logo"
                width={50}
                height={50}
                className="h-10 w-auto mix-blend-multiply"
              />
            </div>
          </div>
        </div>
        <p className="-mt-3 text-[11px] text-[#6E6455]">Visual placeholder — not a scannable code.</p>

        <div className="font-mono text-base font-bold tracking-wider text-[#0E5C34]">
          {menuUrl.replace(/^https?:\/\//, "")}
        </div>

        <div className="mt-2 flex w-full max-w-md flex-wrap gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#0E5C34] py-3 text-sm font-semibold text-[#FBF6EC] transition-colors hover:bg-[#083D22]"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            Share on WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="flex-1 rounded-md border border-[#D4A32C] py-3 text-sm font-semibold text-[#0E5C34] transition-colors hover:bg-[#D4A32C]/10"
          >
            {copied ? "✓ Copied Link" : "Copy Link"}
          </button>
          <button
            onClick={() => downloadCanvasPng(canvasRef.current, `${venueName.replace(/\s+/g, "-").toLowerCase()}-qr.png`)}
            className="w-full rounded-md border border-[#B5562A] py-3 text-sm font-semibold text-[#B5562A] transition-colors hover:bg-[#B5562A]/10"
          >
            Download QR Code
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border-b border-[#D4A32C] pb-2">
          <h2 className="font-display text-2xl font-bold text-[#1E1B16]">Print Assets for Bar Tables</h2>
          <p className="text-xs text-[#6E6455]">
            High-resolution printable templates. The QR code target remains fixed when menu prices are
            updated.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {PRINT_ASSETS.map((asset) => (
            <div
              key={asset.name}
              className="flex flex-col items-start justify-between gap-4 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E1B16]">{asset.name}</h3>
                <p className="text-xs text-[#6E6455]">{asset.dims}</p>
              </div>
              <div className="flex items-center gap-2">
                {asset.formats.map((fmt) => (
                  <span key={fmt} className="rounded bg-[#0E5C34] px-2.5 py-1 text-xs font-bold text-[#FBF6EC]">
                    {fmt}
                  </span>
                ))}
                <button
                  onClick={() => downloadCanvasPng(canvasRef.current, `${asset.name.replace(/\s+/g, "-").toLowerCase()}-qr.png`)}
                  className="rounded border border-[#D4A32C] px-2.5 py-1 text-xs font-semibold text-[#0E5C34] hover:bg-[#D4A32C]/10"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
