import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongoDBatlas } from "./config/dbConfig";
import userRoutes from "./routes/userRoutes";
import AIchatRoutes from "./routes/AIchatRoutes";
import moodRoutes from "./routes/moodRoutes";
const app: Application = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", // Allows requests from all domains
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly handle preflight requests (important for `OPTIONS`)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(204).end();
});

app.use(cookieParser());
app.use(express.json());
connectMongoDBatlas();
app.use("/user", userRoutes);
app.use("/chat", AIchatRoutes);
app.use("/mood_tracking", moodRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Yay, the backend for our internship project is working fine 😎",
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Error while starting express server", error);
  } else {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
});
