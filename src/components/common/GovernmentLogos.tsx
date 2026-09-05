import React from 'react';

/**
 * State Emblem of India (Ashoka Lion Capital)
 * With Satyameva Jayate (सत्यमेव जयते) in Devanagari script
 */
/**
 * Official State Emblem of India (Ashoka Lion Capital)
 * Authentic Government of India National Emblem with Satyameva Jayate (सत्यमेव जयते)
 * Supports monochrome, sovereign gold gradient, or authentic National Tricolor palette
 */
export const AshokaEmblem: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  goldTone?: boolean;
  tricolor?: boolean;
}> = ({
  className = '',
  size = 48,
  color = '#002244',
  goldTone = false,
  tricolor = false
}) => {
  if (tricolor) {
    return <TricolorAshokaEmblem size={size} className={className} />;
  }

  const primary = goldTone ? 'url(#govIndiaGoldGrad)' : color;
  const secondary = goldTone ? '#A16207' : color;

  return (
    <svg
      viewBox="0 0 100 135"
      width={size}
      height={(size * 135) / 100}
      className={`select-none shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="govIndiaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="80%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>

      {/* CENTRAL LION HEAD & MANE */}
      <path
        d="M50 6 C42 6 36 12 36 21 C36 27 39 31 43 33 C40 37 38 42 38 48 C34 50 32 54 33 58 C34 63 38 65 42 66 C42 70 44 74 47 77 C48 78 52 78 53 77 C56 74 58 70 58 66 C62 65 66 63 67 58 C68 54 66 50 62 48 C62 42 60 37 57 33 C61 31 64 27 64 21 C64 12 58 6 50 6 Z"
        fill={primary}
      />
      {/* Central Lion Ears */}
      <path d="M41 12 C39 8 44 7 46 11 Z" fill={primary} />
      <path d="M59 12 C61 8 56 7 54 11 Z" fill={primary} />
      {/* Central Lion Eyes & Muzzle Details */}
      <circle cx="46" cy="22" r="1.8" fill="#ffffff" />
      <circle cx="54" cy="22" r="1.8" fill="#ffffff" />
      <circle cx="46" cy="22" r="1" fill={secondary} />
      <circle cx="54" cy="22" r="1" fill={secondary} />
      <path d="M47 26 Q50 28 53 26" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M48 30 Q50 32 52 30" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* LEFT LION (Profile Facing Left) */}
      <path
        d="M32 14 C26 14 21 19 22 25 C23 30 27 34 31 35 C30 39 30 44 31 48 C27 50 25 54 26 58 C27 62 30 64 34 64 C35 68 37 71 40 73 L38 63 C36 62 34 59 34 56 C33 51 34 46 33 41 C30 39 27 35 26 30 C26 24 29 20 33 19 L32 14 Z"
        fill={primary}
        opacity="0.95"
      />
      {/* Left Lion Eye */}
      <circle cx="28" cy="24" r="1.4" fill="#ffffff" />
      <circle cx="27.5" cy="24" r="0.8" fill={secondary} />

      {/* RIGHT LION (Profile Facing Right) */}
      <path
        d="M68 14 C74 14 79 19 78 25 C77 30 73 34 69 35 C70 39 70 44 69 48 C73 50 75 54 74 58 C73 62 70 64 66 64 C65 68 63 71 60 73 L62 63 C64 62 66 59 66 56 C67 51 66 46 67 41 C70 39 73 35 74 30 C74 24 71 20 67 19 L68 14 Z"
        fill={primary}
        opacity="0.95"
      />
      {/* Right Lion Eye */}
      <circle cx="72" cy="24" r="1.4" fill="#ffffff" />
      <circle cx="72.5" cy="24" r="0.8" fill={secondary} />

      {/* REAR LION SILHOUETTE HINT */}
      <path d="M46 6 C48 3 52 3 54 6" stroke={primary} strokeWidth="2" strokeLinecap="round" />

      {/* ABACUS PEDESTAL PLATFORM (Upper band) */}
      <rect x="20" y="79" width="60" height="4" rx="1" fill={primary} />

      {/* ASHOKA CHAKRA (Center of Abacus) - 24 Spokes */}
      <circle cx="50" cy="92" r="8" stroke={primary} strokeWidth="1.6" fill="#ffffff" />
      <circle cx="50" cy="92" r="1.8" fill={primary} />
      {/* Radiating 12 spoke lines across */}
      <g transform="translate(50, 92)">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="-7.2"
            y1="0"
            x2="7.2"
            y2="0"
            stroke={primary}
            strokeWidth="0.75"
            transform={`rotate(${i * 15})`}
          />
        ))}
      </g>

      {/* GALLOPING HORSE (Left of Abacus) */}
      <path
        d="M28 88 C26 86 24 87 23 88 C22 90 22 92 23 94 C24 95 26 95 28 94 C29 93 30 90 28 88 Z"
        fill={primary}
      />
      <path d="M23 93 L21 97 M26 94 L25 98 M28 94 L30 97" stroke={primary} strokeWidth="1" strokeLinecap="round" />

      {/* HUMPED BULL (Right of Abacus) */}
      <path
        d="M72 88 C74 86 76 87 77 88 C78 90 78 92 77 94 C76 95 74 95 72 94 C71 93 70 90 72 88 Z"
        fill={primary}
      />
      <path d="M77 93 L79 97 M74 94 L75 98 M72 94 L70 97" stroke={primary} strokeWidth="1" strokeLinecap="round" />

      {/* LOWER ABACUS BAND */}
      <rect x="20" y="101" width="60" height="3" rx="1" fill={primary} />

      {/* INVERTED BELL-SHAPED LOTUS (Petal Sculpture Base) */}
      <path
        d="M22 105 C30 110 40 113 50 113 C60 113 70 110 78 105 C75 113 64 116 50 116 C36 116 25 113 22 105 Z"
        fill={primary}
      />
      <path
        d="M28 105 C35 109 43 111 50 111 C57 111 65 109 72 105"
        stroke="#ffffff"
        strokeWidth="0.8"
        fill="none"
        opacity="0.8"
      />

      {/* BASE PLINTH BAR */}
      <rect x="24" y="117" width="52" height="3" rx="1" fill={primary} />

      {/* OFFICIAL MOTTO IN DEVANAGARI: सत्यमेव जयते (Satyameva Jayate) */}
      <text
        x="50"
        y="129.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="800"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fill={primary}
        letterSpacing="0.6"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
};

/**
 * Authentic State Emblem of India in National Tricolor illumination
 * Exactly matches the official Lion Capital with:
 * - Saffron Left Lion (Kesariya / #FF9933)
 * - White Center Lion (Shwet / #FFFFFF)
 * - Green Right Lion (Hara / #138808)
 * - Abacus with Saffron Galloping Horse, Navy Blue 24-Spoke Ashoka Chakra, and Green Humped Bull
 * - Sacred Inverted Lotus Plinth and "सत्यमेव जयते" Motto
 */
export const TricolorAshokaEmblem: React.FC<{
  size?: number;
  className?: string;
  badgeBg?: boolean;
}> = ({
  size = 54,
  className = '',
  badgeBg = false
}) => {
  const content = (
    <svg
      viewBox="0 0 120 185"
      width={size}
      height={(size * 185) / 120}
      className={`select-none shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Saffron gradient for left lion */}
        <linearGradient id="ashokaSaffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA033" />
          <stop offset="40%" stopColor="#FF8500" />
          <stop offset="85%" stopColor="#E06500" />
          <stop offset="100%" stopColor="#B34700" />
        </linearGradient>

        {/* White / Silver gradient for central lion */}
        <linearGradient id="ashokaWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F8FAFC" />
          <stop offset="90%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Green gradient for right lion */}
        <linearGradient id="ashokaGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="30%" stopColor="#16A34A" />
          <stop offset="75%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#0B5524" />
        </linearGradient>

        {/* Dark metallic for abacus frame */}
        <linearGradient id="ashokaAbacusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="40%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Navy Blue for Ashoka Chakra */}
        <radialGradient id="ashokaChakraBlueGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="65%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#002244" />
        </radialGradient>
      </defs>

      {/* ========================================================
          1. LEFT LION (SAFFRON / के सरिया) - Profile facing left
         ======================================================== */}
      <g id="left-lion-saffron">
        {/* Main body silhouette and mane */}
        <path
          d="M38 18 C30 18 24 23 23 30 C22 34 24 37 27 39 C23 43 20 48 21 54 C21 57 23 60 26 62 C23 66 22 72 25 76 C28 80 32 81 37 80 C36 85 38 90 41 94 L42 108 L34 108 C32 108 31 106 31 104 C30 98 31 92 30 87 C27 86 24 83 23 79 C20 74 20 68 22 63 C18 58 17 50 20 44 C22 40 25 37 29 35 C28 30 30 25 35 21 C36 20 37 19 38 18 Z"
          fill="url(#ashokaSaffronGrad)"
          stroke="#9A3412"
          strokeWidth="0.8"
        />

        {/* Left Lion Mane Tufts Detail (Saffron shading) */}
        <path
          d="M26 33 C23 36 24 41 27 44 M22 47 C20 52 22 57 26 59 M23 64 C22 70 25 74 29 76 M27 78 C28 83 31 87 35 88"
          stroke="#7C2D12"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34 26 C30 30 31 36 35 39 M30 42 C28 47 30 52 35 55 M31 58 C30 64 33 69 38 71"
          stroke="#FFB74D"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Lion Profile Head & Roaring Jaw */}
        <path
          d="M24 24 C20 25 15 28 14 33 C13 36 15 39 19 40 C17 42 16 45 17 48 C18 51 21 52 24 51 L25 48 C22 48 20 46 20 43 C20 40 23 39 25 39 L27 34 C25 32 23 28 24 24 Z"
          fill="#EA580C"
          stroke="#7C2D12"
          strokeWidth="0.8"
        />
        {/* Left Ear */}
        <path d="M28 20 C27 16 32 15 34 19 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="0.8" />
        {/* Open Roaring Mouth & Fangs */}
        <path d="M14 35 L19 38 L14 41 Z" fill="#7C2D12" />
        <polygon points="15,35 17,37 15,38" fill="#FFFFFF" />
        <polygon points="15,41 17,39 15,38" fill="#FFFFFF" />
        {/* Eye in Profile */}
        <ellipse cx="21" cy="30" rx="2" ry="1.4" fill="#FFFFFF" stroke="#7C2D12" strokeWidth="0.6" />
        <circle cx="20.5" cy="30" r="1" fill="#431407" />
        {/* Saffron Front Left Leg & Paw */}
        <path
          d="M38 90 L36 109 C36 112 34 114 31 114 C27 114 26 111 26 109 L28 98"
          stroke="#9A3412"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="25" y="112" width="10" height="3" rx="1.5" fill="#EA580C" stroke="#7C2D12" strokeWidth="0.6" />
        {/* Paw Claws */}
        <line x1="27" y1="115" x2="27" y2="117" stroke="#431407" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="30" y1="115" x2="30" y2="117" stroke="#431407" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="33" y1="115" x2="33" y2="117" stroke="#431407" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* ========================================================
          2. RIGHT LION (GREEN / हरा) - Profile facing right
         ======================================================== */}
      <g id="right-lion-green">
        {/* Main body silhouette and mane */}
        <path
          d="M82 18 C90 18 96 23 97 30 C98 34 96 37 93 39 C97 43 100 48 99 54 C99 57 97 60 94 62 C97 66 98 72 95 76 C92 80 88 81 83 80 C84 85 82 90 79 94 L78 108 L86 108 C88 108 89 106 89 104 C90 98 89 92 90 87 C93 86 96 83 97 79 C100 74 100 68 98 63 C102 58 103 50 100 44 C98 40 95 37 91 35 C92 30 90 25 85 21 C84 20 83 19 82 18 Z"
          fill="url(#ashokaGreenGrad)"
          stroke="#14532D"
          strokeWidth="0.8"
        />

        {/* Right Lion Mane Tufts Detail (Green shading) */}
        <path
          d="M94 33 C97 36 96 41 93 44 M98 47 C100 52 98 57 94 59 M97 64 C98 70 95 74 91 76 M93 78 C92 83 89 87 85 88"
          stroke="#052E16"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M86 26 C90 30 89 36 85 39 M90 42 C92 47 90 52 85 55 M89 58 C90 64 87 69 82 71"
          stroke="#86EFAC"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Lion Profile Head & Roaring Jaw */}
        <path
          d="M96 24 C100 25 105 28 106 33 C107 36 105 39 101 40 C103 42 104 45 103 48 C102 51 99 52 96 51 L95 48 C98 48 100 46 100 43 C100 40 97 39 95 39 L93 34 C95 32 97 28 96 24 Z"
          fill="#15803D"
          stroke="#052E16"
          strokeWidth="0.8"
        />
        {/* Right Ear */}
        <path d="M92 20 C93 16 88 15 86 19 Z" fill="#166534" stroke="#052E16" strokeWidth="0.8" />
        {/* Open Roaring Mouth & Fangs */}
        <path d="M106 35 L101 38 L106 41 Z" fill="#052E16" />
        <polygon points="105,35 103,37 105,38" fill="#FFFFFF" />
        <polygon points="105,41 103,39 105,38" fill="#FFFFFF" />
        {/* Eye in Profile */}
        <ellipse cx="99" cy="30" rx="2" ry="1.4" fill="#FFFFFF" stroke="#052E16" strokeWidth="0.6" />
        <circle cx="99.5" cy="30" r="1" fill="#022C22" />
        {/* Green Front Right Leg & Paw */}
        <path
          d="M82 90 L84 109 C84 112 86 114 89 114 C93 114 94 111 94 109 L92 98"
          stroke="#14532D"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="85" y="112" width="10" height="3" rx="1.5" fill="#15803D" stroke="#052E16" strokeWidth="0.6" />
        {/* Paw Claws */}
        <line x1="87" y1="115" x2="87" y2="117" stroke="#022C22" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="90" y1="115" x2="90" y2="117" stroke="#022C22" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="93" y1="115" x2="93" y2="117" stroke="#022C22" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* ========================================================
          3. CENTRAL LION (WHITE / श्वेत) - Frontal View
         ======================================================== */}
      <g id="central-lion-white">
        {/* Back mane layer (depth) */}
        <path
          d="M60 6 C48 6 42 12 40 20 C36 28 37 36 38 44 C37 52 38 60 41 68 C44 76 48 83 52 88 L54 114 L66 114 L68 88 C72 83 76 76 79 68 C82 60 83 52 82 44 C83 36 84 28 80 20 C78 12 72 6 60 6 Z"
          fill="url(#ashokaWhiteGrad)"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Outer mane locks & curls (curling outward symmetrically) */}
        <g stroke="#1E293B" strokeWidth="1" fill="#F8FAFC">
          {/* Top crown tufts */}
          <path d="M54 10 C50 6 46 11 50 15 Z" />
          <path d="M60 8 C60 4 64 7 60 12 Z" />
          <path d="M66 10 C70 6 74 11 70 15 Z" />

          {/* Left mane scrolls */}
          <path d="M44 18 C38 18 38 26 44 26 C40 28 40 34 45 34 C41 37 42 44 47 43 C43 47 45 54 50 53 C46 57 48 64 53 64" />
          {/* Right mane scrolls */}
          <path d="M76 18 C82 18 82 26 76 26 C80 28 80 34 75 34 C79 37 78 44 73 43 C77 47 75 54 70 53 C74 57 72 64 67 64" />
        </g>

        {/* Two Central Front Legs (White/Silver with claws) */}
        <g id="central-legs">
          {/* Left front leg */}
          <rect x="47" y="74" width="7" height="40" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="0.9" />
          <line x1="50.5" y1="80" x2="50.5" y2="108" stroke="#94A3B8" strokeWidth="0.8" />
          <rect x="46" y="112" width="9" height="3" rx="1.5" fill="#F1F5F9" stroke="#1E293B" strokeWidth="0.7" />
          <line x1="48" y1="115" x2="48" y2="117" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="50.5" y1="115" x2="50.5" y2="117" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="53" y1="115" x2="53" y2="117" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />

          {/* Right front leg */}
          <rect x="66" y="74" width="7" height="40" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="0.9" />
          <line x1="69.5" y1="80" x2="69.5" y2="108" stroke="#94A3B8" strokeWidth="0.8" />
          <rect x="65" y="112" width="9" height="3" rx="1.5" fill="#F1F5F9" stroke="#1E293B" strokeWidth="0.7" />
          <line x1="67" y1="115" x2="67" y2="117" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="69.5" y1="115" x2="69.5" y2="117" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="72" y1="115" x2="72" y2="117" stroke="#0F172A" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* Central Lion Chest Fur Shading */}
        <path
          d="M54 70 C57 74 60 76 63 74 C66 74 69 70 70 66 C65 68 59 68 54 70 Z"
          fill="#E2E8F0"
          stroke="#475569"
          strokeWidth="0.6"
        />

        {/* Central Lion Face Core */}
        <ellipse cx="60" cy="36" rx="14" ry="16" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />

        {/* Ears */}
        <path d="M47 24 C45 19 50 18 52 23 Z" fill="#F1F5F9" stroke="#1E293B" strokeWidth="0.9" />
        <path d="M73 24 C75 19 70 18 68 23 Z" fill="#F1F5F9" stroke="#1E293B" strokeWidth="0.9" />

        {/* Forehead wrinkles & curls */}
        <path d="M57 24 C59 22 61 22 63 24" stroke="#475569" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M56 27 C59 25 61 25 64 27" stroke="#475569" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="23" r="1" fill="#475569" />

        {/* Eyes & Eyebrows */}
        <path d="M51 30 Q54 28 57 31" stroke="#1E293B" strokeWidth="1.2" fill="none" />
        <path d="M69 30 Q66 28 63 31" stroke="#1E293B" strokeWidth="1.2" fill="none" />
        <ellipse cx="54" cy="33" rx="2.4" ry="1.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="0.8" />
        <ellipse cx="66" cy="33" rx="2.4" ry="1.8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="0.8" />
        <circle cx="54" cy="33" r="1.1" fill="#0F172A" />
        <circle cx="66" cy="33" r="1.1" fill="#0F172A" />

        {/* Nose Bridge and Whisker Pads */}
        <path d="M58 34 L57 41 L63 41 L62 34 Z" fill="#F1F5F9" stroke="#475569" strokeWidth="0.7" />
        <path d="M57 41 Q60 43 63 41 L61 44 L59 44 Z" fill="#0F172A" />
        {/* Whisker dots */}
        <circle cx="53" cy="42" r="0.5" fill="#334155" />
        <circle cx="51.5" cy="43.5" r="0.5" fill="#334155" />
        <circle cx="53.5" cy="44.5" r="0.5" fill="#334155" />
        <circle cx="67" cy="42" r="0.5" fill="#334155" />
        <circle cx="68.5" cy="43.5" r="0.5" fill="#334155" />
        <circle cx="66.5" cy="44.5" r="0.5" fill="#334155" />

        {/* Roaring Mouth, Fangs & Tongue */}
        <path
          d="M55 46 Q60 48 65 46 Q63 53 60 54 Q57 53 55 46 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="0.8"
        />
        {/* Tongue */}
        <path d="M58 50 Q60 53 62 50 Z" fill="#DC2626" />
        {/* Fangs */}
        <polygon points="56,46 57,49 58,46" fill="#FFFFFF" />
        <polygon points="62,46 63,49 64,46" fill="#FFFFFF" />
        <polygon points="57,52 58,50 59,52" fill="#FFFFFF" />
        <polygon points="61,52 62,50 63,52" fill="#FFFFFF" />

        {/* Chin & Beard tufts */}
        <path d="M56 55 Q60 59 64 55" stroke="#1E293B" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M54 58 Q60 63 66 58" stroke="#1E293B" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </g>

      {/* ========================================================
          4. ABACUS PEDESTAL (THE METALLIC CIRCULAR DRUM PLATFORM)
         ======================================================== */}
      <g id="abacus-platform">
        {/* Upper abacus rim with metallic edge */}
        <rect x="14" y="117" width="92" height="4.5" rx="1.5" fill="url(#ashokaAbacusGrad)" stroke="#0F172A" strokeWidth="0.8" />
        {/* Beaded pearl relief along upper edge */}
        {Array.from({ length: 19 }).map((_, i) => (
          <circle key={'u' + i} cx={18 + i * 4.6} cy={119.2} r="1" fill="#FFFFFF" opacity="0.9" />
        ))}

        {/* Abacus main frieze body */}
        <rect x="12" y="121.5" width="96" height="23" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />

        {/* Left Side Drum Wheel / Fluted Hub */}
        <g id="abacus-left-hub">
          <ellipse cx="14" cy="133" rx="3.5" ry="10" fill="#334155" stroke="#0F172A" strokeWidth="0.8" />
          <ellipse cx="14" cy="133" rx="1.8" ry="6" fill="#64748B" />
          <circle cx="14" cy="133" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Right Side Drum Wheel / Fluted Hub */}
        <g id="abacus-right-hub">
          <ellipse cx="106" cy="133" rx="3.5" ry="10" fill="#334155" stroke="#0F172A" strokeWidth="0.8" />
          <ellipse cx="106" cy="133" rx="1.8" ry="6" fill="#64748B" />
          <circle cx="106" cy="133" r="1.2" fill="#FFFFFF" />
        </g>

        {/* ========================================================
            4A. GALLOPING HORSE (LEFT - SAFFRON / के सरिया)
           ======================================================== */}
        <g id="abacus-galloping-horse">
          {/* Muscular Galloping Horse in glowing saffron/orange */}
          <path
            d="M25 137 C23 134 22 131 24 128 C26 125 29 125 31 127 C33 125 36 124 38 126 C41 128 42 131 41 133 C42 134 43 136 41 138 C39 140 36 140 33 138 C30 140 27 141 25 137 Z"
            fill="#FF9933"
            stroke="#C2410C"
            strokeWidth="0.6"
          />
          {/* Horse Head & Arching Neck */}
          <path
            d="M36 126 C37 124 39 123 41 124 C42 125 43 127 41 129 C39 130 37 128 36 126 Z"
            fill="#FFA033"
          />
          {/* Galloping Legs */}
          {/* Front legs extended forward */}
          <path d="M39 134 L43 138 M37 136 L40 142" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round" />
          {/* Hind legs pushing back */}
          <path d="M26 137 L21 141 M28 138 L24 143" stroke="#FF9933" strokeWidth="1.2" strokeLinecap="round" />
          {/* Flying Tail */}
          <path d="M24 129 C21 130 19 133 21 135" stroke="#FFA033" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          {/* Hooves */}
          <circle cx="43" cy="138" r="0.6" fill="#431407" />
          <circle cx="40" cy="142" r="0.6" fill="#431407" />
          <circle cx="21" cy="141" r="0.6" fill="#431407" />
          <circle cx="24" cy="143" r="0.6" fill="#431407" />
        </g>

        {/* ========================================================
            4B. ASHOKA CHAKRA (CENTER - NAVY BLUE WHEEL, 24 SPOKES)
           ======================================================== */}
        <g id="abacus-ashoka-chakra" transform="translate(60, 133)">
          {/* Outer ring */}
          <circle cx="0" cy="0" r="10.5" fill="url(#ashokaChakraBlueGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="9.2" fill="#0A369D" stroke="#93C5FD" strokeWidth="0.4" />

          {/* 24 Radiating White Spokes */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={'spoke' + i}
              x1="0"
              y1="-2"
              x2="0"
              y2="-9"
              stroke="#FFFFFF"
              strokeWidth="0.65"
              strokeLinecap="round"
              transform={`rotate(${i * 15})`}
            />
          ))}

          {/* Concentric Center Hub */}
          <circle cx="0" cy="0" r="2.4" fill="#FFFFFF" />
          <circle cx="0" cy="0" r="1.3" fill="#0A369D" />
          <circle cx="0" cy="0" r="0.5" fill="#FFFFFF" />
        </g>

        {/* ========================================================
            4C. SACRED ZEBU BULL (RIGHT - GREEN / हरा)
           ======================================================== */}
        <g id="abacus-sacred-bull">
          {/* Humped Indian Bull in vibrant Green */}
          <path
            d="M79 137 C77 140 80 142 83 140 C85 141 89 140 91 138 C94 139 96 137 96 134 C97 131 96 128 93 127 C91 125 88 125 86 127 C84 126 81 127 80 130 C78 132 78 135 79 137 Z"
            fill="#16A34A"
            stroke="#052E16"
            strokeWidth="0.6"
          />
          {/* Characteristic Zebu Shoulder Hump */}
          <ellipse cx="88" cy="126" rx="2.5" ry="3.5" fill="#22C55E" stroke="#052E16" strokeWidth="0.5" />
          {/* Bull Head & Horns */}
          <path d="M93 128 L97 129 L95 133 Z" fill="#15803D" />
          <path d="M96 127 Q98 124 99 125" stroke="#F1F5F9" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          <path d="M94 127 Q95 124 96 125" stroke="#F1F5F9" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          {/* Sturdy Bull Legs */}
          <path d="M81 137 L79 143 M85 138 L83 144 M89 137 L91 143 M93 136 L95 142" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" />
          {/* Tail with tuft */}
          <path d="M78 131 C76 133 75 137 77 140" stroke="#15803D" strokeWidth="0.8" fill="none" />
          <circle cx="77" cy="140" r="0.8" fill="#052E16" />
          {/* Hooves */}
          <circle cx="79" cy="143" r="0.6" fill="#022C22" />
          <circle cx="83" cy="144" r="0.6" fill="#022C22" />
          <circle cx="91" cy="143" r="0.6" fill="#022C22" />
          <circle cx="95" cy="142" r="0.6" fill="#022C22" />
        </g>

        {/* Lower abacus rim with metallic edge */}
        <rect x="14" y="144.5" width="92" height="4" rx="1.5" fill="url(#ashokaAbacusGrad)" stroke="#0F172A" strokeWidth="0.8" />
        {/* Beaded pearl relief along lower edge */}
        {Array.from({ length: 19 }).map((_, i) => (
          <circle key={'l' + i} cx={18 + i * 4.6} cy={146.5} r="1" fill="#FFFFFF" opacity="0.9" />
        ))}
      </g>

      {/* ========================================================
          5. INVERTED BELL LOTUS (PADMASANA / पद्म पीठ)
         ======================================================== */}
      <g id="inverted-lotus-base">
        {/* Bell curve body */}
        <path
          d="M20 148.5 C32 155 46 158 60 158 C74 158 88 155 100 148.5 C95 158 79 162 60 162 C41 162 25 158 20 148.5 Z"
          fill="url(#ashokaAbacusGrad)"
          stroke="#0F172A"
          strokeWidth="0.8"
        />

        {/* Radiating Lotus Petal Flutes */}
        {[-32, -24, -16, -8, 0, 8, 16, 24, 32].map((offset, i) => (
          <path
            key={'petal' + i}
            d={`M${60 + offset * 0.9} 149 C${60 + offset * 0.7} 154 ${60 + offset * 0.5} 157 ${60 + offset * 0.4} 160`}
            stroke="#94A3B8"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
          />
        ))}

        {/* Stepped Plinth Base Bar */}
        <rect x="22" y="162" width="76" height="3" rx="1" fill="#334155" stroke="#0F172A" strokeWidth="0.8" />
        <rect x="26" y="165" width="68" height="2.5" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="0.7" />
      </g>

      {/* ========================================================
          6. SACRED MOTTO: सत्यमेव जयते (SATYAMEVA JAYATE)
         ======================================================== */}
      <g id="satyameva-jayate">
        <text
          x="60"
          y="179"
          textAnchor="middle"
          fontSize="10"
          fontWeight="900"
          fontFamily="'Noto Sans Devanagari', 'Noto Sans', system-ui, sans-serif"
          fill="#0F172A"
          letterSpacing="0.8"
          className="font-bold"
        >
          सत्यमेव जयते
        </text>
      </g>
    </svg>
  );

  if (badgeBg) {
    return (
      <div className={`inline-flex items-center justify-center p-1.5 rounded-xl bg-white/95 border border-white/40 shadow-md backdrop-blur-md ${className}`}>
        {content}
      </div>
    );
  }

  return content;
};

