"use client";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-[#EFE7D6] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            value === opt.value
              ? "bg-[#FFFDF8] text-[#0E5C34] shadow-sm"
              : "text-[#6E6455]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
