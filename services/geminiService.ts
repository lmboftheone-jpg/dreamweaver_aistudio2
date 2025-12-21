import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Story, StoryPage } from "../types";

// Prefer using the Vite env variable, fallback to process.env for compatibility if needed (though usually not in Vite client)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process as any).env?.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface ImageInfo {
  data: string;
  mimeType: string;
}

/**
 * Generates the story draft (text content, page structure) using Gemini 2.0 Flash.
 * Enforces a strict JSON structure for the story using `responseSchema`.
 * 
 * @param prompt User's creative prompt
 * @param style Selected art style name
 * @param isBranching Whether the story should have interactive choices
 * @param heroImage Optional user-uploaded hero image for character consistency
 */
export const generateStoryDraft = async (
  prompt: string,
  style: string,
  isBranching: boolean,
  heroImage?: ImageInfo
): Promise<Partial<Story>> => {
  const branchingInstruction = isBranching
    ? "CRITICAL REQUIREMENT: This is an INTERACTIVE branching adventure. The VERY FIRST PAGE (id: 'p1') MUST HAVE 2-3 CHOICES. Each choice must have a unique 'id', descriptive 'text', and a 'leadsTo' property that matches the 'id' of another page node in the 'pages' array. The story should form a logical tree or graph starting immediately from page 1."
    : "This is a standard linear story without choices.";

  const heroInstruction = heroImage
    ? "I have provided a photo of the hero. Please analyze the appearance (hair, clothing, age, vibe) and incorporate these details consistently into the character's description and actions across all 10 pages."
    : "Create a whimsical hero for this tale.";

  const textPart = {
    text: `You are a world-class children's storybook author and game designer. 
    Theme: "${prompt}"
    Visual Style: ${style}
    
    Format: JSON
    Structure: ${branchingInstruction}
    Character Customization: ${heroInstruction}
    
    Output requirements:
    1. title (string): A catchy, magical title.
    2. author (string): A whimsical pen name.
    3. heroDescription (string): A detailed physical description of the hero based on the theme (and photo if provided) for illustration consistency.
    4. pages (array): EXACTLY 10 pages.
       - id (unique string, e.g., 'p1', 'p2', ..., 'p10')
       - pageNumber (number, from 1 to 10)
       - content (3-4 engaging sentences per page)
       - choices (ONLY IF BRANCHING: array of {id, text, leadsTo} for non-terminal pages)
    
    Ensure Page 1 (id: 'p1') has choices if branching is true. The story must span exactly 10 pages to provide a rich, personalized experience.`
  };

  const contents = heroImage
    ? { parts: [{ inlineData: heroImage }, textPart] }
    : { parts: [textPart] };

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", // Updated to latest stable flash model
    contents: contents as any,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          heroDescription: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            minItems: 10,
            maxItems: 10,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                pageNumber: { type: Type.NUMBER },
                content: { type: Type.STRING },
                choices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      leadsTo: { type: Type.STRING }
                    },
                    required: ["id", "text", "leadsTo"]
                  }
                }
              },
              required: ["id", "pageNumber", "content"]
            }
          }
        },
        required: ["title", "author", "pages", "heroDescription"]
      }
    }
  });

  try {
    const json = JSON.parse(response.text || "{}");
    return json;
  } catch (e) {
    console.error("Failed to parse AI story response", e);
    throw e;
  }
};

/**
 * Generates an illustration for a specific page using Gemini 2.0 Flash (Image model).
 * Fallback to Picsum if generation fails or returns no data.
 * 
 * @param pageContent The text content of the page to illustrate
 * @param stylePrompt The descriptive prompt for the chosen art style
 * @param heroDescription optional physical description of the hero for consistency
 */
export const generateIllustration = async (pageContent: string, stylePrompt: string, heroDescription?: string): Promise<string> => {
  const heroPrompt = heroDescription ? `The main character is: ${heroDescription}. ` : "";
  const fullPrompt = `${stylePrompt}. ${heroPrompt}Scene: ${pageContent}. Child-friendly, cinematic, high detail, masterpiece, no text.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash', // Image generation supported in 2.0 Flash
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return "https://picsum.photos/seed/fallback/800/800";
};

/**
 * Generates speech audio from text using Gemini 2.0 Flash Exp.
 * Returns Base64 encoded PCM audio data.
 * 
 * @param text The text to narrate
 * @param voiceName The specific voice configuration name
 */
export const generateSpeech = async (text: string, voiceName: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",

      contents: [{ parts: [{ text: `Read this storybook page clearly and expressively: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (err) {
    console.error("Gemini TTS failed:", err);
    return undefined;
  }
};
