
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h1 className="animate-up text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Weave Magic into <span className="text-primary">Every Bedtime.</span>
            </h1>
            <p className="animate-up delay-100 text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Create personalized, interactive, and collaborative AI storybooks in seconds. Watch your child's imagination come to life through your choices.
            </p>
            <div className="animate-up delay-200 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={onStart}
                data-testid="start-weaving-btn"
                className="h-14 px-10 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Weaving Your Tale</span>
                <span className="material-symbols-outlined">auto_awesome</span>
              </button>
              <button className="h-14 px-10 border-2 border-gray-200 dark:border-gray-800 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                Explore Gallery
              </button>
            </div>
            <div className="animate-up delay-300 flex items-center gap-2 justify-center md:justify-start text-sm text-yellow-600 font-bold">
              <span className="material-symbols-outlined">star</span>
              <span>Loved by 10,000+ dreaming families</span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl animate-up delay-200">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative group">
              <img
                src="https://picsum.photos/seed/magicalbook/800/600"
                alt="Magical book"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <p className="font-bold">Featured Story</p>
                <p className="text-sm opacity-90">The Robot Who Loved Earl Grey Tea</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white dark:bg-background-dark/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Bring Your Stories to Life</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Discover the enchanting tools that make every tale unique, memorable, and full of wonder.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'face_retouching_natural', title: 'Personalized Stories', desc: 'Your child becomes the hero. Customize names, traits, and friends.' },
              { icon: 'alt_route', title: 'Interactive Adventures', desc: 'Branching paths let you choose the direction. Every choice matters.' },
              { icon: 'group_add', title: 'Collaborative Writing', desc: 'Invite family members to write together. Perfect for bonding.' },
              { icon: 'headphones', title: 'Narrated Audio Books', desc: 'Soothing AI narrations make bedtime reading easier than ever.' }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-background-light dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow group text-center md:text-left">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform mx-auto md:mx-0">
                  <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
