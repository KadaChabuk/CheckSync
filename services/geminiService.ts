
import { GoogleGenAI, Type } from "@google/genai";

export const generateChecklistSuggestions = async (title: string, description: string) => {
  // Fix: Always use direct API key initialization from environment variable
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a professional checklist for the topic: "${title}". 
  Context: ${description || 'General professional task'}.
  Provide a list of detailed, actionable tasks including a title, suggested priority (low, medium, high), and a brief description for each task.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
            },
            required: ['title', 'priority', 'description']
          }
        }
      }
    });

    // Directly access text property as per guidelines
    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return [];
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return [];
  }
};
