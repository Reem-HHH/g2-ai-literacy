import { Btn } from './Badges';

type Choice = { id: string; label: string };

type Props = {
  question: string;
  choices: Choice[];
  selected: string | null;
  onSelect: (id: string) => void;
  checked: boolean;
  correctId: string;
  explanation?: string;
  onCheck: () => void;
  onTryAgain?: () => void;
};

export function MultipleChoice({
  question,
  choices,
  selected,
  onSelect,
  checked,
  correctId,
  explanation,
  onCheck,
  onTryAgain,
}: Props) {
  return (
    <div>
      <p className="screen-sub" style={{ marginBottom: 14 }}>{question}</p>
      <div className="grid-1" style={{ display: 'grid', gap: 10 }}>
        {choices.map((choice) => {
          let cls = 'choice';
          if (selected === choice.id) cls += ' selected';
          if (checked && choice.id === correctId) cls += ' correct';
          if (checked && selected === choice.id && choice.id !== correctId) cls += ' wrong';
          return (
            <button
              key={choice.id}
              type="button"
              className={cls}
              onClick={() => onSelect(choice.id)}
              aria-pressed={selected === choice.id}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 14 }}>
        <Btn variant="primary" onClick={onCheck} disabled={!selected || checked}>
          CHECK
        </Btn>
        {checked && selected !== correctId && onTryAgain ? (
          <Btn variant="yellow" onClick={onTryAgain}>TRY AGAIN</Btn>
        ) : null}
      </div>
      {checked && explanation ? <p className="feedback">{explanation}</p> : <p className="feedback hidden-answer" />}
    </div>
  );
}
