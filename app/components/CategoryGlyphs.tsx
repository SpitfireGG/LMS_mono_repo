/**
 * One consistent illustration language for every course category:
 * thin geometric strokes, one orbit ellipse, one four-point star,
 * one lime (or contrast) accent. Replaces the mixed clip-art styles.
 */

type GlyphProps = {
  /** main stroke color — ink on light cards, white on dark cards */
  ink: string;
  /** accent fill — lime on light/dark, white on lime cards */
  accent: string;
  className?: string;
};

const star = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}c${r * 0.083} ${r * 0.55} ${r * 0.367} ${r * 0.833} ${r * 0.917} ${r}c-${r * 0.55} ${r * 0.167}-${r * 0.833} ${r * 0.45}-${r * 0.917} ${r}c-${r * 0.083}-${r * 0.55}-${r * 0.367}-${r * 0.833}-${r * 0.917}-${r}c${r * 0.55}-${r * 0.167} ${r * 0.833}-${r * 0.45} ${r * 0.917}-${r}Z`;

function Frame({
  ink,
  className,
  children,
}: {
  ink: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 190 170" fill="none" className={className} aria-hidden>
      <ellipse
        cx="95"
        cy="92"
        rx="88"
        ry="34"
        stroke={ink}
        strokeOpacity="0.3"
        strokeWidth="1.6"
        transform="rotate(-12 95 92)"
      />
      {children}
    </svg>
  );
}

/** NAATI CCL — two speech bubbles interpreting between languages */
export function GlyphInterpreting({ ink, accent, className }: GlyphProps) {
  return (
    <Frame ink={ink} className={className}>
      <rect x="30" y="34" width="72" height="50" rx="14" fill={accent} stroke={ink} strokeWidth="3.5" />
      <path d="M48 84v14l16-14" fill={accent} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      {/* detail on the light accent fill must stay dark on every card tone */}
      <text x="66" y="66" textAnchor="middle" fontSize="24" fontWeight="600" fill="#0a4a29">अ</text>
      <rect x="92" y="66" width="72" height="50" rx="14" fill="none" stroke={ink} strokeWidth="3.5" />
      <path d="M146 116v14l-16-14" fill="none" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <text x="128" y="98" textAnchor="middle" fontSize="24" fontWeight="600" fill={ink}>A</text>
      <path d={star(162, 30, 12)} fill={ink} />
    </Frame>
  );
}

/** PTE & IELTS — target gauge with rising needle */
export function GlyphTestPrep({ ink, accent, className }: GlyphProps) {
  return (
    <Frame ink={ink} className={className}>
      <path d="M40 108a56 56 0 0 1 112 0" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52 108a44 44 0 0 1 88 0" fill="none" stroke={ink} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7" />
      <circle cx="96" cy="108" r="9" fill={accent} stroke={ink} strokeWidth="3.5" />
      <path d="M96 108 132 66" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M139 55l7 18-19-4" fill={accent} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      <path d={star(34, 42, 11)} fill={ink} />
    </Frame>
  );
}

/** Languages & Culture — globe with meridians */
export function GlyphLanguages({ ink, accent, className }: GlyphProps) {
  return (
    <Frame ink={ink} className={className}>
      <circle cx="96" cy="76" r="44" fill="none" stroke={ink} strokeWidth="3.5" />
      <ellipse cx="96" cy="76" rx="20" ry="44" fill="none" stroke={ink} strokeWidth="2.4" />
      <path d="M54 62h84M54 90h84" stroke={ink} strokeWidth="2.4" />
      <circle cx="140" cy="110" r="12" fill={accent} stroke={ink} strokeWidth="3.5" />
      <path d="M137 110l3 3 5-6" stroke="#0a4a29" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={star(42, 122, 11)} fill={ink} />
    </Frame>
  );
}

/** Technology & Coding — brackets and a cursor block */
export function GlyphCoding({ ink, accent, className }: GlyphProps) {
  return (
    <Frame ink={ink} className={className}>
      <path d="M62 44 34 76l28 32" fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M130 44l28 32-28 32" fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="84" y="60" width="26" height="32" rx="6" fill={accent} stroke={ink} strokeWidth="3.5" transform="rotate(12 97 76)" />
      <path d={star(154, 118, 11)} fill={ink} />
    </Frame>
  );
}

/** Design & Creative — pen nib in a frame */
export function GlyphDesign({ ink, accent, className }: GlyphProps) {
  return (
    <Frame ink={ink} className={className}>
      <path d="M96 36c14 14 22 24 22 38a22 22 0 1 1-44 0c0-14 8-24 22-38Z" fill={accent} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="96" cy="76" r="7" fill="none" stroke="#0a4a29" strokeWidth="3" />
      <path d="M96 83v20" stroke="#0a4a29" strokeWidth="3" strokeLinecap="round" />
      <rect x="42" y="106" width="108" height="3.5" rx="1.75" fill={ink} />
      <path d={star(150, 40, 12)} fill={ink} />
    </Frame>
  );
}

/** Business & Finance — rising bars with flag */
export function GlyphBusiness({ ink, accent, className }: GlyphProps) {
  return (
    <Frame ink={ink} className={className}>
      <rect x="46" y="86" width="20" height="34" rx="5" fill="none" stroke={ink} strokeWidth="3.5" />
      <rect x="80" y="66" width="20" height="54" rx="5" fill={accent} stroke={ink} strokeWidth="3.5" />
      <rect x="114" y="46" width="20" height="74" rx="5" fill="none" stroke={ink} strokeWidth="3.5" />
      <path d="M124 46V26l16 7-16 7" fill={accent} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      <path d={star(40, 44, 11)} fill={ink} />
    </Frame>
  );
}
