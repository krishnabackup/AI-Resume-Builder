import { chatBotAPIResponse } from "../ai/aiService.js"

export const ChatbotResponse = async (req, res) => {
  const { message, prevMsg, isLoggedIn } = req.body;
  const aiResponse = await chatBotAPIResponse(message, prevMsg, isLoggedIn);
  res.json({ reply: aiResponse });
};
