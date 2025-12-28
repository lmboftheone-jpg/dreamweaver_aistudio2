import React from 'react';

interface StreakCounterProps {
    days: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ days }) => {
    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-full" title="Reading Streak">
            <span className="material-symbols-outlined text-orange-500 animate-pulse text-lg">local_fire_department</span>
            <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{days} Day{days !== 1 ? 's' : ''}</span>
        </div>
    );
};

export default StreakCounter;
