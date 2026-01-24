
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task History</h2>
        <p className="text-gray-500 dark:text-gray-400">Your archive of accomplishments</p>
      </div>

      {completedTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-gray-100 dark:border-slate-700">
          <p className="text-gray-400 dark:text-gray-500">No completed tasks yet. Finish something to see it here!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Task</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Finished At</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {completedTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-200">{task.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onUpdateTask({ ...task, status: TaskStatus.PENDING, completedAt: undefined })}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
