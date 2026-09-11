import { lesson1 } from './lesson1';
import type { LessonDefinition } from './types';

export const lessons: LessonDefinition[] = [lesson1];

export function getLesson(id: string): LessonDefinition {
  return lessons.find((lesson) => lesson.id === id) ?? lesson1;
}
