import { supabase } from '../lib/supabaseClient';

export interface Character {
    id: string;
    name: string;
    description: string;
    avatar_url?: string;
}

export const characterService = {
    async getCharacters(userId: string): Promise<Character[]> {
        if (!supabase) return []; // Fallback empty

        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Fetch Characters Error", error);
            return [];
        }
        return data as Character[];
    },

    async createCharacter(userId: string, character: Omit<Character, 'id'>): Promise<Character | null> {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('characters')
            .insert({
                user_id: userId,
                name: character.name,
                description: character.description,
                avatar_url: character.avatar_url
            })
            .select()
            .single();

        if (error) {
            console.error("Create Character Error", error);
            return null;
        }
        return data as Character;
    },

    async deleteCharacter(charId: string): Promise<void> {
        if (!supabase) return;
        const { error } = await supabase.from('characters').delete().eq('id', charId);
        if (error) console.error("Delete Character Error", error);
    }
};
