import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { loadState, saveState } from '../data/storage';
import { getLesson } from '../lessons/registry';
import type {
  ActivityTimerState,
  AppPersistedState,
  LessonDefinition,
  LessonScreen,
  TeamId,
} from '../lessons/types';
import { playSound, type SoundName } from '../utils/sound';

type AppContextValue = {
  state: AppPersistedState;
  lesson: LessonDefinition;
  screen: LessonScreen;
  screenCount: number;
  reducedMotion: boolean;
  isFullscreen: boolean;
  goNext: () => void;
  goPrev: () => void;
  goHome: () => void;
  goToScreen: (index: number) => void;
  toggleTeacherMode: () => void;
  toggleTeacherPanel: () => void;
  toggleMute: () => void;
  toggleScoreboard: () => void;
  toggleFullscreen: () => void;
  resetActivity: () => void;
  resetLesson: () => void;
  bumpScore: (team: TeamId, delta: number) => void;
  resetScores: () => void;
  markActivityComplete: (id: string) => void;
  setLesson1Complete: () => void;
  startLessonTimer: () => void;
  pauseLessonTimer: () => void;
  resetLessonTimer: () => void;
  startActivityTimer: (durationMs?: number) => void;
  pauseActivityTimer: () => void;
  resetActivityTimer: () => void;
  setActivityTimerPreset: (durationMs: number) => void;
  getActivity: <T,>(id: string, fallback: T) => T;
  setActivity: (id: string, value: unknown) => void;
  sound: (name: SoundName) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function syncRunningTimers(state: AppPersistedState): AppPersistedState {
  const now = Date.now();
  let { lessonTimer, activityTimer } = state;

  if (lessonTimer.running) {
    lessonTimer = {
      ...lessonTimer,
      elapsedMs: lessonTimer.elapsedMs + Math.max(0, now - lessonTimer.updatedAt),
      updatedAt: now,
    };
  }

  if (activityTimer.running) {
    const remaining = Math.max(0, activityTimer.remainingMs - Math.max(0, now - activityTimer.updatedAt));
    activityTimer = {
      ...activityTimer,
      remainingMs: remaining,
      running: remaining > 0,
      updatedAt: now,
    };
  }

  return { ...state, lessonTimer, activityTimer };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppPersistedState>(() => loadState());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const lesson = getLesson(state.currentLessonId);
  const screenCount = lesson.screens.length;
  const screen = lesson.screens[Math.min(state.currentScreenIndex, screenCount - 1)]!;

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    if (!state.lessonTimer.running && !state.activityTimer.running) return;
    const id = window.setInterval(() => {
      setState((prev) => syncRunningTimers(prev));
    }, 250);
    return () => window.clearInterval(id);
  }, [state.lessonTimer.running, state.activityTimer.running]);

  const goToScreen = useCallback((index: number) => {
    setState((prev) => {
      const currentLesson = getLesson(prev.currentLessonId);
      const next = Math.max(0, Math.min(currentLesson.screens.length - 1, index));
      return { ...prev, currentScreenIndex: next };
    });
  }, []);

  const goNext = useCallback(() => {
    goToScreen(stateRef.current.currentScreenIndex + 1);
  }, [goToScreen]);

  const goPrev = useCallback(() => {
    goToScreen(stateRef.current.currentScreenIndex - 1);
  }, [goToScreen]);

  const goHome = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreenIndex: 0,
      activities: {},
      scoreboardOpen: false,
    }));
  }, []);

  const toggleTeacherMode = useCallback(() => {
    setState((prev) => {
      const next = !prev.teacherMode;
      return { ...prev, teacherMode: next, teacherPanelOpen: next };
    });
  }, []);

  const toggleTeacherPanel = useCallback(() => {
    setState((prev) => ({ ...prev, teacherPanelOpen: !prev.teacherPanelOpen }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((prev) => ({ ...prev, muted: !prev.muted }));
  }, []);

  const toggleScoreboard = useCallback(() => {
    setState((prev) => ({ ...prev, scoreboardOpen: !prev.scoreboardOpen }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  }, []);

  const resetActivity = useCallback(() => {
    const id = getLesson(stateRef.current.currentLessonId).screens[stateRef.current.currentScreenIndex]?.id;
    if (!id) return;
    setState((prev) => {
      const activities = { ...prev.activities };
      delete activities[id];
      return { ...prev, activities };
    });
  }, []);

  const resetLesson = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreenIndex: 0,
      activities: {},
      completedActivities: [],
      lesson1Complete: false,
      lessonTimer: { elapsedMs: 0, running: false, updatedAt: Date.now() },
      activityTimer: {
        durationMs: 30_000,
        remainingMs: 30_000,
        running: false,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const bumpScore = useCallback((team: TeamId, delta: number) => {
    setState((prev) => ({
      ...prev,
      teamScores: {
        ...prev.teamScores,
        [team]: Math.max(0, prev.teamScores[team] + delta),
      },
    }));
  }, []);

  const resetScores = useCallback(() => {
    setState((prev) => ({
      ...prev,
      teamScores: { robot: 0, star: 0, rocket: 0, brain: 0 },
    }));
  }, []);

  const markActivityComplete = useCallback((id: string) => {
    setState((prev) =>
      prev.completedActivities.includes(id)
        ? prev
        : { ...prev, completedActivities: [...prev.completedActivities, id] },
    );
  }, []);

  const setLesson1Complete = useCallback(() => {
    setState((prev) => ({ ...prev, lesson1Complete: true }));
  }, []);

  const startLessonTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lessonTimer: { ...prev.lessonTimer, running: true, updatedAt: Date.now() },
    }));
  }, []);

  const pauseLessonTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lessonTimer: {
        ...syncRunningTimers(prev).lessonTimer,
        running: false,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const resetLessonTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lessonTimer: { elapsedMs: 0, running: false, updatedAt: Date.now() },
    }));
  }, []);

  const setActivityTimerPreset = useCallback((durationMs: number) => {
    setState((prev) => ({
      ...prev,
      activityTimer: {
        durationMs,
        remainingMs: durationMs,
        running: false,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const startActivityTimer = useCallback((durationMs?: number) => {
    setState((prev) => {
      const duration = durationMs ?? prev.activityTimer.durationMs;
      const remaining =
        durationMs != null
          ? durationMs
          : prev.activityTimer.remainingMs > 0
            ? prev.activityTimer.remainingMs
            : duration;
      const next: ActivityTimerState = {
        durationMs: duration,
        remainingMs: remaining,
        running: remaining > 0,
        updatedAt: Date.now(),
      };
      return { ...prev, activityTimer: next };
    });
  }, []);

  const pauseActivityTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activityTimer: {
        ...syncRunningTimers(prev).activityTimer,
        running: false,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const resetActivityTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activityTimer: {
        durationMs: prev.activityTimer.durationMs,
        remainingMs: prev.activityTimer.durationMs,
        running: false,
        updatedAt: Date.now(),
      },
    }));
  }, []);

  const getActivity = useCallback(<T,>(id: string, fallback: T): T => {
    const stored = stateRef.current.activities[id];
    return (stored as T | undefined) ?? fallback;
  }, []);

  const setActivity = useCallback((id: string, value: unknown) => {
    setState((prev) => ({
      ...prev,
      activities: { ...prev.activities, [id]: value },
    }));
  }, []);

  const sound = useCallback((name: SoundName) => {
    playSound(name, stateRef.current.muted);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'f' || event.key === 'F') {
        if (!event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          toggleFullscreen();
        }
      } else if (event.key === 't' || event.key === 'T') {
        if (!event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          toggleTeacherMode();
        }
      } else if (event.key === 'r' || event.key === 'R') {
        if (!event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          resetActivity();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, toggleFullscreen, toggleTeacherMode, resetActivity]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      lesson,
      screen,
      screenCount,
      reducedMotion,
      isFullscreen,
      goNext,
      goPrev,
      goHome,
      goToScreen,
      toggleTeacherMode,
      toggleTeacherPanel,
      toggleMute,
      toggleScoreboard,
      toggleFullscreen,
      resetActivity,
      resetLesson,
      bumpScore,
      resetScores,
      markActivityComplete,
      setLesson1Complete,
      startLessonTimer,
      pauseLessonTimer,
      resetLessonTimer,
      startActivityTimer,
      pauseActivityTimer,
      resetActivityTimer,
      setActivityTimerPreset,
      getActivity,
      setActivity,
      sound,
    }),
    [
      state,
      lesson,
      screen,
      screenCount,
      reducedMotion,
      isFullscreen,
      goNext,
      goPrev,
      goHome,
      goToScreen,
      toggleTeacherMode,
      toggleTeacherPanel,
      toggleMute,
      toggleScoreboard,
      toggleFullscreen,
      resetActivity,
      resetLesson,
      bumpScore,
      resetScores,
      markActivityComplete,
      setLesson1Complete,
      startLessonTimer,
      pauseLessonTimer,
      resetLessonTimer,
      startActivityTimer,
      pauseActivityTimer,
      resetActivityTimer,
      setActivityTimerPreset,
      getActivity,
      setActivity,
      sound,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function useActivityState<T>(initial: T): [T, (updater: T | ((prev: T) => T)) => void] {
  const { screen, state, setActivity } = useApp();
  const stored = state.activities[screen.id];
  const value = (stored as T | undefined) ?? initial;
  const valueRef = useRef(value);
  valueRef.current = value;
  const initialRef = useRef(initial);
  initialRef.current = initial;

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const current = valueRef.current ?? initialRef.current;
      const next = typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
      valueRef.current = next;
      setActivity(screen.id, next);
    },
    [screen.id, setActivity],
  );

  return [value, setValue];
}
