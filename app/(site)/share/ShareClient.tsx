"use client";

import { useState } from "react";
import Image from "next/image";
import { WhatsAppGlyph } from "@/components/site/WhatsAppGlyph";
import { QrCanvas, downloadQr } from "@/components/site/QrCanvas";
import {
  renderTableTentFront,
  renderTableTentBack,
  renderWallPoster,
  renderCounterCard,
  downloadCanvasPng,
  downloadCanvasesAsPdf,
  type PriceRow,
  type PrintAssetVenue,
} from "@/components/site/printAssets";

const SCREEN_QR_SIZE = 1200;
const LOGO_SRC = "/assets/nupwb-logo.jpeg";

function slugify(s: string) {
  return s.replace(/\s+/g, "-").toLowerCase();
}

export function ShareClient({
  menuUrl,
  waHref,
  venueName,
  phone,
  palmWineRows,
  palmWineNote,
}: {
  menuUrl: string;
  waHref: string;
  venueName: string;
  phone: string;
  palmWineRows: PriceRow[];
  palmWineNote: string;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const menuUrlDisplay = menuUrl.replace(/^https?:\/\//, "");
  const venue: PrintAssetVenue = { venueName, phone, menuUrlDisplay, logoSrc: LOGO_SRC };
  const fileBase = slugify(venueName);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard unavailable — silently ignore, Copy Link is a convenience action
    }
  }

  async function downloadTableTent(format: "png" | "pdf") {
    setBusy("tableTent-" + format);
    try {
      const front = await renderTableTentFront(venue, menuUrl);
      const back = await renderTableTentBack(venue, menuUrl, palmWineRows, palmWineNote);
      if (format === "pdf") {
        downloadCanvasesAsPdf([front, back], 105, 148, `${fileBase}-table-tent.pdf`);
      } else {
        downloadCanvasPng(front, `${fileBase}-table-tent-front.png`);
        setTimeout(() => downloadCanvasPng(back, `${fileBase}-table-tent-back.png`), 250);
      }
    } finally {
      setBusy(null);
    }
  }

  async function downloadWallPoster(format: "png" | "pdf") {
    setBusy("wallPoster-" + format);
    try {
      const canvas = await renderWallPoster(venue, menuUrl);
      if (format === "pdf") downloadCanvasesAsPdf([canvas], 148, 210, `${fileBase}-wall-poster.pdf`);
      else downloadCanvasPng(canvas, `${fileBase}-wall-poster.png`);
    } finally {
      setBusy(null);
    }
  }

  async function downloadCounterCard(format: "png" | "pdf") {
    setBusy("counterCard-" + format);
    try {
      const canvas = await renderCounterCard(venue, menuUrl);
      if (format === "pdf") downloadCanvasesAsPdf([canvas], 100, 100, `${fileBase}-counter-card.pdf`);
      else downloadCanvasPng(canvas, `${fileBase}-counter-card.png`);
    } finally {
      setBusy(null);
    }
  }

  const PRINT_ASSETS = [
    {
      key: "tableTent",
      name: "Table Tent",
      dims: "A6, 105 × 148 mm (double-sided)",
      onDownload: downloadTableTent,
    },
    {
      key: "wallPoster",
      name: "Wall Poster",
      dims: "A5, 148 × 210 mm",
      onDownload: downloadWallPoster,
    },
    {
      key: "counterCard",
      name: "Counter Card",
      dims: "100 × 100 mm (square)",
      onDownload: downloadCounterCard,
    },
  ] as const;

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
          <QrCanvas seed={menuUrl} size={224} className="h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D4A32C] bg-white p-1 shadow-md">
              <Image
                src={LOGO_SRC}
                alt="Logo"
                width={50}
                height={50}
                className="h-10 w-auto mix-blend-multiply"
              />
            </div>
          </div>
        </div>
        <p className="-mt-3 text-[11px] text-[#6E6455]">Visual placeholder — not a scannable code.</p>

        <div className="font-mono text-base font-bold tracking-wider text-[#0E5C34]">{menuUrlDisplay}</div>

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
            onClick={() => downloadQr(menuUrl, SCREEN_QR_SIZE, `${fileBase}-qr.png`)}
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
              key={asset.key}
              className="flex flex-col items-start justify-between gap-4 rounded-lg border border-[#E0CD98] bg-[#FFFDF8] p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E1B16]">{asset.name}</h3>
                <p className="text-xs text-[#6E6455]">{asset.dims}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => asset.onDownload("pdf")}
                  disabled={busy === `${asset.key}-pdf`}
                  className="rounded bg-[#0E5C34] px-3 py-1.5 text-xs font-bold text-[#FBF6EC] hover:bg-[#083D22] disabled:opacity-50"
                >
                  {busy === `${asset.key}-pdf` ? "…" : "Download PDF"}
                </button>
                <button
                  onClick={() => asset.onDownload("png")}
                  disabled={busy === `${asset.key}-png`}
                  className="rounded border border-[#D4A32C] px-3 py-1.5 text-xs font-semibold text-[#0E5C34] hover:bg-[#D4A32C]/10 disabled:opacity-50"
                >
                  {busy === `${asset.key}-png` ? "…" : "Download PNG"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
