import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { Server } from "socket.io";
import mainSocket from "./sockets/main";

import router from "./routes";
import webhookRouter from "./webhooks/index.webhook";

import "./config/passport";
import { swaggerOptions } from "./config/swagger";
import { CORS_ORIGINS, MONGODB_URI, PORT } from "./config/environment";
import { API_BASE_URL } from "./config/router";
import logger, { morganStream } from "./config/logger";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const ALLOWED_ORIGINS = CORS_ORIGINS.split(",");

app.set("trust proxy", 1);

app.use("/webhook", webhookRouter);

app.use(express.json());

app.use(
  morgan("combined", {
    stream: morganStream,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (ALLOWED_ORIGINS.indexOf(origin ?? "") !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(passport.initialize());

const swaggerSpecs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
  res.status(200).send("Hello from App!");
});

app.use(API_BASE_URL, router);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err && err.error && err.error.isJoi) {
      return res.status(400).json({
        type: err.type,
        message: err.error.toString(),
      });
    }

    logger.error(`Error: ${err.message}`);
    res.status(500).send("Internal Server Error");
  }
);

mainSocket(io);

export default async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log("App started on " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};
