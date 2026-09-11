type Props = {
  word: string;
  icon: string;
  definition: string;
  flipped: boolean;
  onFlip: () => void;
  color: string;
};

export function VocabularyCard({ word, icon, definition, flipped, onFlip, color }: Props) {
  return (
    <button
      type="button"
      className="vocab-card"
      onClick={onFlip}
      style={{ background: color }}
      aria-expanded={flipped}
    >
      <div className="word">{icon} {word}</div>
      {flipped ? <div className="def">{definition}</div> : <div className="def">Tap to reveal</div>}
    </button>
  );
}
