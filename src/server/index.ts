import { socketInit } from "./socket";
import { createServer, IncomingMessage, ServerResponse } from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, dir: ".", hostname, port });
const handle = app.getRequestHandler();
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  handle(req, res);
});
export let serverSocketIo: any;

app.prepare().then(() => {
  serverSocketIo = socketInit(server);
  server.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
