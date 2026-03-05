import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { cloudService } from '../services/cloudService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isCloudMode, setIsCloudMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number}>>([]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isCloudMode) {
        // Cloud mode
        if (isRegister) {
          const result = await cloudService.register(
            { email: formData.email, password: formData.password },
            formData.username
          );
          if (result.success && result.token) {
            const newUser: User = {
              id: crypto.randomUUID(),
              username: formData.username,
              email: formData.email,
              cloudEnabled: true,
              cloudToken: result.token,
              lastSyncedAt: new Date().toISOString()
            };
            storageService.saveUser(newUser);
            onLogin(newUser);
          } else {
            setError(result.error || 'Registration failed');
          }
        } else {
          const result = await cloudService.login({ email: formData.email, password: formData.password });
          if (result.success && result.user) {
            const existingUser = storageService.getUsers().find(u => u.email === formData.email);
            if (existingUser) {
              onLogin({ ...existingUser, cloudEnabled: true, cloudToken: result.token });
            } else {
              const newUser: User = {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                cloudEnabled: true,
                cloudToken: result.token,
                lastSyncedAt: new Date().toISOString()
              };
              storageService.saveUser(newUser);
              onLogin(newUser);
            }
          } else {
            setError(result.error || 'Login failed');
          }
        }
      } else {
        // Local mode (original behavior)
        if (isRegister) {
          const existing = storageService.getUsers().find(u => u.email === formData.email);
          if (existing) {
            setError('Email already exists');
            return;
          }
          const newUser: User = {
            id: crypto.randomUUID(),
            username: formData.username,
            email: formData.email
          };
          storageService.saveUser(newUser);
          onLogin(newUser);
        } else {
          const user = storageService.getUsers().find(u => u.email === formData.email);
          if (user) {
            onLogin(user);
          } else {
            setError('User not found. Try registering!');
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 futuristic-bg"></div>
      <div className="absolute inset-0 grid-bg"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-indigo-500/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 mb-6 animate-float">
            <span className="text-4xl font-extrabold">T</span>
          </div>
          <h1 className="text-5xl font-extrabold text-gradient tracking-tight">TaskFlow Pro</h1>
          <p className="text-gray-400 mt-3 text-lg">AI-Powered Productivity</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-2xl p-1 flex">
            <button
              onClick={() => setIsCloudMode(false)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${!isCloudMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                Local
              </span>
            </button>
            <button
              onClick={() => setIsCloudMode(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${isCloudMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Cloud
              </span>
            </button>
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-3 h-3 rounded-full ${isCloudMode ? 'bg-cyan-400' : 'bg-indigo-400'} animate-pulse`}></div>
            <h2 className="text-2xl font-bold text-white">
              {isCloudMode ? (isRegister ? 'Create Cloud Account' : 'Cloud Login') : (isRegister ? 'Create Local Account' : 'Welcome Back')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <input
                    required
                    className="w-full px-4 py-4 rounded-xl futuristic-input text-white placeholder-gray-500"
                    placeholder="Enter your name"
                    value={formData.username}
                    onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  className="w-full px-4 py-4 rounded-xl futuristic-input text-white placeholder-gray-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  className="w-full px-4 py-4 rounded-xl futuristic-input text-white placeholder-gray-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-bold rounded-2xl transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 ${isCloudMode ? 'futuristic-btn accent-btn' : 'futuristic-btn'}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400">
              {isRegister ? 'Already have an account?' : "New here?"}
              <button
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="ml-2 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>

          {isCloudMode && (
            <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-xs text-cyan-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cloud mode syncs your tasks across devices. Your data is encrypted and stored securely.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2026 TaskFlow Pro. {isCloudMode ? 'Powered by cloud sync.' : 'All data saved locally in your browser.'}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

