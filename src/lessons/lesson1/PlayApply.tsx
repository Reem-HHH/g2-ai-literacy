import { assets } from '../../data/assets';
import type { ImageAsset } from '../../data/assets';
import { useActivityState, useApp } from '../../hooks/AppContext';
import { Btn } from '../../components/Badges';
import { Photo } from '../../components/Photo';
import { Pixel } from '../../components/Pixel';
import type { TeamId } from '../types';

export function Screen10() {
  const [state, setState] = useActivityState({ revealed: false });

  return (
    <div className="screen-body">
      <h2 className="screen-title">👍 GOOD DATA OR 👎 BAD DATA?</h2>
      <div className="mission-layout" style={{ gridTemplateColumns: '220px 1fr' }}>
        <div>
          <Pixel mood="confused" size={200} />
          <div className="speech" style={{ fontSize: 24, marginTop: 8 }}>
            Some examples help me... but some examples confuse me!
          </div>
        </div>
        <div className="compare">
          <div className="card good">
            <div className="photo-frame" style={{ height: 240 }}>
              <Photo asset={assets.birdEagle} />
            </div>
            <p style={{ fontSize: 26, margin: '10px 0 0' }}>Label: BIRD</p>
            <p style={{ fontSize: 30, margin: 0 }}>👍 GOOD DATA</p>
            <p>✅ Clear &nbsp; ✅ Correct &nbsp; ✅ Useful</p>
          </div>
          <div className="card bad">
            <div className="photo-frame" style={{ height: 240 }}>
              <Photo asset={assets.birdRobin} blur />
            </div>
            <p style={{ fontSize: 26, margin: '10px 0 0' }}>Label: CAT</p>
            <p style={{ fontSize: 30, margin: 0 }}>👎 BAD DATA</p>
            <p>❌ Unclear &nbsp; ❌ Wrong &nbsp; ❌ Confusing</p>
          </div>
        </div>
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 8 }}>
        <Btn variant="primary" onClick={() => setState({ revealed: true })}>REVEAL</Btn>
      </div>
      <p className="feedback">
        {state.revealed
          ? 'Good data helps AI learn better. Bad data can confuse AI.'
          : ''}
      </p>
    </div>
  );
}

type Round = {
  asset: ImageAsset;
  blur?: boolean;
  label?: string;
  prompt?: string;
  answer: 'good' | 'bad';
  reason: string;
};

const ROUNDS: Round[] = [
  { asset: assets.catClear1, label: 'CAT', answer: 'good', reason: 'Clear + correct' },
  { asset: assets.dogClear, blur: true, label: 'DOG', answer: 'bad', reason: 'Too unclear' },
  { asset: assets.birdEagle, label: 'CAR', answer: 'bad', reason: 'Wrong label' },
  { asset: assets.rabbitClear, label: 'RABBIT', answer: 'good', reason: 'Clear + correct' },
  { asset: assets.trafficLight, prompt: 'Pixel is learning pets.', answer: 'bad', reason: 'Not useful for learning pets' },
  { asset: assets.dogClear2, label: 'DOG', answer: 'good', reason: 'Clear + correct' },
];

export function Screen11() {
  const { sound, bumpScore, markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({
    round: 0,
    vote: null as 'good' | 'bad' | null,
    checked: false,
    score: 0,
    scoredRound: false,
  });
  const round = ROUNDS[state.round]!;
  const correct = state.vote === round.answer;

  return (
    <div className="screen-body">
      <h2 className="screen-title">🎮 DATA DETECTIVE</h2>
      <p className="screen-sub">Can you help Pixel choose good training data?  ⭐ {state.score} / 6</p>
      <div className="card game-photo" style={{ padding: 12 }}>
        <div className="photo-frame" style={{ height: 250 }}>
          <Photo asset={round.asset} blur={round.blur} />
        </div>
        {round.prompt ? <p className="screen-sub">{round.prompt}</p> : null}
        {round.label ? <p className="screen-sub">Label: {round.label}</p> : null}
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 8 }}>
        <Btn large variant={state.vote === 'good' ? 'good' : 'default'} onClick={() => setState({ ...state, vote: 'good', checked: false })}>
          👍 GOOD DATA
        </Btn>
        <Btn large variant={state.vote === 'bad' ? 'bad' : 'default'} onClick={() => setState({ ...state, vote: 'bad', checked: false })}>
          👎 BAD DATA
        </Btn>
        <Btn
          variant="primary"
          disabled={!state.vote}
          onClick={() => {
            const ok = state.vote === round.answer;
            setState({
              ...state,
              checked: true,
              score: ok && !state.scoredRound ? state.score + 1 : state.score,
              scoredRound: state.scoredRound || ok,
            });
            sound(ok ? 'star' : 'tryagain');
            if (ok && state.round === 5) markActivityComplete(screen.id);
          }}
        >
          CHECK
        </Btn>
      </div>
      <p className="feedback">
        {state.checked ? (correct ? `✅ CORRECT! ${round.reason}` : '🤔 TRY AGAIN') : ''}
      </p>
      <div className="ctrl-group" style={{ justifyContent: 'center' }}>
        <Btn
          disabled={!state.checked || !correct || state.round >= 5}
          onClick={() => setState({ round: state.round + 1, vote: null, checked: false, score: state.score, scoredRound: false })}
        >
          NEXT ROUND
        </Btn>
        {state.checked && !correct ? (
          <Btn variant="yellow" onClick={() => setState({ ...state, vote: null, checked: false })}>TRY AGAIN</Btn>
        ) : null}
        <Btn onClick={() => setState({ round: 0, vote: null, checked: false, score: 0, scoredRound: false })}>
          RESET GAME
        </Btn>
        <span className="badge">Optional team point:</span>
        {(['robot', 'star', 'rocket', 'brain'] as TeamId[]).map((team) => (
          <Btn key={team} className="tiny" onClick={() => bumpScore(team, 1)}>+ {team}</Btn>
        ))}
      </div>
    </div>
  );
}

