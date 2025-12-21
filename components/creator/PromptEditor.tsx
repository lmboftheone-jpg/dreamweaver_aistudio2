import React, { useRef } from 'react';
import { PRESET_PROMPTS } from '../../constants';

interface PromptEditorProps {
    prompt: string;
    setPrompt: (value: string) => void;
    heroPreviewUrl: string | null;
    onHeroImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveHeroImage: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
    prompt,
    setPrompt,
    heroPreviewUrl,
    onHeroImageUpload,
    onRemoveHeroImage
}) => {
    const quickImageInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="relative">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Once upon a time, in a world made of candy..."
                    className="w-full p-0 bg-transparent border-none focus:ring-0 text-2xl font-medium leading-relaxed resize-none scrollbar-hide min-h-[200px]"
                />

                <div className="absolute bottom-0 right-0 flex items-center gap-4">
                    {heroPreviewUrl ? (
                        <div className="group relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary shadow-lg ring-4 ring-primary/10">
                            <img src={heroPreviewUrl} className="w-full h-full object-cover" alt="Hero" />
                            <button onClick={onRemoveHeroImage} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => quickImageInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary transition-all text-gray-500 hover:text-primary">
                            <span className="material-symbols-outlined text-lg">add_a_photo</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Personalize Hero</span>
                        </button>
                    )}
                    <input type="file" ref={quickImageInputRef} onChange={onHeroImageUpload} accept="image/*" className="hidden" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRESET_PROMPTS.map((p, idx) => (
                    <button key={idx} onClick={() => setPrompt(p.text)} className="flex items-start gap-3 p-3 text-left bg-gray-50 dark:bg-gray-900 rounded-2xl border border-transparent hover:border-primary/30 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                            <span className="material-symbols-outlined text-lg">{p.icon}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold mb-0.5 truncate">{p.title}</p>
                            <p className="text-[10px] text-gray-500 line-clamp-1">{p.text}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PromptEditor;
