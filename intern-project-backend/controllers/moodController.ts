import { Request, Response } from "express";
import { moodTrackingQuestions } from "../constants/moodTrackingQuestions";
import MoodTracking from "../models/MoodTracking";

interface userInterface {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export const fetchQuestionsForMoodTracking = async (
  req: Request,
  res: Response
) => {
  try {
    res.status(200).json({ success: true, questions: moodTrackingQuestions });
  } catch (error) {
    console.log("Error while fetching Mood tracking questions", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Mood tracking questions",
    });
  }
};

export const submitMoodTrackingAnswers = async (
  req: Request,
  res: Response
) => {
  const { responses } = req.body;

  const user: userInterface | undefined = req.user as userInterface;
  if (!user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  const user_ID = user._id;

  if (!responses) {
    res.status(400).json({ success: false, message: "Answers are required." });
    return;
  }
  try {
    const newMoodTracking = new MoodTracking({ user_ID, responses });
    await newMoodTracking.save();

    if (newMoodTracking) {
      res.status(201).json({
        success: true,
        message: "Your answers submitted successfully",
      });
      return;
    } else {
      res
        .status(400)
        .json({ success: false, message: "Failed to save mood responses" });
      return;
    }
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save mood responses",
    });
  }
};

export const calculateDailyMoodAverage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: userInterface | undefined = req.user as userInterface;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const user_ID = user._id;

    const moodData = await MoodTracking.find({ user_ID });

    if (moodData.length === 0) {
      res.status(404).json({ message: "No mood data found for this user" });
      return;
    }

    const dailyAverages: Record<string, number> = {};

    moodData.forEach((entry) => {
      const dateKey = entry.date.toISOString().split("T")[0];
      let totalSum = 0;
      let count = 0;

      entry.responses.forEach((response) => {
        totalSum += response.answer;
        count++;
      });

      const dailyAverage = count ? totalSum / count : 0;
      dailyAverages[dateKey] = dailyAverage;
    });

    res.status(200).json({
      success: true,
      user_ID: user_ID,
      dailyAverages: dailyAverages,
    });
  } catch (error) {
    console.error("Error calculating daily averages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate daily mood average",
    });
  }
};
