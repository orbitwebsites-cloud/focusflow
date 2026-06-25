import type { Task } from './types';

const KEY = 'ff_tasks_v1';

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {}
}
