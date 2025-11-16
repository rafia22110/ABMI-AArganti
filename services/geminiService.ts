import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, Dataset } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: 'en' | 'he') => `
You are an expert AI research assistant. Your task is to find AI training datasets based on user requests and respond with a valid JSON array.

**CRITICAL RESPONSE FORMATTING RULES:**
1.  **JSON ONLY:** Your entire output MUST be a single, valid JSON array of objects. Do not include any explanatory text, markdown formatting (like \`\`\`json), or anything outside of the JSON structure.
2.  **LANGUAGE:** All text content inside the JSON MUST be in ${language === 'he' ? 'Hebrew' : 'English'}.
3.  **STRUCTURE:** Each object in the array represents a dataset and must have the following keys: "name" (string), "summary" (string), "use_cases" (array of strings). The following keys are optional: "link" (string), and "library_identifier" (string).
4.  **EMPTY RESULT:** If no relevant datasets are found, you MUST return an empty array: [].

**TASK INSTRUCTIONS:**
1.  Analyze the user's query to find relevant, up-to-date, and high-quality datasets using your search capabilities.
2.  For each dataset, provide a descriptive name, a brief summary, and a list of primary use cases.
3.  Include a direct link to the dataset if available.
4.  If you can identify a common library identifier (e.g., from Hugging Face Datasets, TensorFlow Datasets like "cifar10"), provide it in the 'library_identifier' field. Otherwise, omit this field from the object.
`;

export async function findDatasets(prompt: string, language: 'en' | 'he'): Promise<{ datasets: Dataset[]; sources: GroundingChunk[] }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(language),
        tools: [{ googleSearch: {} }],
      },
    });

    let jsonText = response.text.trim();
    // The model might still wrap the JSON in markdown backticks. Strip them for robust parsing.
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    
    const datasets: Dataset[] = JSON.parse(jsonText);
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(
        (chunk: any): chunk is GroundingChunk => chunk.web && chunk.web.uri && chunk.web.title
    ) || [];

    return { datasets, sources };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the Gemini API and parse its response.");
  }
}
