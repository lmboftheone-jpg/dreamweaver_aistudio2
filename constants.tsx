
import { ArtStyle, Story } from './types';

export const ART_STYLES: ArtStyle[] = [
  {
    id: 'surreal-dreamscape',
    name: 'Surreal Dreamscape',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=400',
    prompt: 'A mind-bending surrealist digital masterpiece with a dreamlike and fantastical atmosphere. Inspired by the works of Salvador Dalí and René Magritte. Features impossible geometry, floating staircases leading to the stars, melting clocks, and giant whimsical creatures that defy logic. Bioluminescent clouds drift through an ethereal sky. Soft, otherworldly lighting with a vibrant yet uncanny color palette (indigo, gold, and neon teal). The composition is vast and magical, creating a sense of infinite wonder and mystery. High-fidelity digital art, cinematic perspective, no text.'
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400&h=400',
    prompt: 'A breathtaking 32-bit pixel art masterpiece in the style of high-fidelity retro-modern JRPGs like Octopath Traveler. Meticulously hand-placed pixels with a crisp aesthetic. Features a vibrant and harmonious color palette with rich saturation. Intricate dithering and cross-hatching techniques used for lighting and depth. Atmospheric cinematic lighting with soft glows and bloom effects. Whimsical and fantastical world-building with high-fidelity character sprites and detailed environmental storytelling. Sharp resolution, no blur, high pixel density, child-friendly, no text.'
  },
  {
    id: 'claymation',
    name: 'Claymation',
    imageUrl: 'https://images.unsplash.com/photo-1584907797015-7554df280107?auto=format&fit=crop&q=80&w=400&h=400',
    prompt: 'Breathtaking hand-sculpted claymation masterpiece, iconic Aardman-inspired stop-motion animation aesthetic. Features tactile, soft plasticine textures with charming imperfections like subtle thumbprint marks and delicate tool indentations that suggest hand-craftsmanship. Characters have expressive, slightly exaggerated features with glossy "bead" eyes. Soft, warm studio three-point lighting that accentuates the physical volume and textures of the clay. Vibrant yet grounded color palette. The background is a meticulously detailed handcrafted miniature set with a soft tilt-shift focus. High-fidelity 8k digital photography, no text.'
  },
  {
    id: '3d-render',
    name: '3D Render',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400&h=400',
    prompt: 'Breathtaking 3D digital masterpiece in the iconic style of modern Pixar and Disney animation. Features charming, expressive characters with large soulful eyes and soft, rounded forms. Exquisite material textures including fluffy fur, tactile knitted fabrics, and smooth stylized skin with realistic subsurface scattering. Warm, cinematic three-point lighting with soft global illumination and vibrant, emotive color palettes. Richly detailed whimsical environments with a professional bokeh depth-of-field effect. High-fidelity 8k render, ray-traced reflections, no text.'
  },
  {
    id: 'korean-traditional-art',
    name: 'Korean Traditional Art',
    imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&q=80&w=400&h=400',
    prompt: 'Masterpiece Korean traditional Min-hwa (folk art) style. Exquisite ink and wash painting (Sumi-e) technique on aged, textured Hanji (mulberry paper). Vibrant and harmonious use of traditional Dan-cheong mineral pigments: cinnabar red, deep indigo, forest green, and warm ochre. Bold, rhythmic calligraphic brushwork. Features symbolic motifs like friendly tigers, magpies, and stylized jagged mountains. Poetic, serene, and whimsical atmosphere, high-fidelity cultural art style, no text.'
  },
  {
    id: 'ghibli',
    name: 'Studio Magic',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400&h=400',
    prompt: 'Breathtaking Studio Ghibli animation aesthetic, hand-painted watercolor background style, lush vibrant nature, soft nostalgic lighting, whimsical atmosphere, charming character designs, high-fidelity anime masterpiece, no text.'
  },
  {
    id: 'felted-friends',
    name: 'Felted Friends',
    imageUrl: 'https://images.unsplash.com/photo-1603539823032-47124958614f?auto=format&fit=crop&q=80&w=400&h=400',
    prompt: 'Handcrafted needle-felted wool illustration, soft fuzzy textures, visible wool fibers, organic and warm aesthetic, gentle studio lighting, handcrafted felt backgrounds, charming and tactile character designs, soft pastel and earth tones, cozy atmosphere, no text.'
  },
  {
    id: 'watercolor',
    name: 'Watercolor Dreams',
    imageUrl: 'https://picsum.photos/seed/watercolor/400/400',
    prompt: 'Soft watercolor style, ethereal, pastel colors, whimsical ink outlines, dreamy atmosphere, light washes of paint, traditional paper texture, no text.'
  },
  {
    id: 'stained-glass',
    name: 'Stained Glass',
    imageUrl: 'https://picsum.photos/seed/glass/400/400',
    prompt: 'Vibrant stained glass window style, leaded glass outlines, translucent colors, glowing light passing through glass, kaleidoscopic patterns, gothic and ethereal, high saturation, no text.'
  },
  {
    id: 'origami',
    name: 'Origami World',
    imageUrl: 'https://picsum.photos/seed/origami/400/400',
    prompt: 'Papercraft and origami style, sharp paper folds, textured paper surfaces, 3D paper dioramas, soft studio lighting, delicate and handcrafted look, vibrant colors, no text.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Noir',
    imageUrl: 'https://picsum.photos/seed/cyber/400/400',
    prompt: 'Neon lights, cinematic lighting, 80s futuristic aesthetic, high contrast, rainy city streets, glowing signs, dark atmosphere with vibrant highlights, no text.'
  },
  {
    id: 'papercut',
    name: 'Papercut Tale',
    imageUrl: 'https://picsum.photos/seed/paper/400/400',
    prompt: '3D layered papercut illustration, shadowbox effect, sharp paper edges, visible depth and shadows between layers, textured craft paper, vibrant solid colors, whimsical folk art aesthetic, no text.'
  },
  {
    id: 'retro-comic',
    name: 'Golden Age Comic',
    imageUrl: 'https://picsum.photos/seed/comic/400/400',
    prompt: 'Classic 1950s comic book style, visible halftone dots, vibrant CMYK primary colors, bold black ink outlines, dramatic action lines, nostalgic superhero aesthetic, aged paper texture, no text.'
  }
];

