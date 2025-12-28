import React, { useState, useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { collaborationService } from '../../services/collaborationService';
import { useAuth } from '../../contexts/AuthContext';

interface CollaborationRoomProps {
    onBack: () => void;
}

const CollaborationRoom: React.FC<CollaborationRoomProps> = ({ onBack }) => {
    const { user } = useAuth();
    const [roomId, setRoomId] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [participants, setParticipants] = useState<any[]>([]);
    const channelRef = useRef<RealtimeChannel | null>(null);

    // Join Room Logic
    const handleJoin = async () => {
        if (!roomId || !user) return;
        try {
            await collaborationService.joinRoom(roomId, user.id);

            const channel = collaborationService.subscribeToRoom(
                roomId,
                user.id,
                (users) => setParticipants(users),
                (payload) => {
                    if (payload.payload.prompt !== undefined) {
                        setPrompt(payload.payload.prompt);
                    }
                }
            );

            // Track our own presence details
            if (channel) {
                channel.track({
                    user_id: user.id,
                    name: user.name,
                    avatar_url: user.avatarUrl
                });
            }

            channelRef.current = channel;
            setIsInRoom(true);
        } catch (e) {
            console.error("Failed to join", e);
            alert("Could not join room. Check ID.");
        }
    };

    const handleCreate = async () => {
        if (!user) return;
        const newId = await collaborationService.createRoom(user.id);
        if (newId) {
            setRoomId(newId);
            // Auto-join after state update (a bit tricky synchronously, so we wait or just call join manually)
            setTimeout(() => {
                const btn = document.getElementById('join-btn');
                if (btn) btn.click();
            }, 100);
        }
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setPrompt(val);
        if (channelRef.current) {
            collaborationService.broadcastPrompt(channelRef.current, val);
        }
    };

    const handleLeave = () => {
        if (channelRef.current) {
            channelRef.current.unsubscribe();
        }
        setIsInRoom(false);
        onBack();
    };

    if (!isInRoom) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-8">
                <h2 className="text-4xl font-black">Story Room</h2>
                <p className="text-gray-500">Enter a Room ID to join your friends, or create a new magical space.</p>

                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <input
                        type="text"
                        placeholder="Room ID (UUID)"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="h-12 border rounded-xl px-4 text-center font-mono"
                    />
                    <button id="join-btn" onClick={handleJoin} className="h-12 bg-primary text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                        Join Room
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-sm text-gray-400">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    <button onClick={handleCreate} className="h-12 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors">
                        Create New Room
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        Story Room
                    </h2>
                    <p className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mt-1 select-all" title="Click to copy">
                        {roomId}
                    </p>
                </div>

                {/* Presence Avatars */}
                <div className="flex items-center -space-x-2">
                    {participants.map((p, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden relative" title={p.name}>
                            <img src={p.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                        +{participants.length}
                    </div>
                </div>

                <button onClick={handleLeave} className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    Leave
                </button>
            </div>

            {/* Main Collab Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Chat / Log (Placeholder) */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex flex-col">
                    <h3 className="font-bold mb-4 opacity-50">Room Activity</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 text-sm text-gray-500">
                        <p className="italic">You joined the room.</p>
                    </div>
                    <input type="text" placeholder="Chat coming soon..." className="mt-4 w-full bg-transparent border-b border-gray-300 focus:border-primary outline-none py-2 text-sm" disabled />
                </div>

                {/* Center: Shared Prompt */}
                <div className="md:col-span-2 flex flex-col space-y-4">
                    <label className="font-bold text-lg">Shared Story Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={handlePromptChange}
                        className="flex-1 w-full bg-white dark:bg-gray-800 border-2 border-primary/20 focus:border-primary rounded-2xl p-6 text-lg leading-relaxed outline-none resize-none transition-colors"
                        placeholder="Once upon a time, in a galaxy far away..."
                    />
                    <button className="h-14 bg-gradient-to-r from-primary to-purple-600 text-white text-xl font-bold rounded-full shadow-xl hover:scale-[1.02] transition-transform">
                        Generate Story (Host Only)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollaborationRoom;
