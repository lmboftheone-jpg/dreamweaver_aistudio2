'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOOD_PLAYLIST, SFX_LIBRARY } from '@/lib/audioAssets';

interface AudioEngineProps {
    mood?: string;
    soundEffects?: string[];
    isPlaying: boolean;
    volume?: number;
}

const AudioEngine: React.FC<AudioEngineProps> = ({ mood = 'calm', soundEffects = [], isPlaying, volume = 0.3 }) => {
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const [currentMood, setCurrentMood] = useState(mood);

    // Initial setup
    useEffect(() => {
        musicRef.current = new Audio(MOOD_PLAYLIST[mood] || MOOD_PLAYLIST['default']);
        musicRef.current.loop = true;
        musicRef.current.volume = volume;
        return () => {
            musicRef.current?.pause();
            musicRef.current = null;
        };
    }, []);

    // Handle Play/Pause and Volume
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = volume;
            if (isPlaying) {
                musicRef.current.play().catch(e => console.warn("Autoplay blocked", e));
            } else {
                musicRef.current.pause();
            }
        }
    }, [isPlaying, volume]);

    // Handle Mood Changes (Crossfade simulation by simple switch for now)
    useEffect(() => {
        if (mood !== currentMood && musicRef.current) {
            const newTrack = MOOD_PLAYLIST[mood] || MOOD_PLAYLIST['default'];
            // Simple switch: fade out old, switch, fade in new (simplified)
            musicRef.current.src = newTrack;
            if (isPlaying) musicRef.current.play();
            setCurrentMood(mood);
        }
    }, [mood, currentMood, isPlaying]);

    // Handle SFX Triggers
    useEffect(() => {
        if (soundEffects && soundEffects.length > 0 && isPlaying) {
            soundEffects.forEach(sfx => {
                const url = SFX_LIBRARY[sfx.toLowerCase()];
                if (url) {
                    const audio = new Audio(url);
                    audio.volume = 0.5; // SFX louder than BG music
                    audio.play().catch(e => console.warn("SFX blocked", e));
                }
            });
        }
    }, [soundEffects, isPlaying]);

    return null; // Headless component
};

export default AudioEngine;
