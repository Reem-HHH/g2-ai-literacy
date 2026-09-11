import { useApp } from '../hooks/AppContext';

const COLORS = ['#f9a8d4', '#fde68a', '#86efac', '#93c5fd', '#c4b5fd', '#fb7185'];

export function ConfettiBurst({ fire }: { fire: boolean }) {
  const { reducedMotion } = useApp();
  if (!fire || reducedMotion) return null;

  return (
    <>
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="confetti-dot"
          style={{
            left: `${10 + (i * 5) % 80}%`,
            top: `${30 + (i % 5) * 8}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${i * 30}ms`,
          }}
        />
      ))}
    </>
  );
}
