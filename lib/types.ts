export type Screen = 'home' | 'taskDetail' | 'focus' | 'add' | 'empty' | 'blocked';

export interface Step {
  id: string;
  text: string;
  done: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  createdAt: string;
}
