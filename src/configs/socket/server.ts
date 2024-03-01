import { Server as IOServer, Socket } from "socket.io";

export const socketInit = (server: any) => {
  const io = new IOServer(server);
  io.on("connection", (socket: Socket) => {
    socket.on("connect", () => {
      console.log("User connected");
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
    socket.on("toServer_newRideOrder", (payload: any) => {
      console.log({ payload });
      io.emit("toClient_newRideOrder", payload);
    });
  });
};
