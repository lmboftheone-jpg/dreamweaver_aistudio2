
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
};

export enum View {
  Home = 'home',
  Library = 'library',
  Create = 'create',
  Reader = 'reader',
  Settings = 'settings',
  Gallery = 'gallery'
}
