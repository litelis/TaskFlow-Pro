
export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum ReminderInterval {
  H24 = '24h',
  D1 = '1d',
  D2 = '2d',
  W1 = '1w'
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  reminders: ReminderInterval[];
  createdAt: string;
  completedAt?: string;
  isNotified?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  discordWebhookUrl?: string;
  theme?: 'light' | 'dark';
}

export interface AppState {
  currentUser: User | null;
  tasks: Task[];
  view: 'dashboard' | 'stats' | 'history' | 'settings' | 'login' | 'register';
}
