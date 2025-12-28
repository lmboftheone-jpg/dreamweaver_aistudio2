import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete ALL your stories and cannot be undone.")) {
      localStorage.removeItem('dreamweave_stories');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-black mb-8 tracking-tight">Settings</h2>

      <div className="space-y-12">
        <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Account Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase">Display Name</span>
              <input type="text" defaultValue="Alice Storyteller" className="h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-none px-4 focus:ring-2 focus:ring-primary font-bold" disabled />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase">Email</span>
              <input type="email" defaultValue="alice@dreamweave.tales" className="h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-none px-4 focus:ring-2 focus:ring-primary font-bold" disabled />
            </label>
          </div>
          <p className="text-xs text-gray-400 italic">User profile editing coming soon.</p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">settings_suggest</span>
            App Preferences
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Dark Mode</p>
                <p className="text-sm text-gray-400">Toggle the magical night theme.</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-14 h-8 rounded-full relative p-1 transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${isDarkMode ? 'left-[calc(100%-1.75rem)]' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between opacity-50 pointer-events-none">
              <div>
                <p className="font-bold">Narration Speed</p>
                <p className="text-sm text-gray-400">Adjust the pace of the storyteller's voice.</p>
              </div>
              <input type="range" className="w-32 accent-primary" disabled />
            </div>
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-8 border border-red-100 dark:border-red-900/50 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined">warning</span>
            Danger Zone
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-red-600 dark:text-red-400">Delete Local Library</p>
              <p className="text-sm text-red-400/70">Permanently remove all stories stored in this browser.</p>
            </div>
            <button
              onClick={handleClearData}
              className="px-6 py-3 bg-white dark:bg-red-900/40 text-red-600 font-bold rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/60 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
