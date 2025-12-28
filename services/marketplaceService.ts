import { supabase } from '../lib/supabaseClient';
import { MarketplaceItem, Order } from '../types';

// Mock Data for "Seeding" the store
const MOCK_ITEMS: MarketplaceItem[] = [
    {
        id: 'item-1',
        sellerId: 'system',
        title: 'Cyberpunk World Kit',
        description: 'Neon assets, synthwave music pack, and futuristic prompts.',
        price: 500,
        type: 'world_building_kit',
        imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=400&h=400'
    },
    {
        id: 'item-2',
        sellerId: 'system',
        title: 'Ghibli Style Pack',
        description: 'Fine-tuned prompt engineering for Studio Ghibli aesthetics.',
        price: 300,
        type: 'art_style',
        imageUrl: 'https://images.unsplash.com/photo-1510442658912-325b7453715e?auto=format&fit=crop&q=80&w=400&h=400'
    },
    {
        id: 'item-3',
        sellerId: 'system',
        title: 'DreamWeave Hoodie',
        description: 'Physical Merchandise. Cozy hoodie for dreamers.',
        price: 4500, // 45.00
        type: 'merch',
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=400&h=400'
    }
];

export const marketplaceService = {
    async getItems(): Promise<MarketplaceItem[]> {
        if (!supabase) return MOCK_ITEMS;

        const { data, error } = await supabase
            .from('marketplace_items')
            .select('*');

        if (error || !data || data.length === 0) {
            return MOCK_ITEMS;
        }

        return data.map((d: any) => ({
            id: d.id,
            sellerId: d.seller_id,
            title: d.title,
            description: d.description,
            price: d.price,
            type: d.type,
            imageUrl: d.image_url
        }));
    },

    async purchaseItem(userId: string, itemId: string, price: number): Promise<boolean> {
        // Simulating Payment
        if (!supabase) return true;

        const { error } = await supabase.from('orders').insert({
            user_id: userId,
            item_id: itemId,
            amount: price,
            status: 'completed'
        });

        return !error;
    },

    async createPrintOrder(userId: string, storyId: string, address: string): Promise<boolean> {
        // Simulating Print-on-Demand API call (e.g., to Printful/Lulu)
        console.log(`[POD] Creating order for Story ${storyId} to ${address}`);

        if (!supabase) return true;

        const { error } = await supabase.from('orders').insert({
            user_id: userId,
            story_id: storyId,
            shipping_address: address,
            amount: 2999, // Fixed price $29.99 for hardcover
            status: 'pending' // pending shipping
        });

        return !error;
    }
};
