import React, { useState, useEffect } from 'react';
import Navbar from './layout/Navbar';
import Landing from './views/Landing';
import Library from './views/Library';
import Creator from './Creator';
import StoryReader from './reader/StoryReader';
import Settings from './views/Settings';
import ErrorBoundary from './layout/ErrorBoundary';
import Community from './views/Community';
import CollaborationRoom from './views/CollaborationRoom';
import CIDashboard from './views/CIDashboard';
import { View, Story } from '../types';
import { MOCK_STORIES } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { supabase } from '../lib/supabaseClient';
import { gamificationService } from '../services/gamificationService'; // Gamification
import { UserStats, Challenge } from '../types'; // Gamification types
import StreakCounter from './gamification/StreakCounter';
import ChallengeCard from './gamification/ChallengeCard';
import Marketplace from './marketplace/Marketplace'; // Load lazy if needed
import PrintOrderModal from './marketplace/PrintOrderModal';
import { marketplaceService } from '../services/marketplaceService';

const ClientApp: React.FC = () => {
  const { user, login } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Gamification State
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challengePrompt, setChallengePrompt] = useState<string | null>(null);

  // Marketplace State
  const [showPODModal, setShowPODModal] = useState(false);
  const [podStory, setPodStory] = useState<Story | null>(null);

  // State
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [publicStories, setPublicStories] = useState<Story[]>(MOCK_STORIES);

  // Load Stories
  useEffect(() => {
    const loadStories = async () => {
      // 1. Load User Stories
      if (user && supabase) {
        const stories = await dbService.getUserStories(user.id);
        setUserStories(stories.length > 0 ? stories : []); // If empty, empty.
      } else {
        // Fallback to local storage
        try {
          const saved = localStorage.getItem('dreamweave_stories');
          if (saved) setUserStories(JSON.parse(saved));
          else setUserStories(MOCK_STORIES); // Only for demo default
        } catch (e) {
          console.error("Local load failed", e);
        }
      }

      // 2. Load Public Stories
      if (supabase) {
        const publicData = await dbService.getPublicStories();
        // Merge with MOCK for demo richness if DB is empty
        setPublicStories(publicData.length > 0 ? publicData : MOCK_STORIES);
      }
    };

    loadStories();

    // Load Gamification Data
    if (user) {
      gamificationService.updateActivity(user.id).then(stats => {
        if (stats) setUserStats(stats);
      });

      gamificationService.getActiveChallenge().then(challenge => {
        setActiveChallenge(challenge);
      });
    }
  }, [user]);

  const handleJoinChallenge = (prompt: string) => {
    setChallengePrompt(prompt);
    setCurrentView(View.Create);
  };

  // Sync to LocalStorage as backup (or if using fallback)
  useEffect(() => {
    if (!supabase) {
      localStorage.setItem('dreamweave_stories', JSON.stringify(userStories));
    }
  }, [userStories]);

  useEffect(() => {
    // Listen for POD orders from Library
    const handleOpenPOD = (e: any) => {
      setPodStory(e.detail);
      setShowPODModal(true);
    };
    window.addEventListener('open-pod-modal', handleOpenPOD);
    return () => window.removeEventListener('open-pod-modal', handleOpenPOD);
  }, []);

  const handlePrintOrder = async (address: string) => {
    if (!podStory || !user) return;

    const success = await marketplaceService.createPrintOrder(user.id, podStory.id, address);
    if (success) {
      alert("Order placed successfully! Tracking info will be sent shortly.");
      setShowPODModal(false);
      setPodStory(null);
    } else {
      alert("Failed to place order. Please try again.");
    }
  };

  const navigate = (view: View, story?: Story) => {
    // Route Protection
    if ((view === View.Library || view === View.Create || view === View.Settings) && !user) {
      if (confirm("You need to sign in to access this feature. Sign in now?")) {
        login();
      }
      return;
    }

    setCurrentView(view);
    if (story) setSelectedStory(story);
    window.scrollTo(0, 0);
  };

  const handleStoryComplete = async (newStory: Story) => {
    setUserStories([newStory, ...userStories]);
    if (user) {
      await dbService.upsertStory(newStory, user.id);
      await gamificationService.incrementStoryCount(user.id);

      // Refresh stats to show new achievements immediately
      const stats = await gamificationService.getUserStats(user.id);
      if (stats) setUserStats(stats);

      const { unlocked } = await gamificationService.getAchievements(user.id);
      // In a real app, we'd compare with previous unlocked to show a toast
    }
    navigate(View.Library);
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm("Are you sure you want to delete this story? This magic cannot be undone.")) {
      setUserStories(prev => prev.filter(s => s.id !== storyId));
      if (selectedStory?.id === storyId) {
        setSelectedStory(null);
        setCurrentView(View.Library);
      }
      if (user) await dbService.deleteStory(storyId);
    }
  };

  const handleImportStory = async (story: Story) => {
    if (userStories.some(s => s.id === story.id)) {
      alert("You already have this story in your library.");
      return;
    }
    const importedStory = { ...story, importedAt: new Date().toISOString() };
    setUserStories([importedStory, ...userStories]);
    if (user) await dbService.upsertStory(importedStory, user.id);
    alert("Story saved to your library!");
  };

  const handlePublishStory = async (story: Story) => {
    const updatedStory = { ...story, isPublic: !story.isPublic };
    // Optimistic update
    setUserStories(prev => prev.map(s => s.id === story.id ? updatedStory : s));

    if (user) {
      await dbService.upsertStory(updatedStory, user.id);
      // Refresh public stories
      const publicData = await dbService.getPublicStories();
      setPublicStories(prev => publicData.length > 0 ? publicData : prev);
    }

    alert(updatedStory.isPublic ? "Story published to Community!" : "Story removed from Community.");
  };

  const handleUpdateStory = async (updatedStory: Story) => {
    setSelectedStory(updatedStory);
    setUserStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
    if (user) await dbService.upsertStory(updatedStory, user.id);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 selection:bg-primary/20">
        <Navbar currentView={currentView} onNavigate={navigate} />

        <main className="pt-24 pb-12">
          {currentView === View.Home && <Landing onStart={() => navigate(View.Create)} onExplore={() => navigate(View.Gallery)} />}



          {currentView === View.Library && (
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary">library_books</span>
                    Your Story Library
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your collection of magical tales</p>
                </div>
                {userStats && <StreakCounter days={userStats.currentStreak} />}
              </div>

              {activeChallenge && (
                <ChallengeCard challenge={activeChallenge} onJoin={handleJoinChallenge} />
              )}

              <Library
                stories={userStories}
                onSelectStory={(story) => navigate(View.Reader, story)}
                onDeleteStory={handleDeleteStory}
                onPublishStory={handlePublishStory}
              />
            </div>
          )}

          {currentView === View.Gallery && (
            <Community
              userStories={publicStories}
              onReadStory={(story) => navigate(View.Reader, story)}
              onImportStory={handleImportStory}
            />
          )}

          {currentView === View.Create && (
            <Creator
              onComplete={handleStoryComplete}
              initialPrompt={challengePrompt || ''}
              userId={user?.id}
            />
          )}

          {currentView === View.Reader && selectedStory && (
            <StoryReader
              story={selectedStory}
              onClose={() => navigate(View.Library)}
              onUpdateStory={handleUpdateStory}
            />
          )}

          {currentView === View.Marketplace && <Marketplace />}

          {showPODModal && podStory && (
            <PrintOrderModal
              storyTitle={podStory.title}
              onConfirm={handlePrintOrder}
              onCancel={() => setShowPODModal(false)}
            />
          )}

          {currentView === View.Settings && <Settings />}

          {currentView === View.Collaboration && (
            <CollaborationRoom onBack={() => navigate(View.Home)} />
          )}

          {currentView === View.CIDashboard && <CIDashboard />}
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


export default ClientApp;
