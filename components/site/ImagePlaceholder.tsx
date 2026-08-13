/** Stand-in for a photo that hasn't been shot/uploaded yet — swap for next/image once real photography lands. */
export function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[#EFE7D6] ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg,#E3D9C2 0 6px,#EFE7D6 6px 12px)",
      }}
    >
      <span className="rounded bg-card/85 px-3 py-1 text-center text-[13px] font-medium text-muted">
        {label}
      </span>
    </div>
  );
}
