import { Screen01, Screen02, Screen03, Screen04 } from './StartDiscover';
import { Screen05, Screen06, Screen07, Screen08, Screen09 } from './LearnPractice';
import { Screen10, Screen11, Screen12 } from './PlayApply';
import { Screen13, Screen14, Screen15, Screen16 } from './AssessReflect';

const SCREENS = [
  Screen01,
  Screen02,
  Screen03,
  Screen04,
  Screen05,
  Screen06,
  Screen07,
  Screen08,
  Screen09,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
  Screen15,
  Screen16,
];

export function Lesson1Screen({ index }: { index: number }) {
  const Screen = SCREENS[index] ?? Screen01;
  return <Screen />;
}
