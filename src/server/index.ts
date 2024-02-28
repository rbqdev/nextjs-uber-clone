import { createServer, IncomingMessage, ServerResponse } from "http";
import next, { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer, Socket } from "socket.io";

type Payload = any;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, dir: ".", hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handle(req, res);
  });

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

  server.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
