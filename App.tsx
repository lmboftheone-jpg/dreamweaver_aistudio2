import React, { useState, useEffect } from 'react';
import { View, Story } from './types';
import { MOCK_STORIES } from './constants';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Library from './components/Library';
import Creator from './components/Creator';
import StoryReader from './components/StoryReader';
import Settings from './components/Settings';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [userStories, setUserStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('dreamweave_stories');
      return saved ? JSON.parse(saved) : MOCK_STORIES;
    } catch (e) {
      console.error("Failed to load stories", e);
      return MOCK_STORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dreamweave_stories', JSON.stringify(userStories));
    } catch (e) {
      console.error("Failed to save stories", e);
    }
  }, [userStories]);

  const navigate = (view: View, story?: Story) => {
    setCurrentView(view);
    if (story) setSelectedStory(story);
    window.scrollTo(0, 0);
  };

  const handleStoryComplete = (newStory: Story) => {
    setUserStories([newStory, ...userStories]);
    navigate(View.Library);
  };

  const handleDeleteStory = (storyId: string) => {
    if (window.confirm("Are you sure you want to delete this story? This magic cannot be undone.")) {
      setUserStories(prev => prev.filter(s => s.id !== storyId));
      if (selectedStory?.id === storyId) {
        setSelectedStory(null);
        setCurrentView(View.Library);
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 selection:bg-primary/20">
        <Navbar currentView={currentView} onNavigate={navigate} />

        <main className="pt-24 pb-12">
          {currentView === View.Home && <Landing onStart={() => navigate(View.Create)} />}

          {currentView === View.Library && (
            <Library
              stories={userStories}
              onSelectStory={(story) => navigate(View.Reader, story)}
              onDeleteStory={handleDeleteStory}
            />
          )}

          {currentView === View.Create && <Creator onComplete={handleStoryComplete} />}

          {currentView === View.Reader && selectedStory && (
            <StoryReader
              story={selectedStory}
              onClose={() => navigate(View.Library)}
            />
          )}

          {currentView === View.Settings && <Settings />}
        </main>

        <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 DreamWeave Tales. Weaving magic into every page.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