/**
 * Official Government of India Full Header Lockup
 */
export const OfficialGovIndiaLogo: React.FC<{
  size?: number;
  showText?: boolean;
  dark?: boolean;
  className?: string;
}> = ({
  size = 46,
  showText = true,
  dark = false,
  className = ''
}) => (
  <div className={`flex items-center gap-3 select-none ${className}`}>
    <AshokaEmblem size={size} color={dark ? '#ffffff' : '#002244'} />
    {showText && (
      <div className="flex flex-col">
        <span
          className={`text-xs font-black tracking-tight leading-tight font-display ${
            dark ? 'text-white' : 'text-[#002244]'
          }`}
        >
          भारत सरकार
        </span>
        <span
          className={`text-[10px] font-bold tracking-tight leading-tight uppercase font-mono ${
            dark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Government of India
        </span>
      </div>
    )}
  </div>
);

/**
 * Digital India Official Emblem
 */
export const DigitalIndiaLogo: React.FC<{ className?: string; height?: number }> = ({
  className = '',
  height = 36
}) => (
  <div className={`flex items-center gap-2 select-none ${className}`}>
    <div
      className="relative flex items-center justify-center font-black rounded-lg shadow-xs overflow-hidden"
      style={{ height, width: (height * 11) / 10, background: 'linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)' }}
    >
      <div className="w-[84%] h-[84%] bg-slate-900 rounded-md flex flex-col items-center justify-center p-0.5">
        <span className="text-amber-400 text-[10px] font-black leading-none tracking-tighter">DI</span>
        <div className="w-2.5 h-0.5 bg-emerald-400 mt-0.5 rounded-full" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] font-black leading-tight tracking-tight text-slate-900 font-display">
        Digital India
      </span>
      <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider">
        Power To Empower
      </span>
    </div>
  </div>
);

/**
 * Make In India Gear Emblem
 */
export const MakeInIndiaLogo: React.FC<{ className?: string; height?: number }> = ({
  className = '',
  height = 36
}) => (
  <div className={`flex items-center gap-2 select-none ${className}`}>
    <div
      className="rounded-lg bg-amber-50 border border-amber-300/80 flex items-center justify-center shadow-xs text-amber-800"
      style={{ height, width: height }}
    >
      <svg viewBox="0 0 24 24" width={height * 0.65} height={height * 0.65} fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" fill="#f59e0b" stroke="#b45309" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] font-black leading-tight tracking-tight text-slate-900 font-display">
        Make in India
      </span>
      <span className="text-[8px] text-amber-700 font-semibold uppercase tracking-wider">
        Atmanirbhar Bharat
      </span>
    </div>
  </div>
);

/**
 * Bharat Material Grid (BMG) Main Portal Logo & Sovereign Insignia
 */
export const BMGNationalSeal: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = ''
}) => (
  <svg
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={`select-none drop-shadow-md ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Sovereign Navy to Deep Royal Gradient */}
      <linearGradient id="bmgNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#002244" />
        <stop offset="50%" stopColor="#001833" />
        <stop offset="100%" stopColor="#000d1a" />
      </linearGradient>

      {/* Gold Medallion Gradient */}
      <linearGradient id="bmgGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="30%" stopColor="#EAB308" />
        <stop offset="70%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>

      {/* Inner Glow */}
      <linearGradient id="bmgInnerShine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Tricolor Ring Arc */}
      <linearGradient id="tricolorSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF9933" />
        <stop offset="100%" stopColor="#FF7700" />
      </linearGradient>
      <linearGradient id="tricolorGreen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#138808" />
        <stop offset="100%" stopColor="#0E6606" />
      </linearGradient>
    </defs>

    {/* Outer 24-Tooth Industrial Harmonization Cog / Sunburst Rim */}
    <g transform="translate(60,60)">
      {Array.from({ length: 24 }).map((_, i) => (
        <rect
          key={i}
          x="-2"
          y="-58"
          width="4"
          height="6"
          rx="1"
          fill="url(#bmgGoldGrad)"
          transform={`rotate(${i * 15})`}
        />
      ))}
    </g>

    {/* Outer Gold Ring */}
    <circle cx="60" cy="60" r="54" fill="url(#bmgGoldGrad)" />
    {/* Navy Shield Base */}
    <circle cx="60" cy="60" r="50.5" fill="url(#bmgNavyGrad)" stroke="#EAB308" strokeWidth="1" />

    {/* Tricolor Border Trim (Top Saffron, Bottom Green, Middle White) */}
    <path
      d="M14 60 A46 46 0 0 1 106 60"
      stroke="url(#tricolorSaffron)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M14 60 A46 46 0 0 0 106 60"
      stroke="url(#tricolorGreen)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="14" cy="60" r="2" fill="#FFFFFF" />
    <circle cx="106" cy="60" r="2" fill="#FFFFFF" />

    {/* Inner Fine Gold Beaded Ring */}
    <circle cx="60" cy="60" r="41" fill="none" stroke="#CA8A04" strokeWidth="1" strokeDasharray="2 3" />

    {/* National Grid Lattice: Interconnected Hexagonal Engineering Mesh */}
    <g stroke="url(#bmgGoldGrad)" strokeWidth="1.2" opacity="0.85">
      {/* Central Hexagon */}
      <polygon points="60,34 78,44 78,64 60,74 42,64 42,44" fill="#001833" fillOpacity="0.7" />
      {/* Connected Nodes */}
      <line x1="60" y1="34" x2="60" y2="24" />
      <line x1="78" y1="44" x2="88" y2="38" />
      <line x1="78" y1="64" x2="88" y2="70" />
      <line x1="60" y1="74" x2="60" y2="84" />
      <line x1="42" y1="64" x2="32" y2="70" />
      <line x1="42" y1="44" x2="32" y2="38" />
      {/* Node Dots */}
      <circle cx="60" cy="24" r="2" fill="#FF9933" />
      <circle cx="88" cy="38" r="2" fill="#EAB308" />
      <circle cx="88" cy="70" r="2" fill="#EAB308" />
      <circle cx="60" cy="84" r="2" fill="#138808" />
      <circle cx="32" cy="70" r="2" fill="#EAB308" />
      <circle cx="32" cy="38" r="2" fill="#EAB308" />
    </g>

    {/* Central Core: Ashoka Chakra with 24 Spokes in Royal Gold */}
    <circle cx="60" cy="54" r="13" fill="#002244" stroke="url(#bmgGoldGrad)" strokeWidth="1.8" />
    <circle cx="60" cy="54" r="3" fill="url(#bmgGoldGrad)" />
    <g transform="translate(60,54)">
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="-12"
          y1="0"
          x2="12"
          y2="0"
          stroke="#EAB308"
          strokeWidth="0.9"
          transform={`rotate(${i * 15})`}
        />
      ))}
    </g>

    {/* Devanagari Banner at Bottom */}
    <rect x="30" y="88" width="60" height="13" rx="3" fill="url(#bmgGoldGrad)" />
    <text
      x="60"
      y="97.5"
      textAnchor="middle"
      fontSize="7"
      fontWeight="900"
      fill="#001730"
      fontFamily="'Plus Jakarta Sans', sans-serif"
      letterSpacing="0.6"
    >
      भारत ग्रिड
    </text>

    {/* Subtle Glass Arc Sheen */}
    <path
      d="M20 50 C20 30 40 18 60 18 C80 18 100 30 100 50 Z"
      fill="url(#bmgInnerShine)"
    />
  </svg>
);

