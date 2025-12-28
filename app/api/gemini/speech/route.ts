import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export async function POST(req: Request) {
    if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

    try {
        const { text, voiceName, voiceSample } = await req.json();

        let contents: any[] = [];
        let config: any = {
            responseModalities: [Modality.AUDIO],
        };

        if (voiceSample) {
            // Voice Cloning Mode (Multimodal)
            contents = [{
                parts: [
                    { text: `Read this text with the exact tone and voice characteristics of the audio sample provided. Text to read: "${text}"` },
                    { inlineData: { mimeType: "audio/webm", data: voiceSample } }
                ]
            }];
            // No speechConfig needed for cloning, the input audio dictates the voice
        } else {
            // Standard TTS Mode
            contents = [{ parts: [{ text: `Read this storybook page clearly and expressively: ${text}` }] }];
            config.speechConfig = {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName || "Puck" },
                },
            };
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: contents,
            config: config,
        });

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (audioData) {
            return NextResponse.json({ audio: audioData });
        }

        return NextResponse.json({ error: "No audio generated" }, { status: 500 });

    } catch (error: any) {
        console.error("Speech API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
