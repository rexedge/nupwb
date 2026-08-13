/** Wax-print texture: gold dots + crosshatch over Palm/Deep Green. Decoration only, never behind body copy. */
export function AnkaraPattern({
  opacity = 0.08,
  corners = true,
  className = "",
}: {
  opacity?: number;
  corners?: boolean;
  className?: string;
}) {
  const dots = corners
    ? "radial-gradient(circle at 50% 50%,#E9C46A 0 3.5px,transparent 4px),radial-gradient(circle at 0 0,#E9C46A 0 2.5px,transparent 3px),radial-gradient(circle at 100% 100%,#E9C46A 0 2.5px,transparent 3px),"
    : "radial-gradient(circle at 50% 50%,#E9C46A 0 4px,transparent 4.5px),";
  const sizes = corners ? "52px 52px,52px 52px,52px 52px,auto,auto" : "60px 60px,auto,auto";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `${dots}repeating-linear-gradient(45deg,#E9C46A 0 1px,transparent 1px 16px),repeating-linear-gradient(-45deg,#E9C46A 0 1px,transparent 1px 16px)`,
        backgroundSize: sizes,
      }}
    />
  );
}
