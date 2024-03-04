import { baseUrl } from "@/constants";
import { io } from "socket.io-client";

const socketClient = io(baseUrl);

export default socketClient;
