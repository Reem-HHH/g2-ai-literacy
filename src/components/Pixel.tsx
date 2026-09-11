type PixelMood = 'curious' | 'confused' | 'happy' | 'celebrate' | 'think' | 'wave';

type Props = {
  mood?: PixelMood;
  size?: number;
  className?: string;
};

export function Pixel({ mood = 'curious', size = 240, className }: Props) {
  const mouth =
    mood === 'confused'
      ? 'M 78 118 Q 100 110 122 118'
      : mood === 'think'
        ? 'M 84 118 H 116'
        : mood === 'celebrate' || mood === 'happy'
          ? 'M 76 112 Q 100 132 124 112'
          : 'M 80 116 Q 100 128 120 116';

  const armL =
    mood === 'wave' || mood === 'celebrate'
      ? 'M 48 150 Q 18 118 32 96'
      : 'M 48 155 Q 22 175 38 188';
  const armR =
    mood === 'celebrate'
      ? 'M 152 150 Q 182 118 168 96'
      : 'M 152 155 Q 178 175 162 188';

  const brow =
    mood === 'confused' ? -8 : mood === 'think' ? 4 : 0;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 220"
      role="img"
      aria-label={`Pixel the robot looking ${mood}`}
    >
      <ellipse cx="100" cy="208" rx="48" ry="8" fill="rgba(27,42,74,0.12)" />
      <rect x="62" y="142" width="76" height="58" rx="22" fill="#60a5fa" stroke="#1e3a5f" strokeWidth="3" />
      <rect x="70" y="150" width="60" height="42" rx="16" fill="#dbeafe" />
      <circle cx="84" cy="172" r="6" fill="#f9a8d4" />
      <circle cx="116" cy="172" r="6" fill="#f9a8d4" />
      <path d={armL} fill="none" stroke="#60a5fa" strokeWidth="10" strokeLinecap="round" />
      <path d={armR} fill="none" stroke="#60a5fa" strokeWidth="10" strokeLinecap="round" />
      <circle cx="100" cy="96" r="58" fill="#38bdf8" stroke="#1e3a5f" strokeWidth="4" />
      <circle cx="100" cy="96" r="50" fill="#e0f2fe" />
      <rect x="96" y="28" width="8" height="18" rx="4" fill="#93c5fd" />
      <circle cx="100" cy="22" r="10" fill={mood === 'celebrate' ? '#fde68a' : '#c4b5fd'} />
      <path d={`M 70 ${70 + brow} Q 80 64 90 ${70 + brow}`} fill="none" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <path d={`M 110 ${70 + brow} Q 120 64 130 ${70 + brow}`} fill="none" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="80" cy="92" r="11" fill="white" />
      <circle cx="120" cy="92" r="11" fill="white" />
      <circle cx="82" cy="94" r="6" fill="#1e3a5f" />
      <circle cx="122" cy="94" r="6" fill="#1e3a5f" />
      <circle cx="80" cy="91" r="2" fill="white" />
      <circle cx="120" cy="91" r="2" fill="white" />
      <circle cx="72" cy="108" r="7" fill="#f9a8d4" opacity="0.85" />
      <circle cx="128" cy="108" r="7" fill="#f9a8d4" opacity="0.85" />
      <path d={mouth} fill="none" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
