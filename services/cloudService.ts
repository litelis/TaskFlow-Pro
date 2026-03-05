import { User, Task, CloudCredentials, CloudUser, TaskStatus } from '../types';

// Simulated cloud API base URL - replace with real backend in production
const CLOUD_API_URL = 'https://api.taskflow-pro.cloud';

// Simple encryption for local demo (use proper encryption in production)
const encodeData = (data: string): string => {
  return btoa(encodeURIComponent(data));
};

const decodeData = (data: string): string => {
  return decodeURIComponent(atob(data));
};

const hashPassword = (password: string): string => {
  // Simple hash for demo - use bcrypt in production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export const cloudService = {
  // Register new cloud account
  register: async (credentials: CloudCredentials, username: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    try {
      // For demo, store in localStorage
      const users = JSON.parse(localStorage.getItem('cloud_users') || '[]');
      
      if (users.find((u: CloudUser) => u.email === credentials.email)) {
        return { success: false, error: 'Email already registered' };
      }
      
      const newUser: CloudUser = {
        id: crypto.randomUUID(),
        username,
        email: credentials.email,
        passwordHash: hashPassword(credentials.password),
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('cloud_users', JSON.stringify(users));
      
      // Generate token
      const token = encodeData(JSON.stringify({ userId: newUser.id, email: newUser.email }));
      localStorage.setItem(`cloud_token_${newUser.id}`, token);
      
      return { success: true, token };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  },

  // Login to cloud account
  login: async (credentials: CloudCredentials): Promise<{ success: boolean; token?: string; user?: CloudUser; error?: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem('cloud_users') || '[]');
      const user = users.find((u: CloudUser) => u.email === credentials.email);
      
      if (!user || user.passwordHash !== hashPassword(credentials.password)) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      const token = encodeData(JSON.stringify({ userId: user.id, email: user.email }));
      localStorage.setItem(`cloud_token_${user.id}`, token);
      
      return { success: true, token, user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  },

  // Logout from cloud
  logout: async (userId: string): Promise<void> => {
    localStorage.removeItem(`cloud_token_${userId}`);
    localStorage.removeItem(`cloud_data_${userId}`);
  },

  // Sync tasks to cloud
  syncTasks: async (userId: string, tasks: Task[]): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem(`cloud_token_${userId}`);
      if (!token) {
        return { success: false, error: 'Not logged in' };
      }
      
      // Store encrypted data
      const encryptedData = encodeData(JSON.stringify({
        tasks,
        syncedAt: new Date().toISOString()
      }));
      
      localStorage.setItem(`cloud_data_${userId}`, encryptedData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Sync failed' };
    }
  },

  // Get tasks from cloud
  getTasks: async (userId: string): Promise<{ success: boolean; tasks?: Task[]; error?: string }> => {
    try {
      const token = localStorage.getItem(`cloud_token_${userId}`);
      if (!token) {
        return { success: false, error: 'Not logged in' };
      }
      
      const encryptedData = localStorage.getItem(`cloud_data_${userId}`);
      if (!encryptedData) {
        return { success: true, tasks: [] };
      }
      
      const data = JSON.parse(decodeData(encryptedData));
      return { success: true, tasks: data.tasks };
    } catch (error) {
      return { success: false, error: 'Failed to fetch tasks' };
    }
  },

  // Full sync (upload local, download cloud, merge)
  fullSync: async (userId: string, localTasks: Task[]): Promise<{ success: boolean; tasks?: Task[]; error?: string }> => {
    try {
      // Get cloud tasks
      const cloudResult = await cloudService.getTasks(userId);
      const cloudTasks: Task[] = cloudResult.tasks || [];
      
      // Merge: cloud wins for conflicts, but keep all unique tasks
      const taskMap = new Map<string, Task>();
      
      // Add local tasks
      localTasks.forEach(task => taskMap.set(task.id, task));
      
      // Merge cloud tasks (newer wins)
      cloudTasks.forEach(task => {
        const localTask = taskMap.get(task.id);
        if (!localTask || new Date(task.updatedAt || task.createdAt) > new Date(localTask.updatedAt || localTask.createdAt)) {
          taskMap.set(task.id, task);
        }
      });
      
      const mergedTasks = Array.from(taskMap.values());
      
      // Upload merged tasks
      await cloudService.syncTasks(userId, mergedTasks);
      
      return { success: true, tasks: mergedTasks };
    } catch (error) {
      return { success: false, error: 'Sync failed' };
    }
  },

  // Check if user is logged in
  isLoggedIn: (userId: string): boolean => {
    return !!localStorage.getItem(`cloud_token_${userId}`);
  },

  // Get last sync time
  getLastSyncTime: (userId: string): string | null => {
    const encryptedData = localStorage.getItem(`cloud_data_${userId}`);
    if (!encryptedData) return null;
    
    try {
      const data = JSON.parse(decodeData(encryptedData));
      return data.syncedAt || null;
    } catch {
      return null;
    }
  }
};

export default cloudService;

