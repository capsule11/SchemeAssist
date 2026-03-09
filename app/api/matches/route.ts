import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const profile = await req.json();
        
        // Ensure API key is present
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
        }

        // Initialize the new Google Gen AI SDK
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const systemInstruction = `You are an expert government scheme advisor. 
        Analyze the exact user profile provided. You MUST use Google Search to find the 5 absolute best, most relevant, CURRENTLY ACTIVE government schemes (State or Central) that this specific Indian citizen is eligible for based on their demographics, location, occupation, and income.
        
        CRITICAL INSTRUCTION: You MUST return your response as a valid, raw JSON array of exactly 5 objects. DO NOT wrap the JSON in markdown code blocks like \`\`\`json. DO NOT add any conversational text before or after the JSON array.
        
        The JSON objects MUST have exactly these keys:
        - "schemeName" (string)
        - "benefitsSummary" (string: 2 sentences max)
        - "eligibilitySummary" (string: 1 sentence explaining why this user matched)
        - "implementingMinistry" (string)
        - "officialWebsite" (string: actual URL)
        - "area" (string: exactly one of [Agriculture, Education, Health, Business, Women, Seniors, General])`;
        
        const prompt = `User Profile Information:\n${JSON.stringify(profile, null, 2)}
        
        Analyze this person's eligibility. Use Google Search to find real, active schemes.
        Do not make up any schemes. Only recommend schemes they are genuinely eligible for. Return ONLY the raw JSON array.`;

        // The user verified they have access to gemini-3-flash-preview with a 5 RPM limit in their Google AI Studio workspace.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2, // Keep it factual
                tools: [{ googleSearch: {} }] // Enable Live Web Search Grounding
                // REMOVED responseMimeType: "application/json" due to Google API bug with Search tool
            }
        });

        if (!response.text) {
             throw new Error("No text returned from Gemini");
        }

        // Clean up the text in case Gemini still injected markdown blocks
        const cleanedText = response.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const schemes = JSON.parse(cleanedText);
        
        return NextResponse.json({ schemes });
        
    } catch (error: any) {
        console.error("Error generating AI matches:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate recommendations" },
            { status: 500 }
        );
    }
}
