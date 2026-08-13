"use client";

import { useEffect } from "react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[#1E1B16]/50"
      />
      <div className="relative w-full max-w-md rounded-t-2xl bg-[#FFFDF8] p-6 shadow-xl sm:rounded-2xl sm:mb-0 mb-0 max-h-[85vh] overflow-y-auto">
        {title && (
          <h2 className="font-display mb-4 text-[24px] font-bold text-[#1E1B16]">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
