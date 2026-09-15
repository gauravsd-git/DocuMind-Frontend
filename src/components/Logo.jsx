// Pixel-grid mark, recolored into the DocuMind accent. Eye cutouts are
// hardcoded to --color-bg, so this only reads correctly on the dark
// background — it's used on the navbar/footer, both of which sit on #0A0A0E.
const ACCENT = "#FF6A45";
const CUTOUT = "#0A0A0E";

export default function Logo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="0" width="4" height="8" fill={ACCENT} />
      <rect x="24" y="0" width="4" height="8" fill={ACCENT} />
      <rect x="8" y="8" width="16" height="4" fill={ACCENT} />
      <rect x="4" y="12" width="24" height="4" fill={ACCENT} />
      <rect x="0" y="16" width="32" height="12" fill={ACCENT} />
      <rect x="0" y="28" width="4" height="4" fill={ACCENT} />
      <rect x="8" y="28" width="4" height="4" fill={ACCENT} />
      <rect x="16" y="28" width="4" height="4" fill={ACCENT} />
      <rect x="24" y="28" width="4" height="4" fill={ACCENT} />
      <rect x="6" y="18" width="6" height="8" fill={CUTOUT} />
      <rect x="20" y="18" width="6" height="8" fill={CUTOUT} />
    </svg>
  );
}