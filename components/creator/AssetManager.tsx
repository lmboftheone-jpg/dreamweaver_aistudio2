import React, { useRef } from 'react';
import ModelViewer from '../shared/ModelViewer';

interface AssetManagerProps {
    heroImage: any; // Using any for now to avoid import cycle or complex type if ImageInfo not exported
    setHeroImage: (image: any) => void;
    heroPreviewUrl: string | null;
    setHeroPreviewUrl: (url: string | null) => void;
    onHeroImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    threeDModelUrl: string | null;
    setThreeDModelUrl: (url: string | null) => void;
    isPlayingVoice: boolean;
    selectedVoice: any;
    setSelectedVoice: (voice: any) => void;
    handlePreviewVoice: () => void;
    voiceSample: string | null;
    setVoiceSample: (sample: string | null) => void;
}

const AssetManager: React.FC<AssetManagerProps> = ({
    heroPreviewUrl,
    onHeroImageUpload,
    threeDModelUrl,
    voiceSample,
    setVoiceSample
}) => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    // strip prefix
                    const base64 = base64data.split(',')[1];
                    setVoiceSample(base64);
                };
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone access denied", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

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
                <div className="space-y-4">
                    <h3 className="font-bold text-sm">Voice Cloning (Experimental)</h3>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30' : 'bg-primary/10 text-primary'}`}>
                            <span className="material-symbols-outlined text-3xl">{isRecording ? 'mic' : 'mic_none'}</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm mb-1">{isRecording ? 'Listening...' : (voiceSample ? 'Voice Sample Recorded' : 'Clone Your Voice')}</p>
                            <p className="text-xs text-gray-400 max-w-[200px]">{voiceSample ? 'Your voice is ready to narrate.' : 'Read a short sentence to clone your voice.'}</p>
                        </div>
                        {voiceSample ? (
                            <button onClick={() => setVoiceSample(null)} className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                Clear Sample
                            </button>
                        ) : (
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`px-6 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                            >
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetManager;
