export const STAGES = [
  'START',
  'DISCOVER',
  'LEARN',
  'PRACTICE',
  'PLAY',
  'APPLY',
  'REFLECT',
] as const;

export type Stage = (typeof STAGES)[number];

export type LearningObjective = 'LO1' | 'LO2';

export type TeamId = 'robot' | 'star' | 'rocket' | 'brain';

export type TeacherNotes = {
  time: string;
  objectives: LearningObjective[];
  strategy: string;
  script: string[];
  expectedAnswers: string[];
  misconceptions: string[];
  support: string[];
  challenge: string[];
  prompts?: string[];
};

export type LessonScreen = {
  id: string;
  index: number;
  stage: Stage;
  title: string;
  studentTitle: string;
  objectives: LearningObjective[];
  /** Kid-facing success line shown at the top of the slide. */
  iCan: string;
  /** First item is the projector strategy tag; the rest stay in teacher notes. */
  strategies: string[];
  recommendedMinutes: number;
  teacher: TeacherNotes;
};

export type LessonDefinition = {
  id: string;
  number: number;
  totalLessons: number;
  title: string;
  missionTitle: string;
  durationMinutes: number;
  bigQuestion: string;
  screens: LessonScreen[];
};

export type TeamScores = Record<TeamId, number>;

export type LessonTimerState = {
  elapsedMs: number;
  running: boolean;
  updatedAt: number;
};

export type ActivityTimerState = {
  durationMs: number;
  remainingMs: number;
  running: boolean;
  updatedAt: number;
};

export type AppPersistedState = {
  currentLessonId: string;
  currentScreenIndex: number;
  teacherMode: boolean;
  teacherPanelOpen: boolean;
  muted: boolean;
  scoreboardOpen: boolean;
  teamScores: TeamScores;
  completedActivities: string[];
  lessonTimer: LessonTimerState;
  activityTimer: ActivityTimerState;
  activities: Record<string, unknown>;
  lesson1Complete: boolean;
};
