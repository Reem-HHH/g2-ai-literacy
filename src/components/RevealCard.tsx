import { Btn } from './Badges';

type Props = {
  hiddenLabel?: string;
  revealed: boolean;
  onReveal: () => void;
  children: string;
};

export function RevealCard({ hiddenLabel = 'Answer hidden', revealed, onReveal, children }: Props) {
  return (
    <div className="card center">
      <p className="screen-sub">{revealed ? children : hiddenLabel}</p>
      {!revealed ? (
        <Btn variant="primary" onClick={onReveal}>REVEAL</Btn>
      ) : null}
    </div>
  );
}
