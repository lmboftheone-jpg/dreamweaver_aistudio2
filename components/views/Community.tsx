import React from 'react';
import { Story, View } from '../../types';
import { MOCK_STORIES } from '../../lib/constants';

interface CommunityProps {
    userStories: Story[];
    onReadStory: (story: Story) => void;
    onImportStory?: (story: Story) => void;
}

const Community: React.FC<CommunityProps> = ({ userStories, onReadStory, onImportStory }) => {
    // Combine "Server" MOCK_STORIES and User's "Public" stories
    // Filter MOCK_STORIES to only those that are "public" (simulated by having isPublic=true or just being in MOCK)
    // For this demo, let's treat all MOCK_STORIES as public community content.
    // And also include any local user stories that have isPublic = true.

    const publicUserStories = userStories.filter(s => s.isPublic);

    // Deduping based on ID in case user imported a mock story
    const communityStoriesMap = new Map<string, Story>();

    MOCK_STORIES.forEach(s => communityStoriesMap.set(s.id, { ...s, isPublic: true })); // Ensure mocks align
    publicUserStories.forEach(s => communityStoriesMap.set(s.id, s));

    const allCommunityStories = Array.from(communityStoriesMap.values());

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black mb-4">DreamWeave Community</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Explore enchanted tales woven by dreamers from around the world.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allCommunityStories.map((story) => (
                    <div key={story.id} className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="aspect-[2/3] overflow-hidden relative">
                            <img src={story.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={story.title} />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                                <h3 className="text-white font-bold text-lg leading-tight mb-1">{story.title}</h3>
                                <p className="text-white/70 text-xs">by {story.author}</p>
                            </div>

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => onReadStory(story)}
                                    className="p-3 bg-white text-gray-900 rounded-full hover:scale-110 active:scale-95 transition-all"
                                    title="Read Story"
                                >
                                    <span className="material-symbols-outlined">menu_book</span>
                                </button>
                                {onImportStory && !userStories.some(us => us.id === story.id) && (
                                    <button
                                        onClick={() => onImportStory(story)}
                                        className="p-3 bg-primary text-white rounded-full hover:scale-110 active:scale-95 transition-all"
                                        title="Save to Library"
                                    >
                                        <span className="material-symbols-outlined">bookmark_add</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                {story.isBranching ? 'Branching' : 'Linear'}
                            </span>
                            <span>{story.pages.length} Pages</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
