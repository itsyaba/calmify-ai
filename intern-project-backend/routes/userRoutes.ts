import express, { Router } from "express";
const router: Router = express.Router();
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/userController";
import { authenticateUser } from "../middleware/userAuthenticationMiddleware";

router.post("/create_user", createUser);
router.post("/login_user", loginUser);
router.get("/authenticate_user", authenticateUser);
router.get("/logout_user", logoutUser);

export default router;
