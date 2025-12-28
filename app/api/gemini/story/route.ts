import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    try {
        const { prompt, style, isBranching, heroImage } = await req.json();

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
         - mood (string: 'joyful', 'mysterious', 'scary', 'calm', 'action')
         - soundEffects (array of strings: e.g., ['thunder', 'birds'])
         - choices (ONLY IF BRANCHING: array of {id, text, leadsTo} for non-terminal pages)
      
      Ensure Page 1 (id: 'p1') has choices if branching is true. The story must span exactly 10 pages to provide a rich, personalized experience.`
        };

        const contents = heroImage
            ? { parts: [{ inlineData: heroImage }, textPart] }
            : { parts: [textPart] };

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
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
                                    mood: { type: Type.STRING, description: "Atmosphere: 'joyful', 'mysterious', 'scary', 'calm', 'action'" },
                                    soundEffects: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "List of sound effects: 'thunder', 'laughter', 'footsteps', 'wind', 'magic'"
                                    },
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

        const json = JSON.parse(response.text || "{}");
        return NextResponse.json(json);

    } catch (error: any) {
        console.error("Story API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate story" }, { status: 500 });
    }
}
