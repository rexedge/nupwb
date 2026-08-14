type IconProps = { className?: string };

const base = "stroke-current fill-none";

export function DashboardIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={`${base} ${className}`} aria-hidden>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function MenuListIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" className={`${base} ${className}`} aria-hidden>
      <circle cx="4.2" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <line x1="9" y1="6" x2="21" y2="6" />
      <circle cx="4.2" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <circle cx="4.2" cy="18" r="1.1" fill="currentColor" stroke="none" />
      <line x1="9" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function QrGlyphIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.6} className={`${base} ${className}`} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="5.5" y="5.5" width="2" height="2" fill="currentColor" stroke="none" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="16.5" y="5.5" width="2" height="2" fill="currentColor" stroke="none" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="5.5" y="16.5" width="2" height="2" fill="currentColor" stroke="none" />
      <rect x="14.5" y="14.5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="18.5" y="14.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
      <rect x="14.5" y="18.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
      <rect x="18.5" y="18.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SettingsSlidersIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" className={`${base} ${className}`} aria-hidden>
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="15" cy="6" r="2" fill="var(--nav-icon-bg,#FFFDF8)" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="9" cy="12" r="2" fill="var(--nav-icon-bg,#FFFDF8)" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="17" cy="18" r="2" fill="var(--nav-icon-bg,#FFFDF8)" />
    </svg>
  );
}
