
import { Task, User, TaskStatus } from '../types';
import { cloudService } from './cloudService';

const USERS_KEY = 'taskflow_users';
const TASKS_KEY = 'taskflow_tasks';
const SESSION_KEY = 'taskflow_session';

export const storageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getTasks: (userId: string): Task[] => {
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks: Task[] = data ? JSON.parse(data) : [];
    return allTasks.filter(t => t.userId === userId);
  },

  saveTask: (task: Task) => {
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks: Task[] = data ? JSON.parse(data) : [];
    const index = allTasks.findIndex(t => t.id === task.id);
    const updatedTask = { ...task, updatedAt: new Date().toISOString() };
    
    if (index !== -1) {
      allTasks[index] = updatedTask;
    } else {
      allTasks.push(updatedTask);
    }
    localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
    
    // Auto-sync to cloud if enabled
    const user = storageService.getCurrentUser();
    if (user?.cloudEnabled && user.id) {
      const userTasks = allTasks.filter(t => t.userId === user.id);
      cloudService.syncTasks(user.id, userTasks);
    }
  },

  deleteTask: (taskId: string) => {
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks: Task[] = data ? JSON.parse(data) : [];
    const filtered = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
    
    // Auto-sync to cloud if enabled
    const user = storageService.getCurrentUser();
    if (user?.cloudEnabled && user.id) {
      const userTasks = filtered.filter(t => t.userId === user.id);
      cloudService.syncTasks(user.id, userTasks);
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  updateUser: (updatedUser: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      storageService.setCurrentUser(updatedUser);
    }
  },

  // Cloud sync methods
  enableCloudSync: async (user: User, email: string, password: string) => {
    const result = await cloudService.login({ email, password });
    if (result.success && result.token) {
      const updatedUser = {
        ...user,
        cloudEnabled: true,
        cloudToken: result.token,
        lastSyncedAt: new Date().toISOString()
      };
      storageService.updateUser(updatedUser);
      return { success: true, user: updatedUser };
    }
    return { success: false, error: result.error };
  },

  disableCloudSync: (user: User) => {
    if (user.id) {
      cloudService.logout(user.id);
    }
    const updatedUser = {
      ...user,
      cloudEnabled: false,
      cloudToken: undefined,
      lastSyncedAt: undefined
    };
    storageService.updateUser(updatedUser);
    return updatedUser;
  },

  syncWithCloud: async (user: User, localTasks: Task[]) => {
    if (!user.cloudEnabled || !user.id) {
      return { success: false, error: 'Cloud sync not enabled' };
    }

    const result = await cloudService.fullSync(user.id, localTasks);
    if (result.success && result.tasks) {
      // Update local storage with merged tasks
      const data = localStorage.getItem(TASKS_KEY);
      const allTasks: Task[] = data ? JSON.parse(data) : [];
      const otherTasks = allTasks.filter(t => t.userId !== user.id);
      const mergedTasks = [...otherTasks, ...result.tasks];
      localStorage.setItem(TASKS_KEY, JSON.stringify(mergedTasks));
      
      // Update user sync time
      const updatedUser = { ...user, lastSyncedAt: new Date().toISOString() };
      storageService.setCurrentUser(updatedUser);
      
      return { success: true, tasks: result.tasks };
    }
    return { success: false, error: result.error };
  },

  getCloudStatus: (userId: string) => {
    const isLoggedIn = cloudService.isLoggedIn(userId);
    const lastSync = cloudService.getLastSyncTime(userId);
    return { isLoggedIn, lastSyncedAt: lastSync };
  }
};