export const VOICES = [
  { id: 'Kore', name: 'Kore', desc: 'Friendly & Soft', icon: 'sentiment_satisfied' },
  { id: 'Zephyr', name: 'Zephyr', desc: 'Clear & Modern', icon: 'cyclone' },
  { id: 'Puck', name: 'Puck', desc: 'Playful & Young', icon: 'child_care' },
  { id: 'Charon', name: 'Charon', desc: 'Deep & Wise', icon: 'elderly' },
  { id: 'Fenrir', name: 'Fenrir', desc: 'Bold & Strong', icon: 'auto_awesome' },
  { id: 'Aoide', name: 'Aoide', desc: 'Melodic & Sweet', icon: 'music_note' },
  { id: 'Orpheus', name: 'Orpheus', desc: 'Epic & Narrative', icon: 'menu_book' },
  { id: 'Gaia', name: 'Gaia', desc: 'Warm & Earthy', icon: 'nature' },
  { id: 'Lyra', name: 'Lyra', desc: 'Gentle & Bright', icon: 'light_mode' },
];

export const PRESET_PROMPTS = [
  {
    title: "Clockwork Owl",
    text: "A small clockwork owl who guards a secret library hidden inside an ancient oak tree.",
    icon: "owl"
  },
  {
    title: "Cloud Baker",
    text: "A clumsy giant who lives above the clouds and tries to bake the perfect lightning-flavored cupcake.",
    icon: "cloudy_snowing"
  },
  {
    title: "Ocean Lantern",
    text: "A bioluminescent jellyfish who loses her light and must journey to the deepest part of the ocean to find it.",
    icon: "water_drop"
  },
  {
    title: "Mars Garden",
    text: "A lonely robot on Mars who discovers the first flower growing in the red dust.",
    icon: "precision_manufacturing"
  },
  {
    title: "Shadow Painter",
    text: "A young girl who discovers she can paint with shadows, but her paintings come to life at night.",
    icon: "brush"
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: "Oscar's Space Odyssey",
    author: "The Peterson Family",
    artStyle: "watercolor",
    coverUrl: "https://picsum.photos/seed/space/600/900",
    isBranching: true,
    createdAt: "2023-11-20",
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        content: "Oscar looked out his window. The moon looked like a giant wheel of cheese. He grabbed his cardboard rocket and felt a tingle in his toes.",
        illustrationUrl: "https://picsum.photos/seed/space1/800/800",
        choices: [
          { id: 'c1', text: "Blast off to the Moon", leadsTo: 'p2' },
          { id: 'c2', text: "Check the garden for aliens first", leadsTo: 'p3' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: "Lily & The Lost Fairy",
    author: "Sarah & Mom",
    artStyle: "ghibli",
    coverUrl: "https://picsum.photos/seed/fairy/600/900",
    isBranching: false,
    createdAt: "2023-11-18",
    pages: []
  }
];
