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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-xl border border-indigo-500/20">
          <p className="text-gray-300 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl"></div>
        
        <h2 className="text-3xl font-bold text-gradient relative z-10">Performance Analytics</h2>
        <p className="text-gray-400 mt-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          A detailed view of your productivity trends
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Completion Rate */}
        <div className="group relative p-6 rounded-2xl glass-card border border-[#1e1e2e] hover:border-indigo-500/30 transition-all duration-300">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-xl"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500/30 rounded-br-xl"></div>
          
          <p className="text-sm font-medium text-gray-400 mb-2">Completion Rate</p>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-bold text-gradient">{completionRate}%</p>
          </div>
          <div className="w-full h-2 bg-[#151520] rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ 
                width: `${completionRate}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)'
              }}
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></span>
            </div>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="group relative p-6 rounded-2xl glass-card border border-[#1e1e2e] hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-xl"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-xl"></div>
          
          <p className="text-sm font-medium text-gray-400 mb-4">Task Status Distribution</p>
          <div className="h-40">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    innerRadius={50} 
                    outerRadius={75} 
                    paddingAngle={5} 
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        style={{ filter: 'drop-shadow(0 0 8px ' + entry.color + '80)' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ 
                    background: entry.color,
                    boxShadow: `0 0 8px ${entry.color}80`
                  }}
                ></span>
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="group relative p-6 rounded-2xl glass-card border border-[#1e1e2e] hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl"></div>
          
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-medium text-gray-400">Quick Stats</p>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#151520]/50 border border-[#1e1e2e]">
              <span className="text-gray-400">Total Tasks</span>
              <span className="font-bold text-white text-lg">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/5 border border-green-500/20">
              <span className="text-gray-400">Completed</span>
              <span className="font-bold text-green-400 text-lg">{completed}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <span className="text-gray-400">Pending</span>
              <span className="font-bold text-indigo-400 text-lg">{pending}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-500/5 border border-gray-500/20">
              <span className="text-gray-400">Archived</span>
              <span className="font-bold text-gray-400 text-lg">{archived}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="group relative p-6 rounded-2xl glass-card border border-[#1e1e2e] hover:border-indigo-500/30 transition-all duration-300">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-xl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500/30 rounded-tr-xl"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500/30 rounded-bl-xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500/30 rounded-br-xl"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-lg font-bold text-white">Activity (Last 7 Days)</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
              <span className="text-xs text-gray-400">New Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <span className="text-xs text-gray-400">Completed</span>
            </div>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#1e1e2e' }}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#1e1e2e' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="created" 
                name="New Tasks" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]}
                style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.4))' }}
              />
              <Bar 
                dataKey="completed" 
                name="Completed" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

