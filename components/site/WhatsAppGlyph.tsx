/** Minimal speech-bubble glyph standing in for a WhatsApp icon — keeps the design system dependency-free.
 * Pass size + rounded-* classes via className; this only supplies the fill colour. */
export function WhatsAppGlyph({ className = "", color = "#FBF6EC" }: { className?: string; color?: string }) {
  return <span aria-hidden className={`block ${className}`} style={{ backgroundColor: color }} />;
}
