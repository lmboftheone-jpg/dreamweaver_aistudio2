import React from 'react';
import { Challenge } from '../../types';

interface ChallengeCardProps {
    challenge: Challenge;
    onJoin: (prompt: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => {
    return (
        <div className="w-full p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg text-white mb-6">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Weekly Challenge</span>
                        <span className="flex items-center text-xs opacity-80">
                            <span className="material-symbols-outlined text-sm mr-1">group</span>
                            {challenge.participantsCount} joined
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{challenge.title}</h3>
                    <p className="text-sm opacity-90 mb-4 max-w-md">{challenge.description}</p>
                </div>
                <span className="material-symbols-outlined text-6xl opacity-20">trophy</span>
            </div>
            <button
                onClick={() => onJoin(challenge.themePrompt)}
                className="px-4 py-2 bg-white text-indigo-600 font-bold text-sm rounded-xl shadow hover:bg-indigo-50 transition-colors"
            >
                Join Challenge
            </button>
        </div>
    );
};

export default ChallengeCard;
