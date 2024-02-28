"use client";

import { baseUrl } from "@/constants";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Driver() {
  const socketInitialize = async () => {
    const socket = io();
    // Handle socket events on the client-side as needed

    socket.emit("rider", { payload: "teste" });

    socket.on("user", (payload) => {
      console.log("", { payload });
    });

    return () => {
      socket.disconnect();
    };
  };

  useEffect(() => {
    socketInitialize();
  }, []);

  return <div>Driver</div>;
}
