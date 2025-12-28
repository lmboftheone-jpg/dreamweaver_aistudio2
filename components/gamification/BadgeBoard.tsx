import React from 'react';
import { Achievement, UserAchievement } from '../../types';

interface BadgeBoardProps {
    achievements: Achievement[];
    unlocked: UserAchievement[];
}

const BadgeBoard: React.FC<BadgeBoardProps> = ({ achievements, unlocked }) => {
    const unlockedIds = new Set(unlocked.map(u => u.achievementId));

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
                const isUnlocked = unlockedIds.has(achievement.id);
                return (
                    <div
                        key={achievement.id}
                        className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${isUnlocked
                                ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700'
                                : 'bg-gray-50 border-gray-100 grayscale opacity-60 dark:bg-gray-800 dark:border-gray-700'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isUnlocked ? 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-200' : 'bg-gray-200 text-gray-400'
                            }`}>
                            <span className="material-symbols-outlined text-2xl">{achievement.icon}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-1">{achievement.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                        {isUnlocked && (
                            <span className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                Unlocked!
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BadgeBoard;
