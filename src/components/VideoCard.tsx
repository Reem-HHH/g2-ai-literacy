import { useState } from 'react';
import { Btn } from './Badges';

type Props = {
  title: string;
  youtubeId: string;
  onFinished: () => void;
  onSkip: () => void;
};

export function VideoCard({ title, youtubeId, onFinished, onSkip }: Props) {
  const [showEmbed, setShowEmbed] = useState(true);
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <div className="card" style={{ padding: 16 }}>
      <p className="screen-sub" style={{ marginBottom: 10 }}>{title}</p>
      {showEmbed ? (
        <iframe
          className="video-frame"
          title={title}
          src={src}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setShowEmbed(false)}
        />
      ) : (
        <div className="photo-fallback" style={{ height: 280, borderRadius: 20 }}>
          Video could not be embedded here.
        </div>
      )}
      <div className="ctrl-group" style={{ justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
        <a className="btn btn-primary" href={watchUrl} target="_blank" rel="noreferrer">
          ▶ OPEN VIDEO
        </a>
        <Btn onClick={onSkip}>SKIP VIDEO</Btn>
        <Btn variant="mint" onClick={onFinished}>VIDEO FINISHED</Btn>
      </div>
    </div>
  );
}
