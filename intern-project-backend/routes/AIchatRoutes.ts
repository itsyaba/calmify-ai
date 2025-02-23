import express, { Router } from "express";
const router: Router = express.Router();

import {
  createNewChat,
  fetchPreviousChats,
  fetchChatByID,
} from "../controllers/AIchatController";
import { userAuthenticationMiddleware } from "../middleware/userAuthenticationMiddleware";

router.post("/chat_with_ai", userAuthenticationMiddleware, createNewChat);
router.get("/previous_chats", userAuthenticationMiddleware, fetchPreviousChats);
router.get("/find_chat/:chat_ID", userAuthenticationMiddleware, fetchChatByID);

export default router;
