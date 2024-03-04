import { Server as IOServer, Socket } from "socket.io";

type Payload = string | number | boolean | undefined;

export const socketInit = (server: any) => {
  const io = new IOServer(server, {
    maxHttpBufferSize: 1e8,
  });
  io.on("connection", (socket: Socket) => {
    socket.on("connect", () => {
      console.log("User connected");
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    /**
     * Gooober Events
     * Only primitive types accepted on payload: string, number or boolean
     */

    /** Rider events */
    socket.on("toRider_rideAccepted", (payload: Payload) => {
      io.emit("toRider_rideAccepted", payload);
    });
    socket.on("toRider_rideCanceledByDriver", () => {
      io.emit("toRider_rideCanceledByDriver");
    });

    /** Driver events */
    socket.on("toDriver_newRideRequest", (payload: Payload) => {
      io.emit("toDriver_newRideRequest", payload);
    });
    socket.on("toDriver_rideCanceled", (payload: Payload) => {
      io.emit("toDriver_rideCanceled", payload);
    });
  });
};
