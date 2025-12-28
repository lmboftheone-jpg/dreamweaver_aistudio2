import { supabase } from '../lib/supabaseClient';
import { Story } from '../types';

export const dbService = {
    async getUserStories(userId: string): Promise<Story[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user stories:', error);
            return [];
        }

        // Map DB fields to Story type if necessary (snake_case to camelCase handled mostly, but let's ensure)
        return data.map((d: any) => ({
            ...d,
            artStyle: d.art_style,
            coverUrl: d.cover_url,
            isBranching: d.is_branching,
            isPublic: d.is_public,
            heroDescription: d.hero_description,
            createdAt: d.created_at,
            pages: d.pages || []
        }));
    },

    async getPublicStories(): Promise<Story[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching public stories:', error);
            return [];
        }

        return data.map((d: any) => ({
            ...d,
            artStyle: d.art_style,
            coverUrl: d.cover_url,
            isBranching: d.is_branching,
            isPublic: d.is_public,
            heroDescription: d.hero_description,
            createdAt: d.created_at,
            pages: d.pages || []
        }));
    },

    async upsertStory(story: Story, userId: string): Promise<void> {
        if (!supabase) return;

        const { error } = await supabase
            .from('stories')
            .upsert({
                id: story.id,
                user_id: userId,
                title: story.title,
                author: story.author,
                cover_url: story.coverUrl,
                art_style: story.artStyle,
                is_branching: story.isBranching,
                is_public: story.isPublic || false,
                hero_description: story.heroDescription,
                pages: story.pages,
                created_at: story.createdAt // typically created_at is set on insert, but we might want to preserve local drafts time
            });

        if (error) console.error('Error saving story:', error);
    },

    async deleteStory(storyId: string): Promise<void> {
        if (!supabase) return;
        const { error } = await supabase.from('stories').delete().eq('id', storyId);
        if (error) console.error('Error deleting story:', error);
    }
};
