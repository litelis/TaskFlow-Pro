import React, { useState, useEffect } from 'react';
import { User, Task } from '../types';
import { storageService } from '../services/storageService';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
  tasks?: Task[];
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, tasks = [] }) => {
  const [webhook, setWebhook] = useState(user.discordWebhookUrl || '');
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  
  // Cloud sync state
  const [cloudEmail, setCloudEmail] = useState('');
  const [cloudPassword, setCloudPassword] = useState('');
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudError, setCloudError] = useState('');

  useEffect(() => {
    setWebhook(user.discordWebhookUrl || '');
  }, [user]);

  const handleSave = () => {
    onUpdateUser({ ...user, discordWebhookUrl: webhook });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSyncToCloud = async () => {
    if (!user.cloudEnabled) {
      setSyncMessage('Cloud sync is not enabled. Please login with cloud mode.');
      return;
    }
    
    setSyncing(true);
    setSyncMessage('');
    
    try {
      const result = await storageService.syncWithCloud(user, tasks);
      if (result.success) {
        setSyncMessage('✅ Tasks synced successfully!');
        onUpdateUser({ ...user, lastSyncedAt: new Date().toISOString() });
      } else {
        setSyncMessage(`❌ Sync failed: ${result.error}`);
      }
    } catch (error) {
      setSyncMessage('❌ Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleEnableCloud = async () => {
    if (!cloudEmail || !cloudPassword) {
      setCloudError('Please enter email and password');
      return;
    }
    
    setCloudLoading(true);
    setCloudError('');
    
    try {
      const result = await storageService.enableCloudSync(user, cloudEmail, cloudPassword);
      if (result.success && result.user) {
        onUpdateUser(result.user);
        setCloudError('');
        // Initial sync
        await handleSyncToCloud();
      } else {
        setCloudError(result.error || 'Failed to enable cloud sync');
      }
    } catch (error) {
      setCloudError('Failed to connect to cloud');
    } finally {
      setCloudLoading(false);
    }
  };

  const handleDisableCloud = () => {
    const updatedUser = storageService.disableCloudSync(user);
    onUpdateUser(updatedUser);
    setCloudEmail('');
    setCloudPassword('');
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div className="text-center relative">
        <h2 className="text-4xl font-extrabold text-gradient">Settings</h2>
        <p className="text-gray-400 mt-2">Manage your account and integrations</p>
        
        {/* Sync Status Badge */}
        {user.cloudEnabled && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-cyan-300 text-sm font-medium">Cloud Sync Active</span>
            {user.lastSyncedAt && (
              <span className="text-gray-500 text-xs">
                • Last sync: {new Date(user.lastSyncedAt).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 futuristic-card">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Profile Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{user.username}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {user.cloudEnabled ? (
                    <span className="text-xs text-cyan-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/></svg>
                      Cloud Account
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7"/></svg>
                      Local Account
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Sync Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 futuristic-card">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            Cloud Sync
          </h3>
          
          {!user.cloudEnabled ? (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Enable cloud sync to access your tasks from any device.</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={cloudEmail}
                  onChange={(e) => setCloudEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl futuristic-input text-white placeholder-gray-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={cloudPassword}
                  onChange={(e) => setCloudPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl futuristic-input text-white placeholder-gray-500"
                />
              </div>
              {cloudError && <p className="text-red-400 text-sm">{cloudError}</p>}
              <button
                onClick={handleEnableCloud}
                disabled={cloudLoading}
                className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
              >
                {cloudLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Enable Cloud Sync
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-300 font-medium">Cloud Sync Enabled</span>
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                </div>
                <p className="text-gray-400 text-sm">Your tasks are automatically synced to the cloud.</p>
              </div>
              
              {syncMessage && (
                <div className={`p-4 rounded-2xl text-sm ${syncMessage.includes('✅') ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                  {syncMessage}
                </div>
              )}
              
              <button
                onClick={handleSyncToCloud}
                disabled={syncing}
                className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10"
              >
                {syncing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Now
                  </>
                )}
              </button>
              
              <button
                onClick={handleDisableCloud}
                className="w-full py-2 text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                Disable Cloud Sync
              </button>
            </div>
          )}
        </div>

        {/* NVIDIA API Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 futuristic-card">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.25l7.5 4.5v9l-7.5 4.5-7.5-4.5v-9l7.5-4.5z"/>
              </svg>
            </div>
            NVIDIA AI
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Enter your NVIDIA API Key for AI features. Get your FREE key at{' '}
            <a href="https://build.nvidia.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              build.nvidia.com
            </a>
          </p>
          <div className="space-y-3">
            <input
              className="w-full px-4 py-3 rounded-xl futuristic-input text-white placeholder-gray-500"
              placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxx"
              value={localStorage.getItem('nvidia_api_key') || ''}
              onChange={(e) => localStorage.setItem('nvidia_api_key', e.target.value)}
            />
            <button
              onClick={() => {
                const key = localStorage.getItem('nvidia_api_key');
                if (key) {
                  sessionStorage.setItem('nvidia_api_key', key);
                  alert('API Key configured! The AI features are now enabled.');
                } else {
                  alert('Please enter a valid API Key first.');
                }
              }}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Save & Enable AI
            </button>
          </div>
        </div>

        {/* Discord Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 futuristic-card">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
              </svg>
            </div>
            Discord
          </h3>
          <p className="text-gray-400 text-sm mb-4">Get notified about deadlines directly in Discord.</p>
          <div className="space-y-3">
            <input
              className="w-full px-4 py-3 rounded-xl futuristic-input text-white placeholder-gray-500"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
            />
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              {saved ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Webhook
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

