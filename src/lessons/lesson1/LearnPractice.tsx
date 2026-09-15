import { assets } from '../../data/assets';
import { useActivityState, useApp } from '../../hooks/AppContext';
import { Btn } from '../../components/Badges';
import { Photo } from '../../components/Photo';
import { Pixel } from '../../components/Pixel';
import { RevealCard } from '../../components/RevealCard';
import { VocabularyCard } from '../../components/VocabularyCard';

export const birdPhotos = [
  { key: 'robin', asset: assets.birdRobin, label: 'Robin' },
  { key: 'parrot', asset: assets.birdParrot, label: 'Parrot' },
  { key: 'kingfisher', asset: assets.birdKingfisher, label: 'Kingfisher' },
  { key: 'eagle', asset: assets.birdEagle, label: 'Eagle' },
];

const VOCAB = [
  { word: 'AI', icon: '🤖', def: 'A computer or machine that can learn using information.', color: '#dbeafe' },
  { word: 'DATA', icon: '📚', def: 'Information AI uses to learn. Pictures, words, and sounds can be data.', color: '#fde68a' },
  { word: 'EXAMPLE', icon: '🧩', def: 'One sample that helps AI learn. Data is made of examples.', color: '#e9d5ff' },
  { word: 'PATTERN', icon: '🔍', def: 'Something that is the same in many examples.', color: '#bbf7d0' },
];

export function Screen05() {
  const { sound } = useApp();
  const [state, setState] = useActivityState({ step: 0, oral: false });

  const steps = [
    { title: 'DATA', text: 'Lots of examples' },
    { title: 'PATTERNS', text: 'What is the same?' },
    { title: 'AI LEARNS', text: 'It can recognise something new' },
  ];

  return (
    <div className="screen-body">
      <h2 className="screen-title">🧠 HOW DOES AI LEARN?</h2>
      <div className="steps">
        {steps.map((step, idx) => (
          <div key={step.title} className="card step-card show">
            {state.step > idx ? (
              <>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </>
            ) : (
              <strong>?</strong>
            )}
          </div>
        ))}
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 12 }}>
        <Btn
          variant="primary"
          onClick={() => {
            setState({ ...state, step: Math.min(3, state.step + 1) });
            sound('whoosh');
          }}
          disabled={state.step >= 3}
        >
          NEXT IDEA
        </Btn>
      </div>
      {state.step >= 3 ? (
        <>
          <p className="screen-sub">What do we call the information AI learns from?</p>
          <RevealCard
            revealed={state.oral}
            onReveal={() => setState({ ...state, oral: true })}
          >
            DATA
          </RevealCard>
        </>
      ) : null}
    </div>
  );
}

