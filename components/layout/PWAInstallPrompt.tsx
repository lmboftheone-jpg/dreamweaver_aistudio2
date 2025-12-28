'use client';

import React, { useEffect, useState } from 'react';

const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl border border-primary/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        DT
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Install DreamWeave</h4>
                        <p className="text-xs text-gray-500">Read stories offline!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="px-3 py-2 text-xs font-bold text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Later
                    </button>
                    <button
                        onClick={handleInstall}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
