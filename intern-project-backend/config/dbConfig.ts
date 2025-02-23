const dotenv = require("dotenv");
dotenv.config();
import mongoose from "mongoose";

export const connectMongoDBatlas = async () => {
  try {
    const mongoURI = process.env.MONGODB_ATLAS!;
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
