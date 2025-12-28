import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export async function POST(req: Request) {
    if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

    try {
        const { pageContent, stylePrompt, heroDescription } = await req.json();

        const heroPrompt = heroDescription ? `The main character is: ${heroDescription}. ` : "";
        const fullPrompt = `${stylePrompt}. ${heroPrompt}Scene: ${pageContent}. Child-friendly, cinematic, high detail, masterpiece, no text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
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
                return NextResponse.json({
                    image: `data:image/png;base64,${part.inlineData.data}`
                });
            }
        }

        return NextResponse.json({ image: "https://picsum.photos/seed/fallback/800/800" });

    } catch (error: any) {
        console.error("Image API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
