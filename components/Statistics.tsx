
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Task, TaskStatus } from '../types';

interface StatsProps {
  tasks: Task[];
}

const Statistics: React.FC<StatsProps> = ({ tasks }) => {
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pending = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const archived = tasks.filter(t => t.status === TaskStatus.ARCHIVED).length;

  const pieData = [
    { name: 'Completed', value: completed, color: '#10B981' },
    { name: 'Pending', value: pending, color: '#6366F1' },
    { name: 'Archived', value: archived, color: '#94A3B8' },
  ].filter(d => d.value > 0);

  // Group by date (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const barData = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED && t.completedAt?.startsWith(date)).length,
    created: tasks.filter(t => t.createdAt.startsWith(date)).length,
  }));

  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400">A detailed view of your productivity trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Completion Rate</p>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</p>
          <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Task Status Distribution</p>
          <div className="h-48">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-gray-300 dark:text-gray-600">No data</div>}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quick Stats</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
              <span className="font-bold text-green-600 dark:text-green-400">{completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{pending}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity (Last 7 Days)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey="created" name="New Tasks" fill="#E0E7FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
