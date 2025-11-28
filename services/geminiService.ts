
// 这是一个本地模拟服务，不再需要 API Key 或 Google SDK
// 彻底解决了 Vercel 部署时的 process.env 报错问题

const MOCK_REPLIES = [
  "收到！",
  "好的，没问题。",
  "哈哈，真的吗？",
  "稍微等一下哦。",
  "这个很有意思！",
  "原来是这样啊。",
  "👍",
  "正在忙，稍后回你。",
  "改天一起吃饭！",
  "嗯嗯。"
];

export const generateAIResponse = async (
  messageHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  // 模拟网络延迟，让体验更像真实聊天
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

  // 简单的关键词匹配，增加一点点互动感
  const lastUserMessage = messageHistory[messageHistory.length - 1]?.parts[0]?.text || "";
  
  if (lastUserMessage.includes("你好") || lastUserMessage.includes("在吗")) {
    return "你好呀！有什么事吗？";
  }
  
  if (lastUserMessage.includes("名字") || lastUserMessage.includes("是谁")) {
    return "我是你的朋友圈模拟助手。";
  }

  // 默认随机回复
  const randomReply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
  return randomReply;
};
