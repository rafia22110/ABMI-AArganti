import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, Dataset } from '../types';

// Initialize the Gemini API client.
// The API key is retrieved from the environment variables.
// We pass a fallback empty string to the constructor to prevent initialization errors,
// but the actual call will validate the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const getSystemInstruction = (language: 'en' | 'he') => `
You are an expert AI research assistant. Your task is to find AI training datasets based on user requests.

**CRITICAL RULES:**
1. Output MUST be a valid JSON array.
2. DO NOT output Markdown code blocks (like \`\`\`json). Return raw JSON only.
3. Language MUST be ${language === 'he' ? 'Hebrew' : 'English'}.
4. Structure each item with: "name", "summary", "use_cases" (array), "link" (optional), "library_identifier" (optional).
5. If no datasets found, return [].
6. DO NOT include any conversational text before or after the JSON.
`;

export async function findDatasets(prompt: string, language: 'en' | 'he'): Promise<{ datasets: Dataset[]; sources: GroundingChunk[] }> {
  // Check for API key before making the request
  if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please ensure the API_KEY environment variable is set.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(language),
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json", // Not supported with tools in this model version
      },
    });

    let jsonText = response.text ? response.text.trim() : "";
    
    // Clean up markdown code blocks if the model includes them
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    // Remove any leading conversational text (e.g., "Here is the list...")
    const firstBracket = jsonText.indexOf('[');
    const lastBracket = jsonText.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
        jsonText = jsonText.substring(firstBracket, lastBracket + 1);
    }

    let datasets: Dataset[] = [];
    
    try {
        datasets = JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON:", jsonText);
        throw new Error("Received invalid data format from AI.");
    }
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(
        (chunk: any): chunk is GroundingChunk => chunk.web && chunk.web.uri && chunk.web.title
    ) || [];

    return { datasets, sources };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}