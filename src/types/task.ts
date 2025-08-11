export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  status: 'pending' | 'active' | 'completed';
  timeSpent: number; // em segundos
  startTime?: number; // timestamp quando iniciou
  completedAt?: number; // timestamp quando completou
  createdAt: number;
  updatedAt: number;
}

export interface TimerState {
  isRunning: boolean;
  activeTaskId: string | null;
  startTime: number | null;
  elapsedTime: number;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface TaskFilters {
  viewMode: ViewMode;
  selectedDate: Date;
}