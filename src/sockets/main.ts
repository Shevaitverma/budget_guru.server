import { Server } from "socket.io";

import authenticateSocket from "../middlewares/authenticate-socket";

const mainSocket = (io: Server) => {
  const mainIO = io.of("/");

  mainIO.use(authenticateSocket);

  mainIO.on("connection", (socket) => {
    console.log("User connected", socket.user.name);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default mainSocket;
