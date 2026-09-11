import { useState } from 'react';
import type { ImageAsset } from '../data/assets';

type Props = {
  asset: ImageAsset;
  className?: string;
  blur?: boolean;
};

export function Photo({ asset, className = '', blur = false }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`photo-fallback ${className}`} role="img" aria-label={asset.alt}>
        {asset.alt}
      </div>
    );
  }

  return (
    <img
      src={asset.src}
      alt={asset.alt}
      className={`photo ${blur ? 'blur' : ''} ${className}`.trim()}
      onError={() => setFailed(true)}
    />
  );
}
