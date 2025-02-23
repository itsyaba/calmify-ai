import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface userInterface extends mongoose.Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<userInterface>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const USER = mongoose.model<userInterface>("USER", userSchema);

export default USER;
