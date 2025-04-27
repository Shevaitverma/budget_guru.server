import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser } from "../models/user/user.model";
import { CLIENT_URL, JWT_SECRET } from "../config/environment";

// Handle login, return JWT token instead of relying on session or cookies
export const httpLogin = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      // Generate JWT
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: req.user,
        token, // Send the JWT token
      });
    } else {
      throw new Error("User not authenticated");
    }
  } catch (error) {
    res.statusMessage = "Error logging in";
    res.status(401).send("Error logging in");
  }
};

// Handle logout, simply redirect as we don't need to invalidate JWTs server-side
export const httpLogout = async (req: Request, res: Response) => {
  try {
    res.redirect(CLIENT_URL + "/login");
  } catch (error) {
    res.statusMessage = "Error logging out";
    res.status(401).send("Error logging out");
  }
};

// Handle signup with email
export const httpSignupWithEmail = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    if (!name) {
      return res.status(500).send("Name is required");
    }
    if (!email) {
      return res.status(500).send("Email is required");
    }
    if (!password || password.length === 0) {
      return res.status(500).send("Password is required");
    }

    const newUser = await createUser({
      name,
      email,
      password,
      provider: {
        provider: "email",
      },
    });

    // Generate JWT after successful signup
    const token = jwt.sign(
      { id: newUser!._id, email: newUser!.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token, // Send the JWT token
    });
  } catch (error) {
    res.statusMessage = "Error signing up";
    res.status(401).send("Error signing up");
  }
};
