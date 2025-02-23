import express, { Router, Request, Response } from "express";
const router: Router = express.Router();
import {
  submitMoodTrackingAnswers,
  fetchQuestionsForMoodTracking,
  calculateDailyMoodAverage,
} from "../controllers/moodController";
import { userAuthenticationMiddleware } from "../middleware/userAuthenticationMiddleware";
router.get(
  "/mood_tracking_questions",
  userAuthenticationMiddleware,
  fetchQuestionsForMoodTracking
);
router.post(
  "/submit_mood_tracking_answers",
  userAuthenticationMiddleware,
  submitMoodTrackingAnswers
);
router.get(
  "/mood_tracking_average",
  userAuthenticationMiddleware,
  calculateDailyMoodAverage
);

export default router;