type Zone = 'tray' | 'train' | 'reject';

const TRAIN_CARDS: { id: string; asset: ImageAsset; label: string; blur?: boolean; good: boolean }[] = [
  { id: 'cat1', asset: assets.catClear1, label: 'CAT', good: true },
  { id: 'cat2', asset: assets.catClear2, label: 'CAT', good: true },
  { id: 'cat3', asset: assets.catClear3, label: 'CAT', good: true },
  { id: 'dog', asset: assets.dogClear, label: 'DOG', good: false },
  { id: 'blur', asset: assets.catTabbyKitten, label: 'CAT', blur: true, good: false },
  { id: 'wrong', asset: assets.catOrange, label: 'DOG', good: false },
  { id: 'car', asset: assets.car, label: 'CAR', good: false },
  { id: 'cat4', asset: assets.catCream, label: 'CAT', good: true },
];

const defaultPlacements = (): Record<string, Zone> =>
  Object.fromEntries(TRAIN_CARDS.map((card) => [card.id, 'tray'])) as Record<string, Zone>;

export function Screen12() {
  const { sound, markActivityComplete, screen } = useApp();
  const [state, setState] = useActivityState({
    placements: defaultPlacements(),
    selected: null as string | null,
    result: null as 'great' | 'confused' | 'processing' | null,
  });

  const move = (id: string, zone: Zone) => {
    setState({
      ...state,
      placements: { ...state.placements, [id]: zone },
      selected: null,
      result: null,
    });
  };

  const cardsIn = (zone: Zone) => TRAIN_CARDS.filter((card) => state.placements[card.id] === zone);

  const train = () => {
    const trained = cardsIn('train');
    const hasBad = trained.some((card) => !card.good);
    const goodCount = trained.filter((card) => card.good).length;
    const result = !hasBad && goodCount >= 2 ? 'great' : 'confused';
    setState((prev) => ({ ...prev, result: 'processing' }));
    window.setTimeout(() => {
      setState((prev) => ({ ...prev, result }));
      sound(result === 'great' ? 'complete' : 'tryagain');
      if (result === 'great') markActivityComplete(screen.id);
    }, 700);
  };

  const renderCards = (zone: Zone) =>
    cardsIn(zone).map((card) => (
      <button
        key={card.id}
        type="button"
        className={`drag-card ${state.selected === card.id ? 'selected' : ''}`}
        draggable
        onDragStart={() => setState({ ...state, selected: card.id })}
        onClick={(event) => {
          event.stopPropagation();
          setState({ ...state, selected: state.selected === card.id ? null : card.id });
        }}
      >
        <Photo asset={card.asset} blur={card.blur} />
        <div className="label">{card.label}</div>
      </button>
    ));

  return (
    <div className="screen-body">
      <h2 className="screen-title">🤖 TRAIN PIXEL!</h2>
      <p className="screen-sub">Pixel needs to learn what a CAT looks like. Drag or tap, then tap a zone.</p>
      <div className="grid-2">
        <div
          className={`drop-zone ${state.selected ? 'active' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => state.selected && move(state.selected, 'train')}
          onClick={() => state.selected && move(state.selected, 'train')}
        >
          <strong>✅ USE TO TRAIN PIXEL</strong>
          <div className="tray">{renderCards('train')}</div>
        </div>
        <div
          className={`drop-zone ${state.selected ? 'active' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => state.selected && move(state.selected, 'reject')}
          onClick={() => state.selected && move(state.selected, 'reject')}
        >
          <strong>❌ DO NOT USE</strong>
          <div className="tray">{renderCards('reject')}</div>
        </div>
      </div>
      <div
        className="drop-zone"
        style={{ marginTop: 8, minHeight: 130 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => state.selected && move(state.selected, 'tray')}
        onClick={() => state.selected && move(state.selected, 'tray')}
      >
        <strong>Cards</strong>
        <div className="tray">{renderCards('tray')}</div>
      </div>
      <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 8 }}>
        <Btn variant="primary" large onClick={train}>TRAIN PIXEL</Btn>
      </div>
      <p className="feedback">
        {state.result === 'processing'
          ? '🤖 Processing...'
          : state.result === 'great'
            ? '🎉 GREAT TRAINING DATA!'
            : state.result === 'confused'
              ? '🤖 Pixel is confused! Which example should we change?'
              : ''}
      </p>
    </div>
  );
}
