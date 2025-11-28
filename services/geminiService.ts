// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;
let hasApiKey = false;

// Initialize the client strictly with environment variables
const getClient = () => {
  if (!client) {
    // Check Vite env first (standard for Vercel/Vite apps), then fallback to process.env
    const apiKey = (import.meta as any).env?.VITE_API_KEY;
    
    if (apiKey && apiKey.length > 0) {
      client = new GoogleGenAI({ apiKey: apiKey });
      hasApiKey = true;
    } else {
      console.warn("API Key is missing. AI chat will be in mock mode.");
      hasApiKey = false;
    }
  }
  return client;
};

export const generateAIResponse = async (
  messageHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  // Ensure client is initialized
  getClient();

  // 1. 如果没有 API Key，返回模拟提示，不报错
  if (!hasApiKey) {
    // 模拟延迟，更逼真
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "⚠️ 提示：您未配置 API Key，无法进行 AI 智能对话。\n\n✅ 但这不影响您使用“朋友圈模拟器”！\n\n如需启用 AI 对话，请在部署平台配置 VITE_API_KEY。";
  }

  try {
    const ai = getClient();
    if (!ai) throw new Error("AI Client not initialized");

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

    return result.text || "我暂时无法回答。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "网络连接不稳定，请检查配置。";
  }
};