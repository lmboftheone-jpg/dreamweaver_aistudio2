import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Participant {
    user_id: string;
    name: string;
    avatar_url: string;
    last_seen: string;
}

export const collaborationService = {
    // Create a new room
    async createRoom(hostId: string): Promise<string | null> {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('rooms')
            .insert({ host_id: hostId, status: 'waiting' })
            .select('id')
            .single();

        if (error) {
            console.error("Create Room Error", error);
            return null;
        }
        return data.id;
    },

    // Join a room (record in DB)
    async joinRoom(roomId: string, userId: string): Promise<void> {
        if (!supabase) return;
        await supabase.from('room_participants').upsert({
            room_id: roomId,
            user_id: userId,
            last_seen: new Date().toISOString()
        });
    },

    // Subscribe to Realtime events
    subscribeToRoom(
        roomId: string,
        userId: string,
        onPresenceSync: (participants: any[]) => void,
        onBroadcast: (payload: any) => void
    ): RealtimeChannel | null {
        if (!supabase) return null;

        const channel = supabase.channel(`room:${roomId}`, {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                // Flatten presence state to list of users
                const users = Object.values(state).flat();
                onPresenceSync(users);
            })
            .on('broadcast', { event: 'prompt_update' }, (payload) => {
                onBroadcast(payload);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // Track presence
                    await channel.track({
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return channel;
    },

    // Send updates
    async broadcastPrompt(channel: RealtimeChannel, prompt: string) {
        await channel.send({
            type: 'broadcast',
            event: 'prompt_update',
            payload: { prompt },
        });
    }
};
