
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
  updatedAt?: string;
  completedAt?: string;
  isNotified?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  discordWebhookUrl?: string;
  theme?: 'light' | 'dark';
  // Cloud sync
  cloudEnabled?: boolean;
  cloudToken?: string;
  lastSyncedAt?: string;
}

export interface CloudUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface CloudCredentials {
  email: string;
  password: string;
}

export interface SyncStatus {
  lastSynced: string | null;
  isSyncing: boolean;
  error: string | null;
}

export interface AppState {
  currentUser: User | null;
  tasks: Task[];
  view: 'dashboard' | 'stats' | 'history' | 'settings' | 'login' | 'register';
  syncStatus: SyncStatus;
}
