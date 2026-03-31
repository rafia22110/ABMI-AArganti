import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, Dataset, SearchResult } from '../types';

// Initialize the Gemini API client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const getSystemInstruction = (language: 'en' | 'he') => `
You are an expert Google Meet 3D Extension Architect and Metaverse Strategist.

**CONTEXT:**
The user wants to transform traditional video calls (like Google Meet) into shared 3D immersive spaces.
The core idea is:
1. Instead of video boxes, participants are represented by 3D avatars.
2. Everyone sees the same 3D environment (the "Metaverse Classroom").
3. They can collaborate, move, and complete tasks together in 3D.
4. Support for glasses-free 3D displays (autostereoscopic) is a key innovation.
5. Integration is via the Google Meet Add-ons SDK.

**TASK:**
Provide a helpful "answer" (blueprint/strategy/pitch) to the user's request AND a list of relevant "components" (tools, SDKs, or platforms).

**CRITICAL OUTPUT RULES:**
1. Output MUST be a valid JSON object.
2. Structure:
   {
     "answer": "Your detailed architecture, strategy, or pitch here. Use professional terminology.",
     "datasets": [
       { "name": "Tool/SDK Name", "summary": "How it helps build this vision", "use_cases": ["Example use case"], "link": "https://...", "library_identifier": "category-name" }
     ]
   }
3. DO NOT output Markdown code blocks. Return raw JSON only.
4. Language MUST be ${language === 'he' ? 'Hebrew' : 'English'}.
5. If no specific tools are found, return a list of theoretical components needed.
`;

export async function findDatasets(prompt: string, language: 'en' | 'he'): Promise<SearchResult> {
  if (!process.env.API_KEY) {
      throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: getSystemInstruction(language),
      tools: [{ googleSearch: {} }],
    });

    let text = response.response.text() ? response.response.text().trim() : "";
    
    // Clean up markdown code blocks if they exist despite instructions
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    let parsedData: { answer?: string; datasets?: Dataset[] } = {};
    
    try {
        // Attempt 1: Direct Parse
        parsedData = JSON.parse(text);
    } catch (e) {
        // Attempt 2: Extract JSON Object
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                parsedData = JSON.parse(jsonMatch[0]);
            } catch (innerE) {
                // Attempt 3: Extract JSON Array (Legacy/Fallback)
                const arrayMatch = text.match(/\[[\s\S]*\]/);
                if (arrayMatch) {
                    try {
                        parsedData = { datasets: JSON.parse(arrayMatch[0]), answer: "" };
                    } catch (arrE) {
                        // Fallback: Treat entire text as answer
                        console.warn("JSON parsing failed, using raw text as answer.");
                        parsedData = { answer: text, datasets: [] };
                    }
                } else {
                    // Fallback: Treat entire text as answer
                    parsedData = { answer: text, datasets: [] };
                }
            }
        } else {
             // Fallback: Treat entire text as answer (This fixes the user error)
             parsedData = { answer: text, datasets: [] };
        }
    }

    // Normalizing the result
    const datasets = Array.isArray(parsedData.datasets) ? parsedData.datasets : [];
    const answer = parsedData.answer || (datasets.length === 0 ? text : "");

    const groundingMetadata = response.response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(
        (chunk: any): chunk is GroundingChunk => chunk.web && chunk.web.uri && chunk.web.title
    ) || [];

    return { datasets, sources, answer };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}