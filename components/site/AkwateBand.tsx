const GRADIENT =
  "linear-gradient(135deg,#D4A32C 25%,transparent 25%,transparent 75%,#D4A32C 75%),linear-gradient(45deg,#B5562A 25%,transparent 25%,transparent 75%,#B5562A 75%)";

/** Palm-green triangle band that marks major section breaks (or a thin seal under the nav). */
export function AkwateBand({ variant = "section" }: { variant?: "section" | "seal" }) {
  const isSeal = variant === "seal";
  return (
    <div
      aria-hidden
      className={
        isSeal
          ? "h-[11px] border-t border-gold-light [background-position:0_0,11px_0] [background-size:22px_22px] lg:h-[13px] lg:[background-position:0_0,13px_0] lg:[background-size:26px_26px]"
          : "h-[26px] border-y border-gold-light [background-position:0_0,13px_0] [background-size:26px_26px] lg:h-[30px] lg:[background-position:0_0,15px_0] lg:[background-size:30px_30px]"
      }
      style={{ backgroundColor: "#0E5C34", backgroundImage: GRADIENT }}
    />
  );
}
