import type { AppPersistedState, TeamScores } from '../lessons/types';

export const STORAGE_KEY = 'pixel-academy-v1';

export const defaultScores: TeamScores = {
  robot: 0,
  star: 0,
  rocket: 0,
  brain: 0,
};

export function defaultState(): AppPersistedState {
  const now = Date.now();
  return {
    currentLessonId: 'lesson1',
    currentScreenIndex: 0,
    teacherMode: false,
    teacherPanelOpen: false,
    muted: true,
    scoreboardOpen: false,
    teamScores: { ...defaultScores },
    completedActivities: [],
    lessonTimer: {
      elapsedMs: 0,
      running: false,
      updatedAt: now,
    },
    activityTimer: {
      durationMs: 30_000,
      remainingMs: 30_000,
      running: false,
      updatedAt: now,
    },
    activities: {},
    lesson1Complete: false,
  };
}

function reconcileTimer<T extends { running: boolean; updatedAt: number }>(
  timer: T,
  applyElapsed: (t: T, delta: number) => T,
): T {
  if (!timer.running) return timer;
  const delta = Math.max(0, Date.now() - timer.updatedAt);
  return applyElapsed(timer, delta);
}

export function loadState(): AppPersistedState {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<AppPersistedState>;
    const merged: AppPersistedState = {
      ...base,
      ...parsed,
      teamScores: { ...base.teamScores, ...parsed.teamScores },
      lessonTimer: { ...base.lessonTimer, ...parsed.lessonTimer },
      activityTimer: { ...base.activityTimer, ...parsed.activityTimer },
      activities: parsed.activities ?? {},
      completedActivities: parsed.completedActivities ?? [],
    };

    merged.lessonTimer = reconcileTimer(merged.lessonTimer, (t, delta) => ({
      ...t,
      elapsedMs: t.elapsedMs + delta,
      updatedAt: Date.now(),
    }));

    merged.activityTimer = reconcileTimer(merged.activityTimer, (t, delta) => ({
      ...t,
      remainingMs: Math.max(0, t.remainingMs - delta),
      running: t.remainingMs - delta > 0,
      updatedAt: Date.now(),
    }));

    return merged;
  } catch {
    return base;
  }
}

export function saveState(state: AppPersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}
