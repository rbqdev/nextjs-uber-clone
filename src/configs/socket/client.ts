import { baseUrl } from "@/constants";
import { io } from "socket.io-client";

const socketClient = io(baseUrl, {
  transports: ["websocket"],
});

export default socketClient;
