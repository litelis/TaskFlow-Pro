import React, { useEffect, useState } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate, onLogout, onToggleTheme, theme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!user) return <>{children}</>;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      glow: 'rgba(99, 102, 241, 0.4)'
    },
    { 
      id: 'stats', 
      label: 'Statistics', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      glow: 'rgba(139, 92, 246, 0.4)'
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      glow: 'rgba(34, 211, 238, 0.4)'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
  ];

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${theme === 'dark' ? 'bg-[#050508]' : 'bg-gray-50'}`}>
      {/* Futuristic Sidebar */}
      <aside className={`w-72 border-r hidden md:flex flex-col transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-[#0a0a12]/90 border-[#151520]' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-xl`}>
        
        {/* Logo Section */}
        <div className="p-6 relative">
          {/* Decorative glow */}
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"></div>
          
          <h1 className="text-2xl font-bold relative z-10 flex items-center gap-3">
            <span className="relative">
              <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-500/30 animate-pulse-glow">
                T
              </span>
              {/* Glow ring */}
              <span className="absolute inset-0 rounded-xl bg-indigo-500/50 blur-md -z-10"></span>
            </span>
            <span className="text-gradient">TaskFlow Pro</span>
          </h1>
          <p className={`text-xs mt-2 ml-13 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            AI-Powered Productivity
          </p>
        </div>

        {/* Decorative line */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full nav-item group relative flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                currentView === item.id 
                  ? 'active bg-gradient-to-r from-indigo-500/15 to-transparent text-white'
                  : (theme === 'dark' 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Active indicator glow */}
              {currentView === item.id && (
                <div 
                  className="absolute inset-0 rounded-xl opacity-20"
                  style={{ 
                    background: `radial-gradient(ellipse at left, ${item.glow}, transparent 70%)`,
                  }}
                ></div>
              )}
              
              <span className={`relative z-10 flex-shrink-0 ${currentView === item.id ? 'icon-glow' : ''}`}>
                <svg 
                  className={`w-5 h-5 transition-all duration-300 ${currentView === item.id ? 'text-indigo-400' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={item.icon}
                    className={currentView === item.id ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : ''}
                  />
                </svg>
              </span>
              
              <span className="relative z-10">{item.label}</span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="px-4 py-2">
          <div className={`p-1 rounded-xl ${theme === 'dark' ? 'bg-[#151520]' : 'bg-gray-100'}`}>
            <button 
              onClick={onToggleTheme}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:bg-white/5' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <svg className="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Light Mode</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>Dark Mode</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className={`p-4 mx-4 mb-4 rounded-2xl glass-card border ${
          theme === 'dark' ? 'border-[#151520]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            {/* Avatar with glow */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                {user.username[0].toUpperCase()}
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a12] animate-pulse"></span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            
            <button 
              onClick={onLogout} 
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
              title="Logout"
            >
              <svg className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-3 ${
        theme === 'dark' 
          ? 'bg-[#0a0a12]/95 border-t border-[#151520]' 
          : 'bg-white/95 border-t border-gray-200'
      } backdrop-blur-xl`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${
              currentView === item.id 
                ? 'text-indigo-500' 
                : 'text-gray-400'
            }`}
          >
            <div className={`relative ${currentView === item.id ? 'icon-glow' : ''}`}>
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={item.icon}
                  className={currentView === item.id ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : ''}
                />
              </svg>
              {currentView === item.id && (
                <span className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-sm -z-10"></span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-0 overflow-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className={mounted ? 'animate-fade-in-up' : ''}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

