import { NextFunction, Request, Response } from "express";
import USER from "../models/userModel";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
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

export const userAuthenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  interface AuthenticatedRequest extends Request {
    user?: any;
  }

  const authenticationMiddleware = passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "You are not authorized to visit this page",
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "You are not authorized to visit this page",
        });
      }

      (req as AuthenticatedRequest).user = user;
      next();
    }
  );

  authenticationMiddleware(req, res, next);
};

export const authenticateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  interface AuthenticatedRequest extends Request {
    user?: any;
  }

  const authenticateUserToken = passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      console.log("User authentication", user);
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Login to visit this page",
        });
      } else if (!user) {
        return res.status(404).json({
          success: false,
          message: "Login to visit this page",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User authenticated successfully",
          user: user,
        });
      }
    }
  );

  authenticateUserToken(req, res);
};
