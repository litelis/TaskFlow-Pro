
import { Task, User, TaskStatus } from '../types';

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
    if (index !== -1) {
      allTasks[index] = task;
    } else {
      allTasks.push(task);
    }
    localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
  },

  deleteTask: (taskId: string) => {
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks: Task[] = data ? JSON.parse(data) : [];
    const filtered = allTasks.filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
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
  }
};
