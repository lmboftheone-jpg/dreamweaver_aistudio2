import React, { useRef } from 'react';
import ModelViewer from '../ModelViewer';

interface AssetManagerProps {
    heroPreviewUrl: string | null;
    onHeroImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    threeDModelUrl: string | null;
}

const AssetManager: React.FC<AssetManagerProps> = ({
    heroPreviewUrl,
    onHeroImageUpload,
    threeDModelUrl
}) => {
    const imageInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-sm">Hero Photo Personalization</h3>
                    <div
                        onClick={() => imageInputRef.current?.click()}
                        className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${heroPreviewUrl ? 'border-primary' : 'border-gray-200 dark:border-gray-700 hover:bg-primary/5'}`}
                    >
                        {heroPreviewUrl ? (
                            <img src={heroPreviewUrl} className="w-full h-full object-cover rounded-[1.4rem]" alt="Hero Preview" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">add_a_photo</span>
                                <p className="text-xs font-bold text-gray-400">Upload a Photo</p>
                            </>
                        )}
                        <input type="file" ref={imageInputRef} onChange={onHeroImageUpload} accept="image/*" className="hidden" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-sm">3D Character Visualization</h3>
                    <div className="aspect-video rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                        <ModelViewer url={threeDModelUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetManager;
