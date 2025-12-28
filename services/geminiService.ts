import { Story } from "../types";

export interface ImageInfo {
  data: string;
  mimeType: string;
}

/**
 * Generates the story draft via Next.js API Proxy.
 */
export const generateStoryDraft = async (
  prompt: string,
  style: string,
  isBranching: boolean,
  heroImage?: ImageInfo
): Promise<Partial<Story>> => {
  const response = await fetch('/api/gemini/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style, isBranching, heroImage }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Story generation failed");
  }

  return response.json();
};

/**
 * Generates an illustration via Next.js API Proxy.
 */
export const generateIllustration = async (pageContent: string, stylePrompt: string, heroDescription?: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageContent, stylePrompt, heroDescription }),
    });

    if (!response.ok) throw new Error("Image generation failed");

    const data = await response.json();
    return data.image || "https://picsum.photos/seed/fallback/800/800";
  } catch (e) {
    console.error("Illustration failed", e);
    return "https://picsum.photos/seed/fallback/800/800";
  }
};

/**
 * Generates speech via Next.js API Proxy.
 */
export const generateSpeech = async (text: string, voiceName: string): Promise<string | undefined> => {
  try {
    const response = await fetch('/api/gemini/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName }),
    });

    if (!response.ok) return undefined;

    const data = await response.json();
    return data.audio;
  } catch (err) {
    console.error("Gemini TTS failed:", err);
    return undefined;
  }
};
