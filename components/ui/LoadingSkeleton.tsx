import React, { useState, useEffect } from 'react';

interface LoadingSkeletonProps {
    step: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ step }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-32 gap-12 w-full animate-in fade-in duration-500">
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-12 translate-x-[-200%] animate-shimmer"></div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cover Image Skeleton */}
                    <div className="w-full md:w-1/3 aspect-square bg-gray-100 dark:bg-gray-700/50 rounded-2xl animate-pulse"></div>

                    <div className="flex-1 space-y-4 py-2">
                        {/* Text Lines */}
                        <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded-full w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded-full w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded-full w-4/6 animate-pulse"></div>
                        <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded-full w-full animate-pulse"></div>

                        <div className="pt-6 flex gap-3">
                            <div className="h-10 w-24 bg-gray-100 dark:bg-gray-700/50 rounded-xl animate-pulse"></div>
                            <div className="h-10 w-32 bg-primary/10 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-widest text-xs animate-bounce">
                    <span className="material-symbols-outlined text-lg animate-spin">auto_awesome</span>
                    Thinking
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {step}{dots}
                </h2>
                <p className="text-gray-400">Dreaming up dragons and painting pixels...</p>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
