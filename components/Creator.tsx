import React, { useState, useEffect, useCallback } from 'react';
import { ART_STYLES, VOICES } from '../lib/constants';
import { generateStoryDraft, generateIllustration, generateSpeech, ImageInfo } from '../services/geminiService';
import { Story, StoryPage } from '../types';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

import PromptEditor from './creator/PromptEditor';
import StoryboardViewer from './creator/StoryboardViewer';
import AssetManager from './creator/AssetManager';
import CharacterBank from './CharacterBank';
import LoadingSkeleton from './ui/LoadingSkeleton';

interface Version {
  id: string;
  timestamp: string;
  prompt: string;
  style: string;
  isBranching: boolean;
  authorName: string;
  actionType: 'edit' | 'weave' | 'branch';
}

interface CreatorProps {
  onComplete: (story: Story) => void;
  userId?: string;
  initialPrompt?: string;
}

const Creator: React.FC<CreatorProps> = ({ onComplete, userId, initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [selectedStyle, setSelectedStyle] = useState(ART_STYLES[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [isBranching, setIsBranching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState('');

  // Personalization Assets
  const [heroImage, setHeroImage] = useState<ImageInfo | null>(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null);
  const [heroDescription, setHeroDescription] = useState<string>(''); // Text-based character ref
  const [threeDModelUrl, setThreeDModelUrl] = useState<string | null>(null);
  const [voiceSample, setVoiceSample] = useState<string | null>(null); // Base64 audio sample for cloning

  // Collaboration & History State
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [versionHistory, setVersionHistory] = useState<Version[]>([]);
  const [activeTab, setActiveTab] = useState<'prompt' | 'characters' | 'assets' | 'history' | 'storyboard'>('prompt');

  // Preview State (Draft Data)
  const [previewDraft, setPreviewDraft] = useState<Partial<Story> | null>(null);
  const [generatedCoverUrl, setGeneratedCoverUrl] = useState<string>('');
  const [isRegeneratingCover, setIsRegeneratingCover] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [regeneratingPageId, setRegeneratingPageId] = useState<string | null>(null);

  // Audio Preview Logic
  const { play, stop, isPlaying } = useAudioPlayer();
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);

  const handlePreviewVoice = async () => {
    if (isPlaying || isPreviewingVoice) {
      stop();
      return;
    }
    setIsPreviewingVoice(true);
    try {
      const audioData = await generateSpeech(`Hello! I am ${selectedVoice.name}. I will be your storyteller today.`, selectedVoice.id);
      if (audioData) {
        await play(audioData);
      }
    } catch (err) {
      console.error("Voice preview failed:", err);
    } finally {
      setIsPreviewingVoice(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (isCollaborative && !inviteLink) {
      const randomId = Math.random().toString(36).substring(7);
      setInviteLink(`${window.location.origin}/weave/${randomId}`);
    }
  }, [isCollaborative, inviteLink]);

  const saveVersion = (type: Version['actionType'] = 'edit', author: string = 'You') => {
    if (!prompt.trim()) return;
    const newVersion: Version = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      prompt,
      style: selectedStyle.name,
      isBranching,
      authorName: author,
      actionType: type
    };
    setVersionHistory(prev => [newVersion, ...prev]);
  };

  const buildCoverPrompt = (title: string, content: string, heroDesc?: string) => {
    const summary = content.substring(0, 150) + "...";
    const basePrompt = `Masterpiece Professional Book Cover Art for the story: "${title.toUpperCase()}". 
    Scene Essence: ${summary}`;

    const narrativeContext = isBranching
      ? "Interactive Adventure Gamebook Cover, Dynamic Composition with multiple paths visual hint."
      : "Classic Children's Storybook Cover.";

    const styleContext = `Art Style: ${selectedStyle.prompt}.`;
    const characterContext = heroDesc
      ? `Main Character: ${heroDesc}. Ensure the character on cover MATCHES this description perfectly.`
      : "Featuring the main character.";

    return `${basePrompt} ${narrativeContext} ${styleContext} ${characterContext} No text overlays. High resolution, 8k.`;
  };

  const handleCharacterSelect = (char: { name: string, description: string }) => {
    setHeroDescription(`${char.name}: ${char.description}`);
    alert(`Selected ${char.name} as the main character!`);
  };

  const handleRegenerateCover = async () => {
    if (!previewDraft || !previewDraft.pages?.length) return;
    setIsRegeneratingCover(true);
    try {
      const coverArtPrompt = buildCoverPrompt(
        previewDraft.title || "The Unwritten Tale",
        previewDraft.pages[0].content,
        // Prioritize heroDescription from Bank, fallback to uploaded image logic if needed (though API uses heroDescription string mainly for context)
        heroDescription || (previewDraft.heroDescription)
      );
      // Ensure we pass heroDescription for consistency
      const coverArt = await generateIllustration(coverArtPrompt, selectedStyle.prompt, heroDescription || previewDraft.heroDescription);
      if (coverArt && coverArt.startsWith('data:image')) {
        setGeneratedCoverUrl(coverArt);
      } else {
        throw new Error("Invalid image response");
      }
    } catch (err) {
      console.warn("Cover regeneration failed.", err);
    } finally {
      setIsRegeneratingCover(false);
    }
  };

  const handleRegeneratePageImage = async (pageId: string) => {
    if (!previewDraft?.pages) return;
    const page = previewDraft.pages.find(p => p.id === pageId);
    if (!page) return;

    setRegeneratingPageId(pageId);
    try {
      // Use active heroDescription
      const newIllustration = await generateIllustration(page.content, selectedStyle.prompt, heroDescription || previewDraft.heroDescription);
      const updatedPages = previewDraft.pages.map(p =>
        p.id === pageId ? { ...p, illustrationUrl: newIllustration } : p
      );
      setPreviewDraft({ ...previewDraft, pages: updatedPages });
    } catch (err) {
      console.error("Failed to re-paint page:", err);
    } finally {
      setRegeneratingPageId(null);
    }
  };

  const handleUpdatePageContent = (pageId: string, newContent: string) => {
    if (!previewDraft?.pages) return;
    const updatedPages = previewDraft.pages.map(p =>
      p.id === pageId ? { ...p, content: newContent } : p
    );
    setPreviewDraft({ ...previewDraft, pages: updatedPages });
  };

  const handleWeave = async () => {
    if (!prompt.trim()) return;
    saveVersion('weave');
    setIsGenerating(true);
    setGenStep(heroImage ? 'Analyzing hero appearance...' : 'Weaving story threads...');

    // Inject Character Context into prompt if exists
    let finalPrompt = prompt;
    if (heroDescription) {
      finalPrompt += `\n\nIMPORTANT: The main character is ${heroDescription}. Ensure they are consistent.`;
    }

    const specializedPrompt = isBranching
      ? `START BRANCHING STORY: ${finalPrompt}. MANDATORY: Page 1 must have interactive choices.`
      : finalPrompt;

    try {
      // Pass heroImage OR undefined. Note: generateStoryDraft might need updating to take heroDescription explicitly if it doesn't already, 
      // but for now we bake it into prompt. Ideally we pass it separately if the API supports it.
      // Current API takes: (prompt, style, isBranching, heroImage)
      const draft = await generateStoryDraft(specializedPrompt, selectedStyle.name, isBranching, heroImage || undefined);

      // Store the active hero description in the draft for future reference (regeneration)
      if (heroDescription) {
        draft.heroDescription = heroDescription;
      }

      setGenStep('Painting opening scene...');
      const firstPage = draft.pages?.[0] as StoryPage;

      if (firstPage) {
        let firstPageIllustration = "https://picsum.photos/seed/fallback/800/800";
        try {
          firstPageIllustration = await generateIllustration(firstPage.content, selectedStyle.prompt, draft.heroDescription || heroDescription);
        } catch (illErr) {
          console.warn("Page 1 illustration failed", illErr);
        }

        if (draft.pages) draft.pages[0].illustrationUrl = firstPageIllustration;
        setPreviewDraft(draft);
        setActiveTab('storyboard'); // Removed 'characters' tab auto-switch, stick to storyboard flow

        setGenStep('Painting majestic cover art...');
        let coverUrl = firstPageIllustration;
        try {
          const coverArtPrompt = buildCoverPrompt(draft.title || "The Unwritten Tale", firstPage.content, draft.heroDescription || heroDescription);
          const coverArt = await generateIllustration(coverArtPrompt, selectedStyle.prompt, draft.heroDescription || heroDescription);
          if (coverArt && coverArt.startsWith('data:image')) {
            coverUrl = coverArt;
          }
        } catch (coverErr) {
          console.warn("Cover art generation failed.", coverErr);
        }
        setGeneratedCoverUrl(coverUrl);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "The weave was interrupted.");
    } finally {
      setIsGenerating(false);
      setGenStep('');
    }
  };

  const finalizeStory = () => {
    if (!previewDraft || !previewDraft.pages?.length) return;
    const newStory: Story = {
      id: Date.now().toString(),
      title: previewDraft.title || "Untitled Adventure",
      author: previewDraft.author || "DreamWeaver",
      artStyle: selectedStyle.id,
      voiceId: selectedVoice.id,
      heroDescription: previewDraft.heroDescription || heroDescription,
      coverUrl: generatedCoverUrl || previewDraft.pages[0].illustrationUrl || selectedStyle.imageUrl,
      isBranching,
      createdAt: new Date().toISOString().split('T')[0],
      pages: (previewDraft.pages as StoryPage[]) || [],
      threeDModelUrl: threeDModelUrl || undefined
    };
    onComplete(newStory);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setHeroImage({ data: base64, mimeType: file.type });
        setHeroPreviewUrl(reader.result as string);
        // Clear text description if image is uploaded to avoid conflict? Or keep both?
        // Let's keep both but maybe image takes precedence in API logic if both passed.
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragStart = (index: number) => setDraggedIndex(index);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (index: number) => {
    if (draggedIndex === null || !previewDraft?.pages) return;
    const newPages = [...previewDraft.pages];
    const [movedItem] = newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, movedItem);
    const reindexed = newPages.map((p, i) => ({ ...p, pageNumber: i + 1 }));
    setPreviewDraft({ ...previewDraft, pages: reindexed });
    setDraggedIndex(null);
  };

  if (isGenerating) {
    return <LoadingSkeleton step={genStep} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-black tracking-tight">
              {previewDraft ? previewDraft.title : "Create Your Adventure"}
            </h2>
          </div>
          <p className="text-gray-500">
            {previewDraft ? `Woven by ${previewDraft.author}` : "Personalized 10-page stories with AI vision and creativity."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-8">
          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Art Style</label>
            <div className="grid grid-cols-2 gap-2">
              {ART_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedStyle.id === style.id ? 'border-primary ring-4 ring-primary/10' : 'border-transparent'}`}
                >
                  <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white p-2 text-center transition-opacity ${selectedStyle.id === style.id ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-[10px] font-bold uppercase">{style.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Narration Voice</label>
              <button
                onClick={handlePreviewVoice}
                disabled={isPreviewingVoice}
                className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-xs ${isPreviewingVoice ? 'animate-spin' : ''}`}>
                  {isPreviewingVoice ? 'settings_voice' : (isPlaying ? 'stop_circle' : 'play_circle')}
                </span>
                {isPlaying ? 'Stop' : 'Preview'}
              </button>
            </div>
            <div className="relative group">
              <select
                value={selectedVoice.id}
                onChange={(e) => {
                  const voice = VOICES.find(v => v.id === e.target.value);
                  if (voice) setSelectedVoice(voice);
                }}
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary appearance-none font-bold text-sm cursor-pointer shadow-sm transition-all"
              >
                {VOICES.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.desc}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                <span className="material-symbols-outlined text-xl">{selectedVoice.icon}</span>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic px-2">Chosen: {selectedVoice.desc}</p>
          </section>

          <section className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Story Mode</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsBranching(false)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${!isBranching ? 'bg-primary/5 border-primary text-primary' : 'border-gray-100 dark:border-gray-800'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">trending_flat</span>
                  <span className="font-bold">Linear Tale</span>
                </div>
              </button>
              <button
                onClick={() => setIsBranching(true)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isBranching ? 'bg-primary/5 border-primary text-primary' : 'border-gray-100 dark:border-gray-800'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">call_split</span>
                  <span className="font-bold">Branching Paths</span>
                </div>
              </button>
            </div>
          </section>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[600px]">
            <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-2 gap-2">
              <button onClick={() => setActiveTab('prompt')} className={`flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'prompt' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <span className="material-symbols-outlined text-lg">edit_note</span> Prompt
              </button>
              <button onClick={() => setActiveTab('characters')} className={`flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'characters' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <span className="material-symbols-outlined text-lg">person_add</span> Characters
              </button>
              <button
                onClick={() => setActiveTab('storyboard')}
                className={`flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'storyboard' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <span className="material-symbols-outlined text-lg">view_carousel</span> Storyboard
              </button>
              <button onClick={() => setActiveTab('assets')} className={`flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'assets' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <span className="material-symbols-outlined text-lg">photo_camera</span> Assets
              </button>
            </div>

            <div className="flex-grow p-8">
              {activeTab === 'prompt' && (
                <PromptEditor
                  prompt={prompt}
                  setPrompt={setPrompt}
                  heroPreviewUrl={heroPreviewUrl}
                  onHeroImageUpload={handleImageUpload}
                  onRemoveHeroImage={() => { setHeroImage(null); setHeroPreviewUrl(null); setHeroDescription(''); }}
                  isBranching={isBranching}
                  setIsBranching={setIsBranching}
                  isCollaborative={isCollaborative}
                  setIsCollaborative={setIsCollaborative}
                  inviteLink={inviteLink}
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                />
              )}

              {activeTab === 'characters' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Character Bank</h3>
                  <p className="text-xs text-gray-500">Select a character to ensure they appear consistently in your story.</p>
                  <CharacterBank onSelect={handleCharacterSelect} />
                  {heroDescription && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
                      <p className="text-xs font-bold text-primary uppercase mb-1">Active Hero</p>
                      <p className="text-sm font-medium">{heroDescription}</p>
                      <button onClick={() => setHeroDescription('')} className="text-xs text-red-500 mt-2 underline">Clear Selection</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'storyboard' && (
                !previewDraft ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                    <span className="material-symbols-outlined text-6xl">book_2</span>
                    <p className="font-bold text-lg">No story woven yet</p>
                    <p className="text-xs max-w-[240px] text-center opacity-70">Describe your adventure in the Prompt tab and click 'Weave' to generate your storyboard.</p>
                  </div>
                ) : (
                  <StoryboardViewer
                    previewDraft={previewDraft}
                    setPreviewDraft={setPreviewDraft}
                    generatedCoverUrl={generatedCoverUrl}
                    isRegeneratingCover={isRegeneratingCover}
                    onRegenerateCover={handleRegenerateCover}
                    onFinalizeStory={finalizeStory}
                    regeneratingPageId={regeneratingPageId}
                    onRegeneratePageImage={handleRegeneratePageImage}
                    onUpdatePageContent={handleUpdatePageContent}
                    draggedIndex={draggedIndex}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    isBranching={isBranching}
                    onComplete={onComplete}
                    isGenerating={isGenerating}
                  />
                )
              )}

              {activeTab === 'assets' && (
                <AssetManager
                  heroImage={heroImage}
                  setHeroImage={setHeroImage}
                  heroPreviewUrl={heroPreviewUrl}
                  setHeroPreviewUrl={setHeroPreviewUrl}
                  onHeroImageUpload={handleImageUpload}
                  threeDModelUrl={threeDModelUrl}
                  setThreeDModelUrl={setThreeDModelUrl}
                  selectedVoice={selectedVoice}
                  setSelectedVoice={setSelectedVoice}
                  handlePreviewVoice={handlePreviewVoice}
                  isPlayingVoice={isPlaying || isPreviewingVoice}
                  voiceSample={voiceSample}
                  setVoiceSample={setVoiceSample}
                />
              )}
            </div>

            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end items-center gap-4">
              <button
                onClick={handleWeave}
                data-testid="weave-button"
                disabled={!prompt.trim() || isGenerating}
                className="h-16 px-10 bg-primary text-white font-black text-lg rounded-full shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <span>{previewDraft ? 'Re-weave Adventure' : 'Weave Adventure'}</span>
                <span className="material-symbols-outlined">{previewDraft ? 'refresh' : 'auto_awesome'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creator;
