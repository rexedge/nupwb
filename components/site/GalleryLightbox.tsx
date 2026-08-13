"use client";

import { useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

type Shot = { label: string; desc: string };

export function GalleryLightbox({ shots }: { shots: Shot[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? shots[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {shots.map((shot, idx) => (
          <button
            key={shot.label}
            type="button"
            onClick={() => setOpenIndex(idx)}
            className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-lg border border-[#E0CD98] text-left transition-colors hover:border-[#0E5C34]"
          >
            <ImagePlaceholder label={shot.label} className="absolute inset-0" />
            <div className="absolute inset-0 bg-[#0E5C34]/10 transition-colors group-hover:bg-[#0E5C34]/25" />
            <div className="relative z-10 flex flex-col gap-0.5 p-4">
              <span className="text-sm font-bold text-[#0E5C34]">{shot.label}</span>
              <span className="text-xs text-[#6E6455]">{shot.desc}</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#B5562A] opacity-0 transition-opacity group-hover:opacity-100">
                Tap to enlarge
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E1B16]/80 p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
            className="absolute inset-0"
          />
          <div className="relative z-10 flex w-full max-w-2xl flex-col gap-3">
            <div className="relative h-[60vh] w-full overflow-hidden rounded-lg border border-[#D4A32C]">
              <ImagePlaceholder label={active.label} className="absolute inset-0" />
            </div>
            <div className="flex items-center justify-between text-[#FBF6EC]">
              <div>
                <p className="font-display text-lg font-bold">{active.label}</p>
                <p className="text-sm text-[#E7DFCB]">{active.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                className="rounded-full border border-[#D4A32C] px-4 py-1.5 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
