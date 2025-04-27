import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  httpLogin,
  httpLogout,
  httpSignupWithEmail,
} from "../controllers/auth.controller";

import authenticate from "../middlewares/authenticate";
import { validator } from "../middlewares/validator";

import { signupSchema } from "../validators/auth.validator";

import { CLIENT_URL, JWT_SECRET } from "../config/environment";

const authRouter = Router();

authRouter.get("/login", authenticate, httpLogin);
authRouter.get("/logout", httpLogout);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user!._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`${CLIENT_URL}/profile?token=${token}`);
  }
);

authRouter.post(
  "/email/signup",
  validator.body(signupSchema),
  httpSignupWithEmail
);
authRouter.post(
  "/email",
  passport.authenticate("email", { session: false }),
  httpLogin
);

export default authRouter;
