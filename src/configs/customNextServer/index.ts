import { createServer, IncomingMessage, ServerResponse } from "http";
import next from "next";
import { socketInit } from "../socket/server";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;
const app = next({ dev: true, dir: ".", hostname, port });
const handle = app.getRequestHandler();
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  handle(req, res);
});

socketInit(server);
server.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
