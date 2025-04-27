import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";


import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} from "./environment";
import { createUser, getUserByEmail } from "../models/user/user.model";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/v1/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await getUserByEmail(profile.emails?.[0].value ?? "");

      if (!user) {
        const newUser = await createUser({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          dp: profile.photos?.[0].value ?? "",
          provider: {
            provider: "google",
            id: profile.id,
          },
        });
        if (newUser) {
          return done(null, newUser);
        }
      } else {
        return done(null, user);
      }
    }
  )
);

passport.use(
  "email",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email, true);

        if (!user) return done(null, false);

        const passwordMatch = await user.verifyPassword(password);

        if (!passwordMatch) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
