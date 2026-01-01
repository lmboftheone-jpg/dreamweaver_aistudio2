
import React from 'react';
import { View } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, login, logout, isLoading } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate(View.Home)}
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">auto_stories</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">DreamWeave Tales</h1>
        </div>

        <nav className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={() => onNavigate(View.Gallery)}
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${currentView === View.Gallery ? 'text-primary font-bold' : ''}`}
          >
            Community
          </button>
          <button
            onClick={() => onNavigate(View.Marketplace)}
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${currentView === View.Marketplace ? 'text-primary font-bold' : ''}`}
          >
            Marketplace
          </button>
          <button
            onClick={() => onNavigate(View.Library)}
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${currentView === View.Library ? 'text-primary font-bold' : ''}`}
          >
            My Library
          </button>
          <button
            onClick={() => onNavigate(View.Create)}
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${currentView === View.Create ? 'text-primary font-bold' : ''}`}
          >
            Create
          </button>
          <button
            onClick={() => onNavigate(View.Collaboration)}
            className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${currentView === View.Collaboration ? 'text-primary font-bold' : ''}`}
          >
            Story Rooms
          </button>

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{user.name}</span>
                <span className="text-[10px] text-gray-500">{user.email}</span>
              </div>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
              )}
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => onNavigate(View.Settings)}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-2"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>

          <button
            onClick={() => onNavigate(View.CIDashboard)}
            className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-2 ${currentView === View.CIDashboard ? 'bg-primary text-white' : ''}`}
            title="State Engine Dashboard"
          >
            <span className="material-symbols-outlined text-xl">dns</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
