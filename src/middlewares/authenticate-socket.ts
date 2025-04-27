import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment";
import { getUserByEmail } from "../models/user/user.model";
import { Socket } from "socket.io";

const authenticateSocket = async (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    jwt.verify(token, JWT_SECRET);

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await getUserByEmail(decoded.email);

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};

export default authenticateSocket;
