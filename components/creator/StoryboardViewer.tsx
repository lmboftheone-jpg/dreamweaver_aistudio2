import React from 'react';
import { Story, StoryPage } from '../../types';

interface StoryboardViewerProps {
    previewDraft: Partial<Story>;
    setPreviewDraft: (draft: Partial<Story> | null) => void;
    generatedCoverUrl: string;
    isRegeneratingCover: boolean;
    onRegenerateCover: () => void;
    onFinalizeStory: () => void;
    regeneratingPageId: string | null;
    onRegeneratePageImage: (pageId: string) => void;
    onUpdatePageContent: (pageId: string, content: string) => void;
    draggedIndex: number | null;
    onDragStart: (index: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (index: number) => void;
    isBranching: boolean;
}

const StoryboardViewer: React.FC<StoryboardViewerProps> = ({
    previewDraft,
    setPreviewDraft,
    generatedCoverUrl,
    isRegeneratingCover,
    onRegenerateCover,
    onFinalizeStory,
    regeneratingPageId,
    onRegeneratePageImage,
    onUpdatePageContent,
    draggedIndex,
    onDragStart,
    onDragOver,
    onDrop,
    isBranching
}) => {
    return (
        <div className="h-full overflow-y-auto max-h-[65vh] pr-4 hide-scrollbar">
            <div className="space-y-12 relative">
                {/* Vertical Magic Thread */}
                <div className="absolute left-[2.4rem] top-24 bottom-24 w-0.5 bg-gradient-to-b from-primary/5 via-primary/40 to-primary/5 border-l-2 border-dashed border-primary/20 pointer-events-none hidden md:block"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-16">
                    <div className="relative group aspect-square rounded-[2rem] overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                        <img src={generatedCoverUrl || (previewDraft.pages?.[0]?.illustrationUrl)} alt="Cover" className={`w-full h-full object-cover transition-all duration-700 ${isRegeneratingCover ? 'blur-sm scale-110' : ''}`} />
                        <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-black uppercase tracking-widest">Masterpiece Cover</div>
                        <button
                            onClick={onRegenerateCover}
                            disabled={isRegeneratingCover}
                            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-primary p-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-[10px] disabled:opacity-50"
                        >
                            <span className={`material-symbols-outlined text-lg ${isRegeneratingCover ? 'animate-spin' : ''}`}>refresh</span>
                            {isRegeneratingCover ? 'Painting...' : 'Regenerate Cover'}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black">{previewDraft.title}</h3>
                        <p className="text-sm italic leading-relaxed text-gray-500 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            {previewDraft.heroDescription}
                        </p>
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-4">
                            <button onClick={() => setPreviewDraft(null)} className="flex-1 h-12 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">Clear Story</button>
                            <button onClick={onFinalizeStory} className="flex-[2] h-12 bg-primary text-white rounded-full text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Save To Library</button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {previewDraft.pages?.map((page, index) => (
                        <div
                            key={page.id}
                            draggable
                            onDragStart={() => onDragStart(index)}
                            onDragOver={onDragOver}
                            onDrop={() => onDrop(index)}
                            className={`relative flex flex-col md:flex-row items-stretch gap-6 p-6 bg-white dark:bg-gray-800 rounded-[2rem] border transition-all cursor-move group ${draggedIndex === index ? 'opacity-30 scale-95 border-primary border-dashed' : 'border-gray-100 dark:border-gray-700 hover:border-primary/40 hover:shadow-2xl'}`}
                        >
                            {/* Sequence Marker */}
                            <div className="hidden md:flex flex-col items-center gap-2 mr-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-colors ${draggedIndex === index ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                    {page.pageNumber}
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">drag_indicator</span>
                            </div>

                            <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0 border border-gray-100 dark:border-gray-700 relative group/img">
                                {page.illustrationUrl ? (
                                    <img src={page.illustrationUrl} className={`w-full h-full object-cover transition-all duration-700 ${regeneratingPageId === page.id ? 'blur-sm scale-110' : ''}`} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <span className="material-symbols-outlined text-3xl animate-pulse">brush</span>
                                    </div>
                                )}

                                {/* Individual Page Illustration Control */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRegeneratePageImage(page.id); }}
                                        disabled={!!regeneratingPageId}
                                        className="p-3 bg-white/90 backdrop-blur-md rounded-full text-primary shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <span className={`material-symbols-outlined text-2xl ${regeneratingPageId === page.id ? 'animate-spin' : ''}`}>brush</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-grow flex flex-col justify-center">
                                <textarea
                                    value={page.content}
                                    onChange={(e) => onUpdatePageContent(page.id, e.target.value)}
                                    className="w-full p-4 bg-gray-50/50 dark:bg-gray-900/50 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl text-lg font-serif leading-relaxed italic resize-none"
                                    rows={3}
                                />
                                {isBranching && page.choices && page.choices.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {page.choices.map((c, i) => (
                                            <span key={i} className="text-[10px] font-bold px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full">
                                                Path: {c.text}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryboardViewer;
