import { Server as IOServer, Socket } from "socket.io";

type Payload = any;

export const socketInit = (server: any) => {
  const io = new IOServer(server);
  io.on("connection", (socket: Socket) => {
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    // Unique user events
    /** Rider events */
    socket.on("rider", (payload: Payload) => {
      console.log("event rider", { payload });
    });
    socket.on("user", (payload: Payload) => {
      console.log("event USER", { payload });
    });

    /** Driver events */
    socket.on("newRideFromRider", (payload: Payload) => {
      console.log("new ride from rider", { payload });
    });

    socket.on("driver", (payload: Payload) => {
      console.log("event driver", { payload });
    });

    // Combined users events
    socket.on("updateRideStatus", (payload: Payload) => {
      console.log("update ride status", { payload });
    });
  });

  return io;
};
