import { supabase } from '../lib/supabaseClient';
import { Achievement, UserStats, UserAchievement, Challenge } from '../types';

export const gamificationService = {
    async getUserStats(userId: string): Promise<UserStats | null> {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignore not found error
            console.error('Error fetching stats:', error);
            return null;
        }

        if (!data) {
            // Create initial stats if missing
            return {
                userId,
                currentStreak: 0,
                lastActiveDate: new Date().toISOString().split('T')[0],
                totalStories: 0,
                totalWordsGenerated: 0
            };
        }

        return {
            userId: data.user_id,
            currentStreak: data.current_streak,
            lastActiveDate: data.last_active_date,
            totalStories: data.total_stories,
            totalWordsGenerated: data.total_words_generated
        };
    },

    async updateActivity(userId: string): Promise<UserStats | null> {
        if (!supabase) return null;

        const today = new Date().toISOString().split('T')[0];
        const currentStats = await this.getUserStats(userId);

        if (!currentStats) return null; // Should have been created or fetched

        let newStreak = currentStats.currentStreak;

        if (currentStats.lastActiveDate !== today) {
            const lastActive = new Date(currentStats.lastActiveDate);
            const yesterDate = new Date();
            yesterDate.setDate(yesterDate.getDate() - 1);
            const yesterday = yesterDate.toISOString().split('T')[0];

            if (currentStats.lastActiveDate === yesterday) {
                newStreak += 1;
            } else if (currentStats.lastActiveDate < yesterday) {
                newStreak = 1; // Reset streak if missed a day
            }
            // If already today, do nothing to streak
        }

        const { data, error } = await supabase
            .from('user_stats')
            .upsert({
                user_id: userId,
                current_streak: newStreak,
                last_active_date: today,
                total_stories: currentStats.totalStories, // Preserve
                total_words_generated: currentStats.totalWordsGenerated // Preserve
            })
            .select()
            .single();

        if (error) {
            console.error("Error updating activity:", error);
            return null;
        }

        return {
            userId: data.user_id,
            currentStreak: data.current_streak,
            lastActiveDate: data.last_active_date,
            totalStories: data.total_stories,
            totalWordsGenerated: data.total_words_generated
        };
    },

    async incrementStoryCount(userId: string): Promise<void> {
        if (!supabase) return;

        // We use an RPC call ideally, but for now simple fetch-update for MVP
        // In prod, use atomic update or RPC
        const stats = await this.getUserStats(userId);
        if (!stats) return;

        await supabase.from('user_stats').upsert({
            user_id: userId,
            total_stories: stats.totalStories + 1,
            // Should verify if we need to update date/streak here too, typically yes
        });

        await this.checkAchievements(userId, 'story_count', stats.totalStories + 1);
    },

    async checkAchievements(userId: string, type: string, value: number): Promise<Achievement[]> {
        if (!supabase) return [];

        // Get all achievements of this type
        const { data: achievements } = await supabase
            .from('achievements')
            .select('*')
            .eq('condition_type', type)
            .lte('threshold', value);

        if (!achievements || achievements.length === 0) return [];

        // Check which ones user already has
        const { data: owned } = await supabase
            .from('user_achievements')
            .select('achievement_id')
            .eq('user_id', userId);

        const ownedIds = new Set(owned?.map((ua: any) => ua.achievement_id) || []);
        const newUnlocks: Achievement[] = [];

        for (const achievement of achievements) {
            if (!ownedIds.has(achievement.id)) {
                // Unlock!
                await supabase.from('user_achievements').insert({
                    user_id: userId,
                    achievement_id: achievement.id
                });
                newUnlocks.push({
                    id: achievement.id,
                    title: achievement.title,
                    description: achievement.description,
                    icon: achievement.icon,
                    conditionType: achievement.condition_type as any,
                    threshold: achievement.threshold
                });
            }
        }

        return newUnlocks;
    },

    async getAchievements(userId: string): Promise<{ unlocked: UserAchievement[], all: Achievement[] }> {
        if (!supabase) return { unlocked: [], all: [] };

        const { data: all } = await supabase.from('achievements').select('*');
        const { data: unlocked } = await supabase.from('user_achievements').select('*').eq('user_id', userId);

        return {
            all: (all || []).map((a: any) => ({ ...a, conditionType: a.condition_type })),
            unlocked: (unlocked || []).map((u: any) => ({ ...u, userId: u.user_id, achievementId: u.achievement_id, unlockedAt: u.unlocked_at }))
        };
    },

    async getActiveChallenge(): Promise<Challenge | null> {
        if (!supabase) return null;

        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .lte('start_date', now)
            .gte('end_date', now)
            .limit(1)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            themePrompt: data.theme_prompt,
            startDate: data.start_date,
            endDate: data.end_date,
            participantsCount: data.participants_count
        };
    }
};
