"use client";

import socketClient from "@/configs/socket/client";
import { Button } from "@/lib/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/shadcn/components/ui/dialog";
import { Label } from "@/lib/shadcn/components/ui/label";
import { UserIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { PageContext } from "../layout";

export default function Driver() {
  const { user } = useContext(PageContext);
  const [modalNewRiderOpen, setModalNewRiderOpen] = useState(false);

  useEffect(() => {
    socketClient.on("toClient_newRideOrder", (payload) => {
      if (Notification.permission === "granted") {
        const notification = new Notification("Goober", {
          body: "New ride order",
        });
        notification.addEventListener("click", (event) => {
          window.parent.parent.focus();
        });
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            // The tab has become visible so clear the now-stale Notification.
            notification.close();
          }
        });
      }

      setModalNewRiderOpen(true);
    });
  }, []);

  return (
    <div>
      Driver
      <Dialog
        open={modalNewRiderOpen}
        onOpenChange={() => setModalNewRiderOpen(false)}
      >
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Ride</DialogTitle>
            <DialogDescription>User wants</DialogDescription>
          </DialogHeader>
          <div>
            Robson Queiroz
            <UserIcon />
          </div>

          <DialogFooter className="flex items-center gap-2">
            <Button className="flex-1" variant="destructive">
              Decline
            </Button>
            <Button className="flex-1">Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
