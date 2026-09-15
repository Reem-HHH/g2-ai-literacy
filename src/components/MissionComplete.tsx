import type { ReactNode } from 'react';
import { Btn } from './Badges';
import { ConfettiBurst } from './ConfettiBurst';
import { Pixel } from './Pixel';

type Props = {
  title: string;
  speech: string;
  recap: { title: string; text: string }[];
  badgeTitle: string;
  badgeName: string;
  progress: { label: string; locked: boolean }[];
  preview: string;
  onHome: () => void;
  onReplay: () => void;
  celebrate: boolean;
  extra?: ReactNode;
};

export function MissionComplete({
  title,
  speech,
  recap,
  badgeTitle,
  badgeName,
  progress,
  preview,
  onHome,
  onReplay,
  celebrate,
}: Props) {
  return (
    <div className="screen-body">
      <h2 className="screen-title">{title}</h2>
      <div className="mission-layout">
        <div className="pixel-wrap">
          <Pixel mood="celebrate" size={240} />
        </div>
        <div>
          <div className="speech">{speech}</div>
          <div className="grid-4" style={{ marginTop: 16 }}>
            {recap.map((card) => (
              <div className="card center" key={card.title}>
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
          <div className="card center badge-card">
            {badgeTitle}<br />{badgeName}
          </div>
        </div>
      </div>
      <p className="screen-sub" style={{ marginTop: 8 }}>UNIT PROGRESS</p>
      <div className="lock-row">
        {progress.map((item) => (
          <div className="card lock-card" key={item.label}>{item.label} {item.locked ? '🔒' : '✅'}</div>
        ))}
      </div>
      <p className="screen-sub">{preview}</p>
      <div className="ctrl-group" style={{ justifyContent: 'center' }}>
        <Btn variant="primary" large onClick={onHome}>RETURN HOME</Btn>
        <Btn large onClick={onReplay}>REPLAY LESSON 1</Btn>
      </div>
      <ConfettiBurst fire={celebrate} />
    </div>
  );
}
