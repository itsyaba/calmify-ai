import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface chatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChat extends mongoose.Document {
  user_ID: string;
  chat_title: string;
  messages: chatMessage[];
}

const AIchatSchema = new Schema<AIChat>(
  {
    user_ID: { type: String, required: true },
    chat_title: { type: String, required: true },
    messages: [{ role: String, content: String, timestamp: Date }],
  },
  {
    timestamps: true,
  }
);

const AI_CHAT = mongoose.model<AIChat>("AI_CHAT", AIchatSchema);

export default AI_CHAT;
