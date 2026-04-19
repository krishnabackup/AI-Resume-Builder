import express from "express";
import { ChatbotResponse , AdminChatbotResponse , ATSChatbotResponse} from "../controllers/chatbot.controller.js";
import isAuth from "../middlewares/isAuth.js";
const chatbotRouter = express.Router();

chatbotRouter.post('/chat', ChatbotResponse);
chatbotRouter.post('/admin-chat', isAuth, AdminChatbotResponse);
chatbotRouter.post('/ats-advice', isAuth, ATSChatbotResponse);
export default chatbotRouter;