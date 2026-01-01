// Gamification Types
export interface MarketplaceItem {
    id: string;
    sellerId: string;
    title: string;
    description: string;
    price: number;
    type: 'world_building_kit' | 'art_style' | 'character_pack' | 'merch';
    imageUrl: string;
}

export interface Order {
    id: string;
    userId: string;
    storyId?: string;
    itemId?: string;
    amount: number;
    status: 'pending' | 'completed' | 'shipped';
    createdAt: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    conditionType: 'story_count' | 'streak_days' | 'word_count' | 'other';
    threshold: number;
}

export interface UserStats {
    userId: string;
    currentStreak: number;
    lastActiveDate: string; // ISO date string
    totalStories: number;
    totalWordsGenerated: number;
}

export interface UserAchievement {
    userId: string;
    achievementId: string;
    unlockedAt: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    themePrompt: string;
    startDate: string;
    endDate: string;
    participantsCount: number;
}

export type ArtStyle = {
    id: string;
    name: string;
    imageUrl: string;
    prompt: string;
};

export type Choice = {
    id: string;
    text: string;
    leadsTo?: string; // ID of the next page node
};

export type StoryPage = {
    id: string;
    pageNumber: number;
    content: string;
    illustrationUrl?: string;
    choices?: Choice[];
    mood?: string;
    soundEffects?: string[];
};

export type Story = {
    id: string;
    title: string;
    author: string;
    artStyle: string;
    voiceId?: string;
    // Added heroDescription to store the AI-generated physical description of the character for visual consistency
    heroDescription?: string;
    coverUrl: string;
    pages: StoryPage[];
    isBranching: boolean;
    createdAt: string;
    threeDModelUrl?: string;
    isPublic?: boolean;
    shareId?: string;
};

export enum View {
    Home = 'home',
    Library = 'library',
    Create = 'create',
    Reader = 'reader',
    Settings = 'settings',
    Gallery = 'gallery',
    Collaboration = 'collaboration',
    Marketplace = 'marketplace',
    CIDashboard = 'ci_dashboard'
}
