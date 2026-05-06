export type UserProfile = {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: number;
};

export type TaskStatus = "pending" | "completed";
export type SessionType = "focus" | "short_break" | "long_break";

export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  tags: string[];
  createdAt: number;
};

export type PomodoroSession = {
  id: string;
  userId: string;
  taskId?: string;
  type: SessionType;
  duration: number;
  startTime: number;
  endTime: number;
  completed: boolean;
};

export type TimerMode = "focus" | "short_break" | "long_break";