export function Screen06() {
  const { sound, markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({
    flipped: [] as string[],
    answer: null as string | null,
    checked: false,
  });

  return (
    <div className="screen-body">
      <h2 className="screen-title">🧪 AI WORD LAB</h2>
      <div className="vocab-grid">
        {VOCAB.map((item) => (
          <VocabularyCard
            key={item.word}
            word={item.word}
            icon={item.icon}
            definition={item.def}
            color={item.color}
            flipped={state.flipped.includes(item.word)}
            onFlip={() => {
              const flipped = state.flipped.includes(item.word)
                ? state.flipped
                : [...state.flipped, item.word];
              setState({ ...state, flipped });
            }}
          />
        ))}
      </div>
      <p className="screen-sub" style={{ marginTop: 10 }}>Can a picture be data?</p>
      <div className="ctrl-group" style={{ justifyContent: 'center' }}>
        <Btn
          variant={state.answer === 'yes' ? 'good' : 'default'}
          large
          onClick={() => setState({ ...state, answer: 'yes', checked: false })}
        >
          YES
        </Btn>
        <Btn
          variant={state.answer === 'no' ? 'bad' : 'default'}
          large
          onClick={() => setState({ ...state, answer: 'no', checked: false })}
        >
          NO
        </Btn>
        <Btn
          variant="primary"
          onClick={() => {
            setState({ ...state, checked: true });
            const ok = state.answer === 'yes';
            sound(ok ? 'correct' : 'tryagain');
            if (ok) markActivityComplete(screen.id);
          }}
          disabled={!state.answer}
        >
          CHECK
        </Btn>
      </div>
      <p className="feedback">
        {state.checked ? (state.answer === 'yes' ? '✅ Yes! A picture can be data.' : '🤔 Try again') : ''}
      </p>
    </div>
  );
}

function BirdStrip() {
  return (
    <div className="bird-grid">
      {birdPhotos.map((bird) => (
        <div className="photo-frame" key={bird.key}>
          <Photo asset={bird.asset} />
        </div>
      ))}
    </div>
  );
}

export function Screen07() {
  const { startActivityTimer } = useApp();
  const [state, setState] = useActivityState({ started: false });

  return (
    <div className="screen-body">
      <h2 className="screen-title">🔎 AI DETECTIVE: FIND THE PATTERN!</h2>
      <BirdStrip />
      <p className="screen-sub">Find TWO things most of these birds have in common.</p>
      <div className="tps">
        <div className="card">LOOK</div>
        <div className="card">TALK</div>
        <div className="card">AGREE</div>
      </div>
      <p className="screen-sub">1. Study the pictures.  2. Talk with your group.  3. Agree on two useful patterns.</p>
      <div className="ctrl-group" style={{ justifyContent: 'center' }}>
        <Btn
          variant="primary"
          onClick={() => {
            setState({ started: true });
            startActivityTimer(90_000);
          }}
        >
          START 90-SECOND TIMER
        </Btn>
        {state.started ? <span className="badge">Timer running in the footer</span> : null}
      </div>
    </div>
  );
}

export function Screen08() {
  const { sound, markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({
    revealed: 0,
    choice: null as string | null,
    checked: false,
  });
  const patterns = ['Wings', 'Beak', 'Feathers', 'Two legs'];

  return (
    <div className="screen-body">
      <h2 className="screen-title">🔍 WHAT PATTERNS DID WE FIND?</h2>
      <BirdStrip />
      <div className="grid-4" style={{ marginTop: 8 }}>
        {patterns.map((pattern, idx) => (
          <div key={pattern} className="card center" style={{ fontSize: 28, minHeight: 72, opacity: idx < state.revealed ? 1 : 0.25 }}>
            {idx < state.revealed ? pattern : '???'}
          </div>
        ))}
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 8 }}>
        <Btn
          variant="primary"
          onClick={() => setState({ ...state, revealed: Math.min(4, state.revealed + 1) })}
          disabled={state.revealed >= 4}
        >
          REVEAL ONE PATTERN
        </Btn>
      </div>
      <p className="screen-sub">“All birds are green.”  Is this a useful pattern?</p>
      <div className="ctrl-group" style={{ justifyContent: 'center' }}>
        <Btn large variant={state.choice === 'yes' ? 'good' : 'default'} onClick={() => setState({ ...state, choice: 'yes', checked: false })}>YES</Btn>
        <Btn large variant={state.choice === 'no' ? 'bad' : 'default'} onClick={() => setState({ ...state, choice: 'no', checked: false })}>NO</Btn>
        <Btn
          variant="primary"
          disabled={!state.choice}
          onClick={() => {
            setState({ ...state, checked: true });
            const ok = state.choice === 'no';
            sound(ok ? 'correct' : 'tryagain');
            if (ok) markActivityComplete(screen.id);
          }}
        >
          CHECK
        </Btn>
      </div>
      <p className="feedback">
        {state.checked && state.choice === 'no'
          ? 'Our examples have different colours. A useful pattern should work for many examples.'
          : state.checked
            ? '🤔 Try again'
            : ''}
      </p>
    </div>
  );
}

export function Screen09() {
  const { sound } = useApp();
  const [state, setState] = useActivityState({ q: 0, revealed: false });
  const questions = [
    { ask: 'What was our DATA?', answer: 'THE BIRD PICTURES' },
    { ask: 'What did we FIND?', answer: 'PATTERNS' },
  ];
  const current = questions[Math.min(state.q, 1)]!;

  return (
    <div className="screen-body">
      <h2 className="screen-title">🤖 YOU JUST THOUGHT LIKE AI!</h2>
      <div className="mission-layout">
        <Pixel mood="happy" size={220} />
        <div>
          <div className="flow">
            <div className="node">REAL BIRD PHOTOS</div>
            <span aria-hidden="true">→</span>
            <div className="node">LOOK FOR SIMILARITIES</div>
            <span aria-hidden="true">→</span>
            <div className="node">FIND PATTERNS</div>
            <span aria-hidden="true">→</span>
            <div className="node">RECOGNISE A BIRD</div>
          </div>
          {state.q < 2 ? (
            <div style={{ marginTop: 18 }}>
              <p className="screen-sub">{current.ask}</p>
              <RevealCard
                revealed={state.revealed}
                onReveal={() => {
                  setState({ ...state, revealed: true });
                  sound('whoosh');
                }}
              >
                {current.answer}
              </RevealCard>
              {state.revealed ? (
                <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 10 }}>
                  <Btn
                    variant="primary"
                    onClick={() => setState({ q: state.q + 1, revealed: false })}
                  >
                    NEXT QUESTION
                  </Btn>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid-2" style={{ marginTop: 18 }}>
              <div className="card center" style={{ fontSize: 32 }}>
                AI learns from ______.
                <div style={{ marginTop: 10 }}><strong>DATA</strong></div>
              </div>
              <div className="card center" style={{ fontSize: 32 }}>
                AI looks for ______.
                <div style={{ marginTop: 10 }}><strong>PATTERNS</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
