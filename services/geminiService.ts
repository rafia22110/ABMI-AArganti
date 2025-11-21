import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, Dataset, SearchResult } from '../types';

// Initialize the Gemini API client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const getSystemInstruction = (language: 'en' | 'he') => `
You are an expert AI research assistant. 

**TASK:**
Provide a helpful "answer" (insight/analysis) to the user's request AND a list of relevant "datasets".

**CRITICAL OUTPUT RULES:**
1. Output MUST be a valid JSON object.
2. Structure:
   {
     "answer": "Your detailed analysis, insight, or answer to the question here...",
     "datasets": [
       { "name": "...", "summary": "...", "use_cases": ["..."], "link": "...", "library_identifier": "..." }
     ]
   }
3. DO NOT output Markdown code blocks. Return raw JSON only.
4. Language MUST be ${language === 'he' ? 'Hebrew' : 'English'}.
5. If no datasets are found, return an empty array for "datasets", but YOU MUST provide a helpful "answer".
`;

export async function findDatasets(prompt: string, language: 'en' | 'he'): Promise<SearchResult> {
  if (!process.env.API_KEY) {
      throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(language),
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text ? response.text.trim() : "";
    
    // Clean up markdown code blocks
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
    // If the answer is empty but we have datasets, we can generate a generic one or leave it empty.
    // But if parsing failed completely (datasets is empty) and we have text, that text is the answer.
    const answer = parsedData.answer || (datasets.length === 0 ? text : "");

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(
        (chunk: any): chunk is GroundingChunk => chunk.web && chunk.web.uri && chunk.web.title
    ) || [];

    return { datasets, sources, answer };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}