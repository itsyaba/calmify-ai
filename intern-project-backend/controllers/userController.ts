import { NextFunction, Request, Response } from "express";
import USER from "../models/userModel";
import validator from "validator";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const dotenv = require("dotenv");
dotenv.config();
const opts = {
  jwtFromRequest: (req: Request) => {
    return req.cookies ? req.cookies.internship : null;
  },
  secretOrKey: process.env.TOKEN_SECRET!,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await USER.findById(jwtPayload._id);
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.json({ success: false, message: "All fields must be filled" });
      return;
    }
    if (!validator.isEmail(email)) {
      res.json({ success: false, message: "Email is not valid" });
      return;
    }
    if (!validator.isStrongPassword(password)) {
      res.json({ success: false, message: "Password is not strong" });
      return;
    }
    const doesUserExist = await USER.findOne({ email });

    if (doesUserExist) {
      res.json({
        success: false,
        message: "You already have an account,please login",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await USER.create({ username, email, password: hash });

    if (newUser) {
      const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET!, {
        expiresIn: "3d",
      });

      res.cookie("internship", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: "Signup Successful!",
        user: newUser,
      });
      return;
    } else {
      res.status(400).json({
        success: false,
        message: "Signup failed",
      });
      return;
    }
  } catch (error) {
    console.log("Error while registering user", error);
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const doesUserExist = await USER.findOne({
      email: email,
    });

    if (!doesUserExist) {
      res.status(404).json({
        success: false,
        message: "Email does not exist.Please Signup",
      });
      return;
    }
    if (!(await bcrypt.compare(password, doesUserExist.password))) {
      res.status(404).json({
        success: false,
        message: "Password is incorrect",
      });
      return;
    }

    if (doesUserExist) {
      const token = jwt.sign(
        { _id: doesUserExist._id },
        process.env.TOKEN_SECRET!,
        {
          expiresIn: "3d",
        }
      );

      res.cookie("internship", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login Successful!",
        user: doesUserExist,
      });
      return;
    }
  } catch (error) {
    console.log("Error during user Login", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("internship", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
      user: null,
      isAuthenticated: false,
    });
  } catch (error) {
    console.log("Error during logout", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};
