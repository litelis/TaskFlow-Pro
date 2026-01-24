
import React, { useState } from 'react';
import { Task, TaskStatus, ReminderInterval, User } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'status'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onAddTask, onUpdateTask, onDeleteTask, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    reminders: [] as ReminderInterval[]
  });
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING);

  const handleAiHelp = async () => {
    if (!formData.title) return;
    setLoadingAi(true);
    const advice = await geminiService.getSmartAdvice(formData.title, formData.deadline || 'soon');
    setAiSuggestions(advice);
    setLoadingAi(false);
  };

  const handleGetRecommendations = async () => {
    setLoadingRecs(true);
    const recs = await geminiService.recommendTasks(pendingTasks.length);
    setRecommendations(recs);
    setLoadingRecs(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(formData);
    setFormData({ title: '', description: '', deadline: '', reminders: [] });
    setAiSuggestions(null);
    setIsModalOpen(false);
  };

  const toggleReminder = (r: ReminderInterval) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.includes(r)
        ? prev.reminders.filter(x => x !== r)
        : [...prev.reminders, r]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">My Tasks</h2>
          <p className="text-gray-500 dark:text-gray-400">You have {pendingTasks.length} tasks pending</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGetRecommendations}
            disabled={loadingRecs}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loadingRecs ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            AI Recommender
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-600/20 animate-fade-in">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15 10a5 5 0 11-10 0 5 5 0 0110 0z" /></svg>
                 Personalized Recommendations
              </h3>
              <button onClick={() => setRecommendations([])} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 shadow-sm flex flex-col justify-between items-start">
                   <p className="text-gray-800 dark:text-gray-200 font-medium mb-3">{rec}</p>
                   <button 
                    onClick={() => onAddTask({ title: rec, description: 'AI recommended task', deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16), reminders: [] })}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                   >
                     Add to my list
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {pendingTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium dark:text-gray-200 text-gray-900">No tasks found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Get started by creating your first task above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingTasks.map(task => (
            <div key={task.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded uppercase tracking-wider">
                  Pending
                </span>
                <div className="flex gap-2">
                   <button
                    onClick={() => onUpdateTask({ ...task, status: TaskStatus.COMPLETED, completedAt: new Date().toISOString() })}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 truncate">{task.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{task.description || 'No description provided.'}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(task.deadline).toLocaleDateString()} at {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {task.reminders.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {task.reminders.map(r => (
                    <span key={r} className="text-[10px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-100 dark:border-yellow-900/40 font-medium">
                      Remind {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold dark:text-white text-gray-900">Create New Task</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">Task Title</label>
                  <div className="flex gap-2">
                    <input
                      required
                      className="flex-1 px-4 py-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Design Landing Page"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={handleAiHelp}
                      disabled={loadingAi || !formData.title}
                      className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
                      title="Get AI Suggestions"
                    >
                      <svg className={`w-6 h-6 ${loadingAi ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                  </div>
                  {aiSuggestions && (
                    <div className="mt-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-sm text-indigo-800 dark:text-indigo-300">
                      <p className="font-bold mb-1 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15 10a5 5 0 11-10 0 5 5 0 0110 0z" /></svg>
                        AI Insights:
                      </p>
                      <pre className="whitespace-pre-wrap font-sans">{aiSuggestions}</pre>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Provide some details..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">Deadline</label>
                    <input
                      required
                      type="datetime-local"
                      className="w-full px-4 py-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold dark:text-gray-200 text-gray-700 mb-2">Discord Notifications</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(ReminderInterval).map(interval => (
                        <button
                          key={interval}
                          type="button"
                          onClick={() => toggleReminder(interval)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                            formData.reminders.includes(interval)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600 hover:border-indigo-300'
                          }`}
                        >
                          {interval}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 dark:border-slate-600 dark:text-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
