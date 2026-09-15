import { assets } from '../../data/assets';
import { useActivityState, useApp } from '../../hooks/AppContext';
import { Btn } from '../../components/Badges';
import { ConfettiBurst } from '../../components/ConfettiBurst';
import { Photo } from '../../components/Photo';
import { Pixel } from '../../components/Pixel';
import { VideoCard } from '../../components/VideoCard';
import { MultipleChoice } from '../../components/MultipleChoice';

export function Screen01() {
  const { goNext, sound } = useApp();
  const [state, setState] = useActivityState({ launched: false });

  return (
    <div className="screen-body">
      <h2 className="screen-title">🤖 TEACH PIXEL HOW TO LEARN!</h2>
      <p className="screen-sub">MISSION 1 OF 5</p>
      <div className="launch-layout">
        <div className="pixel-wrap enter">
          <Pixel mood="curious" size={280} />
        </div>
        <div>
          <div className="speech">
            Hello!<br />I want to become smarter.<br />Can you teach me how to learn?
          </div>
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Btn
              variant="primary"
              large
              onClick={() => {
                setState({ launched: true });
                sound('whoosh');
                window.setTimeout(goNext, 700);
              }}
            >
              🚀 START MISSION
            </Btn>
          </div>
        </div>
      </div>
      <ConfettiBurst fire={state.launched} />
    </div>
  );
}

export function Screen02() {
  return (
    <div className="screen-body">
      <h2 className="screen-title">🎯 TODAY'S MISSION</h2>
      <div className="grid-3" style={{ marginTop: 8 }}>
        <div className="card obj-card center">
          <div className="emoji">🧠</div>
          I can explain how AI learns from examples.
        </div>
        <div className="card obj-card center">
          <div className="emoji">🔍</div>
          I can find a pattern.
        </div>
        <div className="card obj-card center">
          <div className="emoji">👍👎</div>
          I can tell good data from bad data.
        </div>
      </div>
      <p className="screen-sub" style={{ marginTop: 16 }}>HOW WILL I KNOW I SUCCEEDED?</p>
      <div className="success-list">
        <span>⭐ I can tell Pixel what data means.</span>
        <span>⭐ I can find something examples have in common.</span>
        <span>⭐ I can choose examples that help AI learn.</span>
      </div>
    </div>
  );
}

export function Screen03() {
  const { startActivityTimer } = useApp();
  const [state, setState] = useActivityState({ step: 0 as number });

  const examples = [
    { asset: assets.phone, label: 'Phone voice assistant' },
    { asset: assets.robot, label: 'A helper robot' },
    { asset: assets.phones, label: 'A phone seeing a face or object' },
    { asset: assets.chat, label: 'A chatbot you can talk to' },
  ];

  return (
    <div className="screen-body">
      <h2 className="screen-title">💭 WHAT DO YOU ALREADY KNOW ABOUT AI?</h2>
      <div className="grid-4">
        {examples.map((item) => (
          <div className="card example-card" key={item.label}>
            <div className="photo-frame">
              <Photo asset={item.asset} />
            </div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <p className="screen-sub">Where have you seen something smart like this before?</p>
      <div className="tps">
        {['1. THINK  15 seconds', '2. PAIR  Tell your partner.', '3. SHARE  Tell the class.'].map((label, idx) => (
          <div key={label} className={`card ${state.step === idx + 1 ? 'on' : ''}`}>{label}</div>
        ))}
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center' }}>
        <Btn
          variant="primary"
          onClick={() => {
            setState({ step: 1 });
            startActivityTimer(15_000);
          }}
        >
          START TIMER
        </Btn>
        <Btn onClick={() => setState({ step: 2 })}>PAIR</Btn>
        <Btn onClick={() => setState({ step: 3 })}>SHARE</Btn>
      </div>
    </div>
  );
}

export function Screen04() {
  const { sound, markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({
    phase: 'watch' as 'watch' | 'teach' | 'check',
    selected: null as string | null,
    checked: false,
  });

  const beats = [
    { title: 'Lots of examples', text: 'AI looks at many pictures, words, or sounds.' },
    { title: 'Those examples are data', text: 'Data is the information AI uses to learn.' },
    { title: 'AI learns from data', text: 'It finds what the examples have in common.' },
  ];

  return (
    <div className="screen-body">
      <h2 className="screen-title">WATCH LIKE AN AI DETECTIVE</h2>
      {state.phase === 'watch' ? (
        <>
          <p className="screen-sub">Listen for ONE thing: What does AI learn from?</p>
          <VideoCard
            title="Machine Learning for Kids: Pattern Recognition"
            youtubeId="AlYJlq7yKiM"
            onSkip={() => setState({ ...state, phase: 'teach' })}
            onFinished={() => setState({ ...state, phase: 'teach' })}
          />
        </>
      ) : null}
      {state.phase === 'teach' ? (
        <>
          <p className="screen-sub">Here is the idea, even if the video could not play:</p>
          <div className="steps">
            {beats.map((beat) => (
              <div key={beat.title} className="card step-card show">
                <strong>{beat.title}</strong>
                <p>{beat.text}</p>
              </div>
            ))}
          </div>
          <div className="ctrl-group" style={{ justifyContent: 'center' }}>
            <Btn variant="primary" large onClick={() => setState({ ...state, phase: 'check' })}>
              CHECK UNDERSTANDING
            </Btn>
          </div>
        </>
      ) : null}
      {state.phase === 'check' ? (
        <MultipleChoice
          question="AI learns from..."
          choices={[
            { id: 'a', label: 'A. Food' },
            { id: 'b', label: 'B. Examples' },
            { id: 'c', label: 'C. Sleeping' },
          ]}
          selected={state.selected}
          onSelect={(id) => setState({ ...state, selected: id, checked: false })}
          checked={state.checked}
          correctId="b"
          explanation={state.checked ? (state.selected === 'b' ? 'Yes — AI learns from examples!' : 'Try again') : undefined}
          onCheck={() => {
            const ok = state.selected === 'b';
            setState({ ...state, checked: true });
            sound(ok ? 'correct' : 'tryagain');
            if (ok) markActivityComplete(screen.id);
          }}
          onTryAgain={() => setState({ ...state, checked: false, selected: null })}
        />
      ) : null}
    </div>
  );
}
