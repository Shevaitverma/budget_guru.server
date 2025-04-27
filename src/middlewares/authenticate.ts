import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment";
import { getUserByEmail } from "../models/user/user.model";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }

    const user = await getUserByEmail((decoded as any).email);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    req.user = user;
    next();
  });
};

export default authenticate;
