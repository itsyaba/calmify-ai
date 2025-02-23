import AI_CHAT from "../models/AIchatModel";
import { Request, Response } from "express";
import OpenAI from "openai";

const OPENAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface userInterface {
  _id: string;
  username: string;
  email: string;
  password: string;
}

interface chatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const createTitleForConversations = async (
  initialMessage: string
): Promise<string> => {
  console.log("initialMessage", initialMessage);
  try {
    const titleForConversation = await OPENAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Summarize the following chat in 5 words or less.",
        },
        { role: "user", content: initialMessage },
      ],
    });

    if (
      !titleForConversation.choices ||
      titleForConversation.choices.length === 0 ||
      !titleForConversation.choices[0].message?.content
    ) {
      console.error("AI returned an unexpected response structure.");
      return "No Conversation title";
    }

    return titleForConversation.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error creating conversation title:", error);
    return "No Conversation title";
  }
};
export const createNewChat = async (req: Request, res: Response) => {
  const { chat_ID, user_question } = req.body;

  const user: userInterface | undefined = req.user as userInterface;
  if (!user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  const user_ID = user._id;

  try {
    let chatWithAI;

    if (chat_ID) {
      chatWithAI = await AI_CHAT.findById(chat_ID);

      if (chatWithAI) {
        chatWithAI.messages.push({
          role: "user",
          content: user_question,
          timestamp: new Date(),
        });

        const responseFromAI = await OPENAI.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant. Format all your responses using Markdown. Use headings, bold, italics, lists, and code blocks when appropriate.",
            },
            ...chatWithAI.messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          ],
        });

        const AI_response: chatMessage = {
          role: "assistant",
          content: responseFromAI.choices[0].message.content ?? "No response",
          timestamp: new Date(),
        };
        chatWithAI.messages.push(AI_response);

        await chatWithAI.save();

        res.json({
          success: true,
          message: "Successful response from AI",
          chat_ID: chatWithAI._id,
          chat_title: chatWithAI.chat_title,
          AI_response: AI_response.content,
        });
        return;
      } else {
        res.status(404).json({ success: false, message: "Chat not found" });
        return;
      }
    } else {
      const chat_title = await createTitleForConversations(user_question);
      chatWithAI = new AI_CHAT({ user_ID, chat_title, messages: [] });
      await chatWithAI.save();
      chatWithAI.messages.push({
        role: "user",
        content: user_question,
        timestamp: new Date(),
      });

      const responseFromAI = await OPENAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant. Format all your responses using Markdown. Use headings, bold, italics, lists, and code blocks when appropriate.",
          },
          ...chatWithAI.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      });
      const AI_response: chatMessage = {
        role: "assistant",
        content: responseFromAI.choices[0].message.content ?? "No response",
        timestamp: new Date(),
      };
      chatWithAI.messages.push(AI_response);

      await chatWithAI.save();
      console.log("AI_response", AI_response);

      res.json({
        success: true,
        message: "Successful response from AI",
        chat_ID: chatWithAI._id,
        chat_title: chatWithAI.chat_title,
        AI_response: AI_response,
        chatWithAI: chatWithAI,
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "No response from AI" });
  }
};
export const fetchPreviousChats = async (req: Request, res: Response) => {
  const user: userInterface | undefined = req.user as userInterface;
  if (!user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  const user_ID = user._id;
  try {
    const getPreviousChats = await AI_CHAT.find({ user_ID }).sort({
      updatedAt: -1,
    });

    if (getPreviousChats) {
      res.status(200).json({ success: true, allChats: getPreviousChats });
      return;
    } else {
      res.status(404).json({
        success: false,
        message: "Failed to fetch previous chats",
        allChats: [],
      });
      return;
    }
  } catch (error) {
    console.log("Error while fetching previous chats", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch previous chats" });
  }
};
export const fetchChatByID = async (req: Request, res: Response) => {
  const chat_ID = req.params.chat_ID;

  try {
    const getChatByID = await AI_CHAT.findById(chat_ID);

    if (getChatByID) {
      res.status(200).json({
        success: true,
        chat: getChatByID,
      });
      return;
    } else {
      res.status(404).json({
        success: false,
        message: "Chat not found",
      });
      return;
    }
  } catch (error) {
    console.log("Error while fetching chat by its ID", error);
    res.status(500).json({ success: false, message: "Failed to fetch chat" });
  }
};
