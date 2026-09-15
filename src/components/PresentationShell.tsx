import { useEffect, useState, type ReactNode } from 'react';
import { useApp } from '../hooks/AppContext';
import { STAGES } from '../lessons/types';
import { formatClock, formatLongDate, formatMmSs } from '../utils/format';
import { Btn } from './Badges';
import type { TeamId } from '../lessons/types';

const TEAMS: { id: TeamId; label: string }[] = [
  { id: 'robot', label: 'Team Robot' },
  { id: 'star', label: 'Team Star' },
  { id: 'rocket', label: 'Team Rocket' },
  { id: 'brain', label: 'Team Brain' },
];

const PRESETS = [
  { label: '15 sec', ms: 15_000 },
  { label: '30 sec', ms: 30_000 },
  { label: '1 min', ms: 60_000 },
  { label: '90 sec', ms: 90_000 },
  { label: '2 min', ms: 120_000 },
];

export function PresentationShell({ children }: { children: ReactNode }) {
  const app = useApp();
  const { state, lesson, screen, screenCount } = app;
  const teacher = state.teacherMode;
  const [now, setNow] = useState(() => new Date());
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => {
      setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const remaining = Math.max(0, lesson.durationMinutes * 60 * 1000 - state.lessonTimer.elapsedMs);
  const progressPct = ((screen.index + 1) / screenCount) * 100;
  const leadStrategy = screen.strategies[0];

  return (
    <div className="stage-wrap">
      <div
        className="stage-frame"
        style={{ width: 1920 * scale, height: 1080 * scale }}
      >
      <div
        className={`stage ${app.reducedMotion ? 'reduced' : ''} ${teacher ? 'teacher-mode' : 'student-mode'}`}
        style={{ transform: `scale(${scale})` }}
      >
        <header className="lesson-header">
          <div className="left">
            <span className="kicker">Grade 2 · AI Literacy</span>
          </div>
          <div className="center">
            <h1 className="header-title">
              Lesson {lesson.number}: {lesson.title}
            </h1>
          </div>
          <div className="right">
            {teacher ? (
              <div className="clock-block">
                <div className="date">{formatLongDate(now)}</div>
                <div className="time">{formatClock(now)}</div>
              </div>
            ) : (
              <span className="screen-count">
                {screen.index + 1} / {screenCount}
              </span>
            )}
          </div>
        </header>

        <div className="progress-wrap">
          {teacher ? (
            <div className="progress-meta">
              <span>Lesson {lesson.number} of {lesson.totalLessons}</span>
              <span>Screen {screen.index + 1} of {screenCount}</span>
            </div>
          ) : null}
          <div className="stage-track" aria-label="Lesson stages">
            {STAGES.map((stage) => {
              const seen = lesson.screens.some((item) => item.stage === stage && item.index < screen.index);
              const active = stage === screen.stage;
              return (
                <div
                  key={stage}
                  className={`stage-pill ${active ? 'active' : seen ? 'done' : ''}`}
                >
                  {stage}
                </div>
              );
            })}
          </div>
          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <main className="screen-main">
          <div className="screen-toolbar">
            <p className="ican">{screen.iCan}</p>
            {leadStrategy ? <span className="strategy-chip">{leadStrategy}</span> : null}
          </div>
          {children}
        </main>

        <footer className="lesson-footer">
          <div className="ctrl-group">
            <Btn onClick={app.goPrev} disabled={screen.index === 0}>← BACK</Btn>
            <Btn onClick={app.goHome}>HOME</Btn>
            <Btn onClick={app.toggleFullscreen}>{app.isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}</Btn>
            <Btn onClick={app.toggleMute} className="icon-btn" aria-label={state.muted ? 'Unmute' : 'Mute'}>
              {state.muted ? '🔇' : '🔊'}
            </Btn>
          </div>

          {teacher ? (
            <div className="ctrl-group">
              <div className="timer-box" aria-label="Lesson timer">
                <span>Lesson</span>
                <strong>{formatMmSs(state.lessonTimer.elapsedMs)}</strong>
                <span>/ {formatMmSs(remaining)} left</span>
                <Btn className="tiny" onClick={app.startLessonTimer}>START</Btn>
                <Btn className="tiny" onClick={app.pauseLessonTimer}>PAUSE</Btn>
                <Btn className="tiny" onClick={app.resetLessonTimer}>RESET</Btn>
              </div>
              <div className="activity-timer" aria-label="Activity timer">
                <span>Activity</span>
                <strong>{formatMmSs(state.activityTimer.remainingMs)}</strong>
                <select
                  className="preset-select"
                  value={state.activityTimer.durationMs}
                  onChange={(event) => app.setActivityTimerPreset(Number(event.target.value))}
                  aria-label="Activity timer length"
                >
                  {PRESETS.map((preset) => (
                    <option key={preset.ms} value={preset.ms}>{preset.label}</option>
                  ))}
                </select>
                <Btn className="tiny" onClick={() => app.startActivityTimer()}>Start</Btn>
                <Btn className="tiny" onClick={app.pauseActivityTimer}>Pause</Btn>
                <Btn className="tiny" onClick={app.resetActivityTimer}>Reset</Btn>
              </div>
            </div>
          ) : state.activityTimer.running ? (
            <div className="student-timer" aria-live="polite">
              {formatMmSs(state.activityTimer.remainingMs)}
            </div>
          ) : (
            <div className="footer-title">{screen.studentTitle.replace(/^[^\w]+/, '')}</div>
          )}

          <div className="ctrl-group">
            {teacher ? (
              <>
                <Btn variant={state.scoreboardOpen ? 'yellow' : 'default'} onClick={app.toggleScoreboard}>
                  SCORES
                </Btn>
                <Btn onClick={app.resetActivity}>RESET ACTIVITY</Btn>
              </>
            ) : null}
            <Btn
              variant={teacher ? 'pink' : 'default'}
              onClick={app.toggleTeacherMode}
            >
              {teacher ? 'Teacher Mode' : 'Teacher'}
            </Btn>
            <Btn variant="primary" onClick={app.goNext} disabled={screen.index >= screenCount - 1}>
              NEXT →
            </Btn>
          </div>
        </footer>

        {teacher && state.scoreboardOpen ? (
          <aside className="scoreboard" aria-label="Team scoreboard">
            <h3 style={{ margin: '0 0 8px', fontFamily: 'Fredoka, Nunito, sans-serif' }}>Team Scores</h3>
            {TEAMS.map((team) => (
              <div className="score-row" key={team.id}>
                <span>{team.label}</span>
                <strong>{state.teamScores[team.id]}</strong>
                <Btn className="tiny" onClick={() => app.bumpScore(team.id, 1)}>+1</Btn>
                <Btn className="tiny" onClick={() => app.bumpScore(team.id, -1)}>-1</Btn>
              </div>
            ))}
            <Btn onClick={app.resetScores}>RESET SCORES</Btn>
          </aside>
        ) : null}

        {teacher && !state.teacherPanelOpen ? (
          <Btn
            className="tiny notes-toggle"
            onClick={app.toggleTeacherPanel}
          >
            NOTES
          </Btn>
        ) : null}

        {teacher && state.teacherPanelOpen ? (
          <aside className="teacher-panel">
            <div className="ctrl-group" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <h3>Teacher Panel</h3>
              <Btn className="tiny" onClick={app.toggleTeacherPanel}>HIDE</Btn>
            </div>
            <p><strong>Time:</strong> {screen.teacher.time}</p>
            <p><strong>Objective:</strong> {screen.teacher.objectives.join(' + ')}</p>
            <p><strong>Strategy:</strong> {screen.teacher.strategy}</p>
            <h4>Teacher script</h4>
            <ul>{screen.teacher.script.map((line) => <li key={line}>{line}</li>)}</ul>
            {screen.teacher.prompts?.length ? (
              <>
                <h4>Prompts</h4>
                <ul>{screen.teacher.prompts.map((line) => <li key={line}>{line}</li>)}</ul>
              </>
            ) : null}
            {screen.teacher.expectedAnswers.length ? (
              <>
                <h4>Expected answers</h4>
                <ul>{screen.teacher.expectedAnswers.map((line) => <li key={line}>{line}</li>)}</ul>
              </>
            ) : null}
            {screen.teacher.misconceptions.length ? (
              <>
                <h4>Watch for</h4>
                <ul>{screen.teacher.misconceptions.map((line) => <li key={line}>{line}</li>)}</ul>
              </>
            ) : null}
            <h4>Support</h4>
            <ul>{screen.teacher.support.map((line) => <li key={line}>{line}</li>)}</ul>
            {screen.teacher.challenge.length ? (
              <>
                <h4>Challenge</h4>
                <ul>{screen.teacher.challenge.map((line) => <li key={line}>{line}</li>)}</ul>
              </>
            ) : null}
          </aside>
        ) : null}
      </div>
      </div>
    </div>
  );
}