/**
 * Bharat Material Grid (BMG) Main Portal Logo & Branding Lockup
 */
export const BMGPortalLogo: React.FC<{ size?: number; showText?: boolean; dark?: boolean }> = ({
  size = 46,
  showText = true,
  dark = false
}) => (
  <div className="flex items-center gap-3 select-none group cursor-pointer">
    <div className="relative transform group-hover:scale-105 transition-transform duration-200">
      <AshokaEmblem size={size} color={dark ? '#ffffff' : '#002244'} goldTone={!dark} />
    </div>

    {showText && (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-base sm:text-lg font-black tracking-tight font-display ${dark ? 'text-white' : 'text-[#002244]'}`}>
            भारत मटेरियल ग्रिड
          </span>
          <span className="bg-amber-500/10 text-amber-900 border border-amber-400/80 text-[10px] font-black px-1.5 py-0.5 rounded-sm font-mono tracking-wider">
            BHARAT MATERIAL GRID
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-600">
            राष्ट्रीय सीपीएसई सामग्री मानकीकरण एवं समन्वय पोर्टल
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1 rounded border border-emerald-200">
            GOV.IN
          </span>
        </div>
      </div>
    )}
  </div>
);

/**
 * Authentic CPSE Brand Logos with official color palettes
 */
export const CPSEBrandBadge: React.FC<{
  code: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}> = ({ code, size = 'md', showName = false }) => {
  const configs: Record<
    string,
    { bg: string; border: string; text: string; label: string; accent: string; fullName: string }
  > = {
    IOCL: {
      bg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      border: 'border-amber-400',
      text: 'text-white',
      accent: 'bg-blue-900',
      label: 'IndianOil',
      fullName: 'Indian Oil Corporation'
    },
    ONGC: {
      bg: 'bg-gradient-to-br from-red-600 to-red-700',
      border: 'border-red-400',
      text: 'text-white',
      accent: 'bg-yellow-400',
      label: 'ONGC',
      fullName: 'Oil & Natural Gas Corp'
    },
    BPCL: {
      bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
      border: 'border-blue-400',
      text: 'text-white',
      accent: 'bg-yellow-400',
      label: 'BPCL',
      fullName: 'Bharat Petroleum'
    },
    HPCL: {
      bg: 'bg-gradient-to-br from-rose-700 to-rose-800',
      border: 'border-rose-400',
      text: 'text-white',
      accent: 'bg-blue-900',
      label: 'HPCL',
      fullName: 'Hindustan Petroleum'
    },
    GAIL: {
      bg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
      border: 'border-emerald-400',
      text: 'text-white',
      accent: 'bg-amber-400',
      label: 'GAIL',
      fullName: 'GAIL (India) Limited'
    },
    NTPC: {
      bg: 'bg-gradient-to-br from-cyan-600 to-cyan-700',
      border: 'border-cyan-400',
      text: 'text-white',
      accent: 'bg-blue-900',
      label: 'NTPC',
      fullName: 'National Thermal Power'
    },
    SAIL: {
      bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
      border: 'border-blue-400',
      text: 'text-white',
      accent: 'bg-red-500',
      label: 'SAIL',
      fullName: 'Steel Authority of India'
    },
    BHEL: {
      bg: 'bg-gradient-to-br from-indigo-700 to-indigo-800',
      border: 'border-indigo-400',
      text: 'text-white',
      accent: 'bg-cyan-400',
      label: 'BHEL',
      fullName: 'Bharat Heavy Electricals'
    },
    CIL: {
      bg: 'bg-gradient-to-br from-amber-700 to-amber-800',
      border: 'border-amber-500',
      text: 'text-white',
      accent: 'bg-slate-900',
      label: 'Coal India',
      fullName: 'Coal India Limited'
    },
    NMDC: {
      bg: 'bg-gradient-to-br from-teal-700 to-teal-800',
      border: 'border-teal-400',
      text: 'text-white',
      accent: 'bg-amber-400',
      label: 'NMDC',
      fullName: 'National Mineral Dev Corp'
    }
  };

  const cfg = configs[code.toUpperCase()] || {
    bg: 'bg-slate-700',
    border: 'border-slate-500',
    text: 'text-white',
    accent: 'bg-amber-400',
    label: code,
    fullName: code
  };

  const sizeClasses = {
    sm: 'h-6 px-2 text-[10px]',
    md: 'h-8 px-2.5 text-xs',
    lg: 'h-10 px-3.5 text-sm'
  };

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <div
        className={`${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses[size]} border rounded-lg font-bold font-mono shadow-xs flex items-center gap-1.5`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.accent}`} />
        <span>{cfg.label}</span>
      </div>
      {showName && (
        <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
          {cfg.fullName}
        </span>
      )}
    </div>
  );
};
