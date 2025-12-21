import { useRef, useState, useCallback, useEffect } from 'react';

export const useAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef<number>(0);
    const pauseTimeRef = useRef<number>(0);
    const currentBufferRef = useRef<AudioBuffer | null>(null);

    /**
     * Lazy initializes the AudioContext.
     * We do this lazily to respect browser autoplay policies (must happen after user interaction).
     */
    const initAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        return audioCtxRef.current;
    }, []);

    /**
     * Decodes a Base64 string into a Uint8Array.
     * @param base64 Base64 encoded audio string
     */
    const decodeBase64 = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    /**
     * Manually decodes PCM data into an AudioBuffer.
     * Gemini PCM output is 24kHz, 16-bit, Mono usually.
     */
    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number = 24000, numChannels: number = 1): Promise<AudioBuffer> => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    };

    const stop = useCallback(() => {
        if (currentSourceRef.current) {
            try {
                currentSourceRef.current.stop();
                currentSourceRef.current.disconnect();
            } catch (e) {
                // Ignore
            }
            currentSourceRef.current = null;
        }
        setIsPlaying(false);
        setIsPaused(false);
        pauseTimeRef.current = 0;
        startTimeRef.current = 0;
    }, []);

    /**
     * Plays the provided Base64 audio string.
     * Stops any currently playing audio first.
     */
    const play = useCallback(async (base64Audio: string) => {
        try {
            stop(); // Stop any current playback
            const ctx = initAudioCtx();
            if (ctx.state === 'suspended') await ctx.resume();

            const audioBytes = decodeBase64(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, ctx);

            currentBufferRef.current = audioBuffer;

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);

            source.onended = () => {
                setIsPlaying(false);
                setIsPaused(false);
            };

            currentSourceRef.current = source;
            source.start(0);
            startTimeRef.current = ctx.currentTime;
            setIsPlaying(true);
            setIsPaused(false);
        } catch (err) {
            console.error("Audio playback failed:", err);
            setIsPlaying(false);
        }
    }, [initAudioCtx, stop]);

    const togglePause = useCallback(async () => {
        const ctx = initAudioCtx();
        if (ctx.state === 'suspended') await ctx.resume();

        if (isPlaying && !isPaused) {
            // Pause
            if (currentSourceRef.current) {
                try {
                    currentSourceRef.current.stop();
                    currentSourceRef.current.disconnect();
                } catch (e) { }
                pauseTimeRef.current += ctx.currentTime - startTimeRef.current;
                setIsPaused(true);
            }
        } else if (isPlaying && isPaused && currentBufferRef.current) {
            // Resume
            const source = ctx.createBufferSource();
            source.buffer = currentBufferRef.current;
            source.connect(ctx.destination);
            source.onended = () => {
                setIsPlaying(false);
                setIsPaused(false);
            };
            currentSourceRef.current = source;

            // Calculate start offset properly
            // Note: This is a simplified resume. For perfect accuracy we track exact offset.
            // Since our decode is custom, we'll just restart from an estimated offset if complex,
            // but here we can use the time delta.
            // If the buffer supports it, we start at offset. 
            // Simplified for this custom PCM decoder:

            // Re-implementing simplified toggle for now as the PCM decoding makes standard pause/resume tricky without full offset tracking logic
            // Ideally we just suspend the context, but that pauses ALL audio (including intended SFX).
            // Let's use context suspend for simplicity as seen in original code, OR try node offset.

            // Original code used ctx.suspend(). Let's stick to that pattern for reliability if we want to pause everything.
            // BUT if we want SFX to keep working, we shouldn't suspend ctx.
            // Let's stick to the original "suspend context" approach for now to minimize regression risk, 
            // as it was working for the user's single-track narration.

            // Wait, if I change my mind to use ctx.suspend, I don't need to rebuild the graph.
        }
    }, [initAudioCtx, isPlaying, isPaused]);

    // Re-evaluating Pause: The original code utilized ctx.suspend().
    // Let's provide a 'pause' method that does exactly that for now, as it's robust for single-stream apps.
    // If we need multi-stream (SFX + Voice), we need a different approach.
    // Given StoryReader has SFX, suspending context might mute SFX too.
    // However, the original code in StoryReader.tsx lines 97-106 DID use ctx.suspend().
    // So I will replicate that behavior to ensure consistency.

    const pauseVariables = useCallback(async () => {
        const ctx = initAudioCtx();
        if (isPaused) {
            await ctx.resume();
            setIsPaused(false);
        } else {
            await ctx.suspend();
            setIsPaused(true);
        }
    }, [initAudioCtx, isPaused]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (currentSourceRef.current) {
                try { currentSourceRef.current.stop(); } catch (e) { }
            }
        };
    }, []);

    return {
        play,
        stop,
        togglePause: pauseVariables,
        getAudioContext: initAudioCtx,
        isPlaying,
        isPaused
    };
};
