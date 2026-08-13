"use client";

export function Toggle({
  checked,
  onChange,
  label,
  size = "md",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "h-8 w-14" : "h-[26px] w-11";
  const knob = size === "lg" ? "h-7 w-7" : "h-[22px] w-[22px]";
  const translate = size === "lg" ? "translate-x-6" : "translate-x-[22px]";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex ${dims} shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[#0E5C34]" : "bg-[#D9CDAE]"
      }`}
    >
      <span
        className={`inline-block ${knob} transform rounded-full bg-[#FFFDF8] shadow transition-transform ${
          checked ? translate : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
