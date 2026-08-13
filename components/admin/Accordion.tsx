"use client";

import { useState } from "react";

export function Accordion({
  title,
  preview,
  defaultOpen = false,
  children,
}: {
  title: string;
  preview?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E0CD98] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
      >
        <span className="text-[17px] font-semibold text-[#1E1B16]">{title}</span>
        <span className="flex items-center gap-3">
          {preview && !open && (
            <span className="text-sm text-[#6E6455]">{preview}</span>
          )}
          <span
            className="inline-block text-[#0E5C34] transition-transform"
            style={{ transform: open ? "rotate(-135deg)" : "rotate(45deg)" }}
          >
            &#10132;
          </span>
        </span>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}
