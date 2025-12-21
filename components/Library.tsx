
import React from 'react';
import { Story } from '../types';

interface LibraryProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
}

const Library: React.FC<LibraryProps> = ({ stories, onSelectStory, onDeleteStory }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight">My Library</h2>
          <p className="text-gray-500">Your collection of magical adventures.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-4 h-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">search</span>
            <input type="text" placeholder="Search..." className="bg-transparent border-none p-0 text-sm focus:ring-0 w-32 md:w-48" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {stories.map((story) => (
          <div
            key={story.id}
            className="group cursor-pointer bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all hover:-translate-y-1 relative"
            onClick={() => onSelectStory(story)}
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img src={story.coverUrl} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              {story.isBranching && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
                  Interactive
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{story.title}</h3>
              <p className="text-xs text-gray-400 mb-4">By {story.author}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{story.artStyle}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteStory(story.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                  title="Delete Story"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        <button className="aspect-[3/4] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <p className="font-bold">New Story</p>
        </button>
      </div>
    </div>
  );
};

export default Library;
