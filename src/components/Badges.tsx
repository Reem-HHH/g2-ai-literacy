import type { ButtonHTMLAttributes } from 'react';
import { formatObjective } from '../utils/format';
import type { LearningObjective } from '../lessons/types';

export function ObjectiveBadge({ objectives }: { objectives: LearningObjective[] }) {
  if (objectives.length === 0) return null;
  return <span className="badge">{formatObjective(objectives)}</span>;
}

export function StrategyBadge({ strategies }: { strategies: string[] }) {
  return (
    <>
      {strategies.map((strategy) => (
        <span className="badge" key={strategy}>
          {strategy}
        </span>
      ))}
    </>
  );
}

export function ActivityBadge({ children }: { children: string }) {
  return <span className="badge">{children}</span>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'good' | 'bad' | 'yellow' | 'mint' | 'pink' | 'default';
  large?: boolean;
};

export function Btn({ variant = 'default', large, className = '', ...props }: BtnProps) {
  const variantClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'good'
        ? 'btn-good'
        : variant === 'bad'
          ? 'btn-bad'
          : variant === 'yellow'
            ? 'btn-yellow'
            : variant === 'mint'
              ? 'btn-mint'
              : variant === 'pink'
                ? 'btn-pink'
                : '';
  return (
    <button
      type="button"
      className={`btn ${variantClass} ${large ? 'btn-large' : ''} ${className}`.trim()}
      {...props}
    />
  );
}
