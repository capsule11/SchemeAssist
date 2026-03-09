import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, profileData } = body;
        
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // System instruction to give Gemini its persona and constraints
        const systemInstruction = `You are SchemeAssist, an expert AI advisor for Indian government schemes.
        You are currently chatting with a user to help them find schemes they are eligible for.
        ${profileData ? `The user's profile is:\n${JSON.stringify(profileData, null, 2)}\nUse this to personalize your advice.` : 'The user has not completed their profile yet.'}
        
        Guidelines:
        - ALWAYS use Google Search to find current, real, active schemes. DO NOT hallucinate schemes.
        - Be highly conversational, professional, and encouraging.
        - When recommending a scheme, use Markdown (bolding, bullet points) to make it easy to read. Include the official website link if possible.
        - If the user asks general questions, guide them back to government schemes and their eligibility.`;

        // Format the conversation history for the SDK
        const contents = messages.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // We use gemini-2.5-flash for speed and search grounding
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4, // Slightly higher temperature for conversational flow
                tools: [{ googleSearch: {} }] // Enable Live Web Search Grounding
            }
        });

        if (!response.text) {
             throw new Error("No text returned from Gemini");
        }
        
        return NextResponse.json({ reply: response.text });
        
    } catch (error: any) {
        console.error("Error generating chat response:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}
