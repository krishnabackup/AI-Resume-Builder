import express from "express";
import { ChatbotResponse } from "../controllers/chatbot.controller.js";

const chatbotRouter = express.Router();

chatbotRouter.post('/chat', ChatbotResponse);

export default chatbotRouter;