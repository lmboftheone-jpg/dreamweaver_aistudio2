import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Story, StoryPage, Choice } from '../../types';
import { generateIllustration, generateSpeech } from '../../services/geminiService';
import { ART_STYLES } from '../../lib/constants';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StoryDocument from './pdf/StoryDocument';

interface StoryReaderProps {
  story: Story;
  onClose: () => void;
  onUpdateStory: (story: Story) => void;
}

import StoryVR from '../vr/StoryVR';

const StoryReader: React.FC<StoryReaderProps> = ({ story, onClose, onUpdateStory }) => {
  const [isVRMode, setIsVRMode] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<string>(story.pages[0]?.id || "");
  const [pages, setPages] = useState<StoryPage[]>(story.pages);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const { play, stop, togglePause, isPlaying, isPaused, getAudioContext } = useAudioPlayer();

  const currentPage = pages.find(p => p.id === currentPageId) || pages[0];
  const artStyle = ART_STYLES.find(s => s.id === story.artStyle);

  if (isVRMode) {
    return <StoryVR story={story} onExit={() => setIsVRMode(false)} />;
  }
  const artStylePrompt = artStyle?.prompt || "";

  // Voice Mapping based on Style
  const getVoiceForStyle = (styleId: string) => {
    switch (styleId) {
      case 'surreal-dreamscape': return 'Aoide';
      case 'watercolor':
      case 'korean-traditional-art': return 'Lyra';
      case 'cyberpunk':
      case '3d-render': return 'Zephyr';
      case 'ghibli':
      case 'pixel-art': return 'Puck';
      case 'claymation': return 'Charon';
      case 'mythical-tapestry': return 'Orpheus';
      default: return 'Kore';
    }
  };

  const handleReadAloud = async () => {
    if (!currentPage) return;

    if (isPlaying && isPaused) {
      await togglePause();
      return;
    }

    if (isPlaying) {
      stop();
      // If we were playing, we just stop. If user wants to restart, they click again.
      return;
    }

    try {
      const voice = story.voiceId || getVoiceForStyle(story.artStyle);
      const base64Audio = await generateSpeech(currentPage.content, voice);
      if (base64Audio) {
        await play(base64Audio);
      }
    } catch (err) {
      console.error("Narration error:", err);
    }
  };

  // Procedural Sound Effects Engine (Foley)
  const playSfx = useCallback((type: 'page' | 'choice') => {
    // We use the shared context so suspending/resuming works globally
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    if (type === 'page') {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === 'choice') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  }, [getAudioContext]);

  const handleChoice = async (choice: Choice) => {
    stop();
    playSfx('choice');
    if (choice.leadsTo) {
      setIsGeneratingNext(true);
      setTimeout(() => {
        playSfx('page');
        setCurrentPageId(choice.leadsTo!);
        setIsGeneratingNext(false);
      }, 600);
    } else {
      alert("This path is still being woven by the Fates... Try another choice!");
    }
  };

  const loadIllustration = async () => {
    if (currentPage && !currentPage.illustrationUrl) {
      setIsGeneratingNext(true);
      try {
        const url = await generateIllustration(currentPage.content, artStylePrompt);
        const newPages = pages.map(p => p.id === currentPage.id ? { ...p, illustrationUrl: url } : p);
        setPages(newPages);
        onUpdateStory({ ...story, pages: newPages });
      } catch (e) {
        console.error("Illustration failed", e);
      } finally {
        setIsGeneratingNext(false);
      }
    }
  };

  useEffect(() => {
    // When page changes, ensure illustration is loaded and stop any previous narration
    if (currentPage && !currentPage.illustrationUrl) {
      loadIllustration();
    }
    stop();
  }, [currentPageId]);

  return (
    <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark flex flex-col">
      {/* Top Controls */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-background-dark z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => { stop(); onClose(); }} className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Exit Story</span>
          </button>
          <button
            onClick={() => setIsVRMode(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">view_in_ar</span>
            Enter VR
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold">{story.title}</h2>
          <p className="text-[10px] uppercase text-gray-400 tracking-widest">Woven by DreamWeave</p>
        </div>
        <div className="flex gap-4">
          <PDFDownloadLink
            document={<StoryDocument story={story} />}
            fileName={`${story.title.replace(/\s+/g, '_')}.pdf`}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {({ loading }) => (
              <span className="material-symbols-outlined text-gray-500">
                {loading ? 'hourglass_empty' : 'download'}
              </span>
            )}
          </PDFDownloadLink>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-gray-500">share</span>
          </button>
        </div>
      </header>

      {/* Main Reader View */}
      <div className="flex-grow flex flex-col md:flex-row p-4 md:p-12 gap-12 items-center justify-center max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Left: Illustration */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 relative group border-8 border-white dark:border-gray-900 ring-1 ring-gray-200 dark:ring-gray-700">
            {currentPage?.illustrationUrl ? (
              <img
                src={currentPage.illustrationUrl}
                alt="Illustration"
                className={`w-full h-full object-cover transition-all duration-1000 ${isGeneratingNext ? 'scale-110 blur-sm opacity-50' : 'scale-100 opacity-100'}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-400">
                <span className="material-symbols-outlined text-5xl animate-spin">brush</span>
                <p className="font-bold text-sm tracking-widest uppercase">Painting your world...</p>
              </div>
            )}
            {isGeneratingNext && (
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-white text-5xl animate-bounce">auto_awesome</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Text & Choices */}
        <div className="flex-1 w-full max-w-xl flex flex-col gap-10">
          <div className={`font-serif text-2xl md:text-4xl leading-relaxed dark:text-gray-100 transition-all duration-500 ${isGeneratingNext ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <span className="text-7xl font-black text-primary float-left mr-5 mt-2 drop-shadow-sm">
              {currentPage?.content.charAt(0)}
            </span>
            {currentPage?.content.slice(1)}
          </div>

          {/* Interaction Section */}
          <div className="pt-10 border-t border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Choose the weave</p>
            </div>

            <div className="flex flex-col gap-3">
              {currentPage?.choices?.length ? (
                currentPage.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    disabled={isGeneratingNext}
                    className="group flex items-center justify-between p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all text-left shadow-sm hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="font-bold text-lg">{choice.text}</span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center p-12 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/20 animate-in fade-in zoom-in">
                  <span className="material-symbols-outlined text-4xl text-primary mb-4">book_5</span>
                  <p className="font-black text-xl text-primary mb-2">The End of the Chapter</p>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">You've reached a peaceful resting point in this adventure.</p>
                  <button onClick={() => { stop(); onClose(); }} className="px-10 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">Explore New Tales</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <footer className="h-24 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl flex items-center justify-between px-10 z-10">
        <button
          onClick={() => {
            const idx = pages.findIndex(p => p.id === currentPageId);
            if (idx > 0) {
              stop();
              playSfx('page');
              setCurrentPageId(pages[idx - 1].id);
            }
          }}
          className="flex items-center gap-2 font-bold text-gray-400 hover:text-primary transition-colors disabled:opacity-20"
          disabled={pages.findIndex(p => p.id === currentPageId) === 0}
        >
          <span className="material-symbols-outlined">west</span>
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-4">
          {!isPlaying ? (
            <button
              onClick={handleReadAloud}
              className="flex items-center gap-3 px-8 h-14 rounded-full font-black text-sm transition-all shadow-lg bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/30"
              aria-label="Start Narration"
            >
              <span className="material-symbols-outlined">text_to_speech</span>
              <span>Read Aloud</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-primary/10 p-1.5 rounded-full border border-primary/20">
              <button
                onClick={togglePause}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-white hover:scale-110 active:scale-95 transition-all shadow-md"
                aria-label={isPaused ? "Resume Narration" : "Pause Narration"}
              >
                <span className="material-symbols-outlined">
                  {isPaused ? 'play_arrow' : 'pause'}
                </span>
              </button>
              <div className="px-2 flex flex-col items-start min-w-[80px]">
                <div className="flex gap-1 items-center h-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-0.5 bg-primary transition-all duration-300 ${!isPaused ? 'animate-bounce' : 'h-1 opacity-30'}`}
                      style={{
                        animationDelay: `${i * 100}ms`,
                        height: isPaused ? '4px' : `${4 + Math.random() * 8}px`
                      }}
                    ></div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {isPaused ? 'Paused' : 'Playing'}
                </span>
              </div>
              <button
                onClick={stop}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-500 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
                aria-label="Stop Narration"
              >
                <span className="material-symbols-outlined">stop</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            const idx = pages.findIndex(p => p.id === currentPageId);
            if (idx < pages.length - 1) {
              stop();
              playSfx('page');
              setCurrentPageId(pages[idx + 1].id);
            }
          }}
          className="flex items-center gap-2 font-bold text-gray-400 hover:text-primary transition-colors disabled:opacity-20"
          disabled={pages.findIndex(p => p.id === currentPageId) === pages.length - 1 || (currentPage?.choices?.length ?? 0) > 0}
        >
          <span className="hidden sm:inline">Skip</span>
          <span className="material-symbols-outlined">east</span>
        </button>
      </footer>
    </div>
  );
};

export default StoryReader;
