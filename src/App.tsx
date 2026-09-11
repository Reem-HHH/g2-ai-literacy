import { PresentationShell } from './components/PresentationShell';
import { AppProvider, useApp } from './hooks/AppContext';
import { Lesson1Screen } from './lessons/lesson1/index';

function LessonView() {
  const { screen, lesson } = useApp();
  if (lesson.id !== 'lesson1') {
    return (
      <div className="screen-body">
        <h2 className="screen-title">This lesson is coming soon.</h2>
      </div>
    );
  }
  return <Lesson1Screen index={screen.index} />;
}

export default function App() {
  return (
    <AppProvider>
      <PresentationShell>
        <LessonView />
      </PresentationShell>
    </AppProvider>
  );
}
