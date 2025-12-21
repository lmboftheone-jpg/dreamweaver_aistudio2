
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
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
            onClick={() => onNavigate(View.Settings)}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
