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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -top-2 -left-2 w-16 h-16 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl"></div>
          
          <h2 className="text-3xl font-bold text-gradient relative z-10">My Tasks</h2>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            You have <span className="text-indigo-400 font-semibold">{pendingTasks.length}</span> tasks pending
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleGetRecommendations}
            disabled={loadingRecs}
            className="group relative px-5 py-2.5 rounded-xl font-medium text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {loadingRecs ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              AI Recommender
            </span>
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-5 py-2.5 rounded-xl font-medium text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </span>
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="glass-card rounded-2xl p-6 animate-fade-in-up border border-indigo-500/20">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15 10a5 5 0 11-10 0 5 5 0 0110 0z" />
              </svg>
              Personalized Recommendations
            </h3>
            <button onClick={() => setRecommendations([])} className="text-gray-500 hover:text-gray-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <div 
                key={i} 
                className="group relative p-4 rounded-xl bg-gradient-to-br from-[#151520] to-[#0a0a12] border border-[#1e1e2e] hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-lg"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500/30 rounded-br-lg"></div>
                
                <p className="text-gray-200 font-medium mb-3">{rec}</p>
                <button 
                  onClick={() => onAddTask({ title: rec, description: 'AI recommended task', deadline: new Date(Date.now() + 86400000).toISOString().slice(0, 16), reminders: [] })}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group-hover:gap-2"
                >
                  Add to my list
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingTasks.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl p-16 text-center glass-card border border-dashed border-[#1e1e2e]">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#151520] to-[#0a0a12] border border-[#1e1e2e] flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tasks found</h3>
            <p className="text-gray-500">Get started by creating your first task above.</p>
          </div>
        </div>
      ) : (
        /* Task Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pendingTasks.map((task, index) => (
            <div 
              key={task.id} 
              className="group relative p-6 rounded-2xl glass-card-hover holographic"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500/20 rounded-tl-2xl group-hover:border-indigo-500/50 transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500/20 rounded-br-2xl group-hover:border-indigo-500/50 transition-colors"></div>
              
              <div className="relative z-10">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="badge badge-primary px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider">
                    Pending
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onUpdateTask({ ...task, status: TaskStatus.COMPLETED, completedAt: new Date().toISOString() })}
                      className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-300 group/btn"
                    >
                      <svg className="w-5 h-5 group-hover/btn:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 group/btn"
                    >
                      <svg className="w-5 h-5 group-hover/btn:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Task Title */}
                <h3 className="font-bold text-white text-lg mb-2 truncate group-hover:text-indigo-300 transition-colors">
                  {task.title}
                </h3>
                
                {/* Task Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {task.description || 'No description provided.'}
                </p>
                
                {/* Deadline */}
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#151520]/50 p-2.5 rounded-lg border border-[#1e1e2e]">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(task.deadline).toLocaleDateString()}</span>
                  <span className="text-gray-600">at</span>
                  <span>{new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                {/* Reminders */}
                {task.reminders.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {task.reminders.map(r => (
                      <span 
                        key={r} 
                        className="badge badge-warning text-[10px] px-2 py-1 rounded font-medium"
                      >
                        Remind {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 modal-overlay"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl modal-content">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gradient">Create New Task</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Task Title</label>
                  <div className="flex gap-2">
                    <input
                      required
                      className="flex-1 px-4 py-3.5 rounded-xl futuristic-input text-white placeholder-gray-500"
                      placeholder="e.g. Design Landing Page"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={handleAiHelp}
                      disabled={loadingAi || !formData.title}
                      className="p-3.5 bg-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500/30 transition-all disabled:opacity-50"
                      title="Get AI Suggestions"
                    >
                      <svg className={`w-6 h-6 ${loadingAi ? 'animate-spin' : 'hover:rotate-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* AI Suggestions */}
                  {aiSuggestions && (
                    <div className="mt-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="font-bold mb-1 flex items-center gap-2 text-indigo-400 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM15 10a5 5 0 11-10 0 5 5 0 0110 0z" />
                        </svg>
                        AI Insights:
                      </p>
                      <pre className="whitespace-pre-wrap font-sans text-sm text-indigo-300">{aiSuggestions}</pre>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl futuristic-input text-white placeholder-gray-500 resize-none"
                    placeholder="Provide some details..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Deadline & Reminders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Deadline</label>
                    <input
                      required
                      type="datetime-local"
                      className="w-full px-4 py-3.5 rounded-xl futuristic-input text-white"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Discord Notifications</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(ReminderInterval).map(interval => (
                        <button
                          key={interval}
                          type="button"
                          onClick={() => toggleReminder(interval)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                            formData.reminders.includes(interval)
                              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
                              : 'bg-[#151520] text-gray-400 border-[#1e1e2e] hover:border-indigo-500/30'
                          }`}
                        >
                          {interval}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3.5 border border-[#1e1e2e] text-gray-400 font-semibold rounded-xl hover:bg-white/5 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 futuristic-btn text-white font-semibold rounded-xl shadow-lg"
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

