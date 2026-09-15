import { useEffect, useRef } from 'react';
import { assets } from '../../data/assets';
import { useActivityState, useApp } from '../../hooks/AppContext';
import { Btn } from '../../components/Badges';
import { MissionComplete } from '../../components/MissionComplete';
import { Photo } from '../../components/Photo';

export function Screen13() {
  const { sound, markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({
    q: 0,
    shown: false,
    selected: null as string | null,
    checked: false,
    revealed: false,
  });

  const questions = [
    {
      prompt: 'AI learns from:',
      choices: [
        { id: '1', label: '1. Data' },
        { id: '2', label: '2. Sandwiches' },
        { id: '3', label: '3. Batteries' },
      ],
      correct: '1',
      answer: 'Data',
    },
    {
      prompt: 'Which is better training data?',
      visual: true,
      choices: [
        { id: '1', label: '1. Clear dog labelled DOG' },
        { id: '2', label: '2. Blurry dog labelled CAT' },
      ],
      correct: '1',
      answer: 'The clear, correctly labelled dog',
    },
    {
      prompt: 'AI finds ______ in data.',
      choices: [
        { id: '1', label: '1. sandwiches' },
        { id: '2', label: '2. patterns' },
        { id: '3', label: '3. batteries' },
      ],
      correct: '2',
      answer: 'patterns',
    },
  ];
  const current = questions[state.q]!;

  return (
    <div className="screen-body">
      <h2 className="screen-title">✏️ MY AI TRAINER CHALLENGE</h2>
      {!state.shown ? (
        <div className="card center prompt-card">
          Question {state.q + 1} of 3 is ready.
          <div style={{ marginTop: 16 }}>
            <Btn variant="primary" large onClick={() => setState({ ...state, shown: true })}>
              SHOW QUESTION
            </Btn>
          </div>
        </div>
      ) : (
        <>
          <p className="screen-sub">{current.prompt}</p>
          {current.visual ? (
            <div className="compare" style={{ maxWidth: 900, margin: '0 auto 12px' }}>
              <div className="card good">
                <div className="photo-frame photo-md"><Photo asset={assets.dogClear2} /></div>
                <p>DOG</p>
              </div>
              <div className="card bad">
                <div className="photo-frame photo-md"><Photo asset={assets.dogClear} blur /></div>
                <p>CAT</p>
              </div>
            </div>
          ) : null}
          <div className="grid-3">
            {current.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={`choice ${state.selected === choice.id ? 'selected' : ''} ${
                  state.checked && choice.id === current.correct ? 'correct' : ''
                }`}
                onClick={() => setState({ ...state, selected: choice.id, checked: false })}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <div className="ctrl-group" style={{ justifyContent: 'center' }}>
            <Btn
              variant="primary"
              disabled={!state.selected}
              onClick={() => {
                setState({ ...state, checked: true });
                sound(state.selected === current.correct ? 'correct' : 'tryagain');
              }}
            >
              CHECK
            </Btn>
            <Btn onClick={() => setState({ ...state, revealed: true })}>SHOW ANSWER</Btn>
            <Btn
              onClick={() => {
                if (state.q >= 2) {
                  markActivityComplete(screen.id);
                  return;
                }
                setState({ q: state.q + 1, shown: false, selected: null, checked: false, revealed: false });
              }}
            >
              NEXT
            </Btn>
          </div>
          <p className="feedback">
            {state.revealed ? `Answer: ${current.answer}` : state.checked && state.selected === current.correct ? '✅ Correct!' : state.checked ? '🤔 Try again' : ''}
          </p>
        </>
      )}
    </div>
  );
}

export function Screen14() {
  const { sound, markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({ selected: null as string | null, checked: false });
  const orangeCats = [assets.catClear3, assets.catOrange, assets.catGingerSleep];

  return (
    <div className="screen-body">
      <h2 className="screen-title">BONUS AI TRAINER CHALLENGE</h2>
      <div className="bonus-cats">
        {orangeCats.map((asset) => (
          <div className="photo-frame" key={asset.src}>
            <Photo asset={asset} />
          </div>
        ))}
      </div>
      <p className="screen-sub">Pixel learns only from these orange cats. What might happen when Pixel sees a cat that looks different?</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="photo-frame bonus-other">
          <Photo asset={assets.catClear1} />
        </div>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        <button
          type="button"
          className={`choice ${state.selected === 'a' ? 'selected' : ''} ${state.checked && state.selected === 'a' ? 'wrong' : ''}`}
          onClick={() => setState({ selected: 'a', checked: false })}
        >
          A. Pixel will know straight away.
        </button>
        <button
          type="button"
          className={`choice ${state.selected === 'b' ? 'selected' : ''} ${state.checked && state.selected === 'b' ? 'correct' : ''}`}
          onClick={() => setState({ selected: 'b', checked: false })}
        >
          B. Pixel might get confused. It needs more different examples.
        </button>
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center' }}>
        <Btn
          variant="primary"
          disabled={!state.selected}
          onClick={() => {
            setState({ ...state, checked: true });
            const ok = state.selected === 'b';
            sound(ok ? 'correct' : 'tryagain');
            if (ok) markActivityComplete(screen.id);
          }}
        >
          CHECK
        </Btn>
      </div>
      <p className="feedback">
        {state.checked && state.selected === 'b'
          ? 'Better training data includes enough useful and different examples.'
          : state.checked
            ? 'Try again'
            : ''}
      </p>
    </div>
  );
}

export function Screen15() {
  const { markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({
    q: 0,
    revealed: false,
    feeling: null as string | null,
  });
  const questions = [
    { ask: 'How does AI learn?', answer: 'From data/examples and patterns.' },
    { ask: 'Why is good data important?', answer: 'It helps AI learn better and more correctly.' },
    { ask: 'What can bad data do?', answer: 'It can confuse AI.' },
  ];

  if (state.q < 3) {
    const current = questions[state.q]!;
    return (
      <div className="screen-body">
        <h2 className="screen-title">🎟 BEFORE YOU LEAVE THE AI LAB...</h2>
        <div className="card center" style={{ padding: 36 }}>
          <p className="screen-sub">Question {state.q + 1} of 3</p>
          <p className="screen-sub">{current.ask}</p>
          <p className="feedback" style={{ minHeight: 60 }}>
            {state.revealed ? current.answer : ''}
          </p>
          <div className="ctrl-group" style={{ justifyContent: 'center' }}>
            <Btn variant="yellow" onClick={() => setState({ ...state, revealed: true })}>SHOW ANSWER</Btn>
            <Btn
              variant="primary"
              onClick={() => setState({ q: state.q + 1, revealed: false, feeling: state.feeling })}
            >
              NEXT
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-body">
      <h2 className="screen-title">HOW DO YOU FEEL?</h2>
      <div className="grid-3">
        {[
          { id: 'can', emoji: '😄', label: 'I CAN TEACH PIXEL!' },
          { id: 'almost', emoji: '🙂', label: "I'M ALMOST THERE!" },
          { id: 'need', emoji: '🤔', label: 'I NEED ANOTHER EXAMPLE.' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={`card feel-card center ${state.feeling === item.id ? 'selected' : ''}`}
            onClick={() => {
              setState({ ...state, feeling: item.id });
              markActivityComplete(screen.id);
            }}
          >
            <div className="feel-emoji">{item.emoji}</div>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Screen16() {
  const { goHome, resetLesson, setLesson1Complete, sound, state } = useApp();
  const [local, setLocal] = useActivityState({ celebrated: false });
  const celebratedRef = useRef(false);

  useEffect(() => {
    setLesson1Complete();
    if (celebratedRef.current) return;
    celebratedRef.current = true;
    setLocal({ celebrated: true });
    sound('complete');
  }, [setLesson1Complete, setLocal, sound]);

  return (
    <MissionComplete
      title="🏆 MISSION 1 COMPLETE!"
      speech="I learned how to learn because of you!"
      recap={[
        { title: '📚 DATA', text: 'Information and examples' },
        { title: '🔍 PATTERNS', text: 'Things examples have in common' },
        { title: '👍 GOOD DATA', text: 'Helps AI learn' },
        { title: '👎 BAD DATA', text: 'Can confuse AI' },
      ]}
      badgeTitle="⭐ AI TRAINER BADGE #1"
      badgeName="DATA DETECTIVE"
      progress={[
        { label: 'Lesson 1', locked: false },
        { label: 'Lesson 2', locked: true },
        { label: 'Lesson 3', locked: true },
        { label: 'Lesson 4', locked: true },
        { label: 'Lesson 5', locked: true },
      ]}
      preview="NEXT MISSION: 🗣 CLEAR INSTRUCTIONS MATTER"
      onHome={goHome}
      onReplay={resetLesson}
      celebrate={local.celebrated || state.lesson1Complete}
    />
  );
}
