import mongoose, { Document, Schema } from "mongoose";

interface Response {
  question: string;
  answer: number;
}
interface MoodTrackingInterface extends Document {
  user_ID: string;
  responses: Response[];
  date: Date;
}

const MoodTrackingSchema = new Schema<MoodTrackingInterface>({
  user_ID: { type: String, required: true },
  responses: [
    {
      question: { type: String, required: true },
      answer: { type: Number, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
});

const MoodTracking = mongoose.model<MoodTrackingInterface>(
  "MoodTracking",
  MoodTrackingSchema
);

export default MoodTracking;
