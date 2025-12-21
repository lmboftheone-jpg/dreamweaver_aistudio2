
import React from 'react';

const Settings: React.FC = () => {
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
              <input type="text" defaultValue="Alice Storyteller" className="h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-none px-4 focus:ring-2 focus:ring-primary" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase">Email</span>
              <input type="email" defaultValue="alice@dreamweave.tales" className="h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border-none px-4 focus:ring-2 focus:ring-primary" />
            </label>
          </div>
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
                onClick={() => document.documentElement.classList.toggle('dark')}
                className="w-14 h-8 bg-primary rounded-full relative p-1 transition-colors"
              >
                <div className="w-6 h-6 bg-white rounded-full absolute right-1"></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Narration Speed</p>
                <p className="text-sm text-gray-400">Adjust the pace of the storyteller's voice.</p>
              </div>
              <input type="range" className="w-32 accent-primary" />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button className="px-8 py-3 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
