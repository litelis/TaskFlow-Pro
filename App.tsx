
import React, { useState, useEffect } from 'react';
import { User, Task, TaskStatus, AppState, ReminderInterval } from './types';
import { storageService } from './services/storageService';
import { discordService } from './services/discordService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics';
import History from './components/History';
import Settings from './components/Settings';
import Login from './components/Login';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    tasks: [],
    view: 'login'
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('taskflow_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Load initial data
  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (user) {
      const tasks = storageService.getTasks(user.id);
      setState(prev => ({ ...prev, currentUser: user, tasks, view: 'dashboard' }));
      if (user.theme) setTheme(user.theme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  // Notification background checker
  useEffect(() => {
    const checkReminders = () => {
      if (!state.currentUser?.discordWebhookUrl) return;

      const now = new Date();
      state.tasks.forEach(task => {
        if (task.status !== TaskStatus.PENDING || task.isNotified) return;

        const deadline = new Date(task.deadline);
        const diffMs = deadline.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        task.reminders.forEach(reminder => {
          let shouldRemind = false;
          let label = "";

          if (reminder === ReminderInterval.H24 && diffHours <= 24 && diffHours > 23.5) {
            shouldRemind = true;
            label = "24 hours";
          } else if (reminder === ReminderInterval.D1 && diffHours <= 24 && diffHours > 23) {
             shouldRemind = true;
             label = "1 day";
          } else if (reminder === ReminderInterval.D2 && diffHours <= 48 && diffHours > 47) {
             shouldRemind = true;
             label = "2 days";
          } else if (reminder === ReminderInterval.W1 && diffHours <= 168 && diffHours > 167) {
             shouldRemind = true;
             label = "1 week";
          }

          if (shouldRemind && state.currentUser?.discordWebhookUrl) {
            discordService.sendTaskReminder(state.currentUser.discordWebhookUrl, task.title, label);
            const updatedTask = { ...task, isNotified: true };
            storageService.saveTask(updatedTask);
          }
        });
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [state.currentUser, state.tasks]);

  const handleLogin = (user: User) => {
    const tasks = storageService.getTasks(user.id);
    storageService.setCurrentUser(user);
    setState({ currentUser: user, tasks, view: 'dashboard' });
    if (user.theme) setTheme(user.theme);
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setState({ currentUser: null, tasks: [], view: 'login' });
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'status'>) => {
    if (!state.currentUser) return;
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      userId: state.currentUser.id,
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    storageService.saveTask(newTask);
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const handleUpdateTask = (task: Task) => {
    storageService.saveTask(task);
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === task.id ? task : t)
    }));

    if (task.status === TaskStatus.COMPLETED && state.currentUser?.discordWebhookUrl) {
      discordService.sendTaskCompleted(state.currentUser.discordWebhookUrl, task.title);
    }
  };

  const handleDeleteTask = (id: string) => {
    storageService.deleteTask(id);
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    storageService.updateUser(updatedUser);
    setState(prev => ({ ...prev, currentUser: updatedUser }));
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (state.currentUser) {
       handleUpdateUser({ ...state.currentUser, theme: newTheme });
    }
  };

  return (
    <Layout
      user={state.currentUser}
      currentView={state.view}
      onNavigate={(view) => setState(prev => ({ ...prev, view }))}
      onLogout={handleLogout}
      onToggleTheme={handleToggleTheme}
      theme={theme}
    >
      {state.view === 'login' && <Login onLogin={handleLogin} />}
      {state.view === 'dashboard' && state.currentUser && (
        <Dashboard
          user={state.currentUser}
          tasks={state.tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
      {state.view === 'stats' && <Statistics tasks={state.tasks} />}
      {state.view === 'history' && <History tasks={state.tasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />}
      {state.view === 'settings' && state.currentUser && <Settings user={state.currentUser} onUpdateUser={handleUpdateUser} />}
    </Layout>
  );
};

export default App;
