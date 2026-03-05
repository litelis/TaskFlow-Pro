import React from 'react';
import { Task, TaskStatus } from '../types';

interface HistoryProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

const History: React.FC<HistoryProps> = ({ tasks, onDeleteTask, onUpdateTask }) => {
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-green-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-indigo-500/10 rounded-full blur-xl"></div>
        
        <h2 className="text-3xl font-bold text-gradient relative z-10">Task History</h2>
        <p className="text-gray-400 mt-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Your archive of accomplishments
        </p>
      </div>

      {completedTasks.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl p-16 text-center glass-card border border-dashed border-[#1e1e2e]">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#151520] to-[#0a0a12] border border-[#1e1e2e] flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No completed tasks yet</h3>
            <p className="text-gray-500">Finish something to see it here!</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-[#1e1e2e]">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-[#151520] to-[#0a0a12] border-b border-[#1e1e2e]">
            <div className="grid grid-cols-12 px-6 py-4">
              <div className="col-span-7">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Task</span>
              </div>
              <div className="col-span-3">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Finished At</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Actions</span>
              </div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-[#1e1e2e]">
            {completedTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="group grid grid-cols-12 px-6 py-4 items-center hover:bg-white/5 transition-all duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="col-span-7">
                  <div className="flex items-center gap-3">
                    {/* Status icon */}
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate group-hover:text-green-300 transition-colors">{task.title}</p>
                      <p className="text-xs text-gray-500 truncate">{task.description || 'No description'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-gray-400">
                    {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onUpdateTask({ ...task, status: TaskStatus.PENDING, completedAt: undefined })}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

