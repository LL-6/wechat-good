import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// Initialize the client strictly with environment variables
// Supports both Vite (import.meta.env) for Vercel deployment and process.env for other environments
const getClient = () => {
  if (!client) {
    // Check Vite env first (standard for Vercel/Vite apps), then fallback to process.env
    // We cast import.meta to any to avoid TS errors in strict mode if types aren't set up
    const apiKey = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("API Key is missing. Please set VITE_API_KEY in your environment variables.");
    }
    
    client = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return client;
};

export const generateAIResponse = async (
  messageHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // We use the 2.5 flash model for quick chat interactions
    const modelId = 'gemini-2.5-flash';

    const lastMessage = messageHistory[messageHistory.length - 1];
    const history = messageHistory.slice(0, -1);
    
    // Re-initialize chat with history
    const session = ai.chats.create({
        model: modelId,
        config: {
            systemInstruction: "You are a helpful assistant inside a chat app. Keep replies short and conversational.",
        },
        history: history,
    });

    const result = await session.sendMessage({
        message: lastMessage.parts[0].text
    });

    return result.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "网络错误，请稍后再试。";
  }
};