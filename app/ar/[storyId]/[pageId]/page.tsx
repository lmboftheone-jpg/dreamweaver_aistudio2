'use client';

import React, { useEffect } from 'react';
import Head from 'next/head';

interface ARPageProps {
    params: {
        storyId: string;
        pageId: string;
    };
}

export default function ARPage({ params }: ARPageProps) {
    // In a real app, fetch the 3D model URL for this story/page from Supabase.
    // For demo, we use a placeholder or check URL params if we were passing them.
    // Let's use a public GLB for testing.
    const modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb"; // Placeholder

    useEffect(() => {
        // Load model-viewer script dynamically
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
            <Head>
                <title>DreamWeave AR Magic</title>
            </Head>
            <h1 className="text-2xl font-bold mb-4 z-10 text-center">✨ Point your camera at flat surface!</h1>

            {/* @ts-ignore */}
            <model-viewer
                src={modelUrl}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '80vh', backgroundColor: '#222', borderRadius: '20px' }}
            >
                <div slot="ar-button" style={{
                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'white', color: 'black', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold'
                }}>
                    👋 Activate AR
                </div>
            </model-viewer>

            <p className="mt-4 text-sm text-gray-400 text-center">
                This page uses Google's &lt;model-viewer&gt; for instant AR.
            </p>
        </div>
    );
}
