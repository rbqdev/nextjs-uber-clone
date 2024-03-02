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
import { LoaderIcon, UserIcon } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { PageContext } from "../layout";
import { RideOrder, RideOrderStatus, User } from "@prisma/client";
import { useDesktopNotification } from "@/hooks/useDesktopNotifications";
import { useRideOrder } from "@/hooks/useRideOrder";
import { useGetUser } from "@/hooks/useGetUser";
import { getRideOrder } from "@/app/api/ride/order/queries";
import { useToast } from "@/lib/shadcn/components/ui/use-toast";

export default function Driver() {
  const { user: userDriver } = useContext(PageContext);
  const { sendDesktopNotification } = useDesktopNotification();
  const { isLoading: isMutatingRideOrder, updateRideOrder } = useRideOrder();
  const [newRideOrderModalOpen, setNewRideOrderModalOpen] = useState(false);
  const [currentRideOrder, setCurrentRideOrder] = useState<RideOrder | null>(
    null
  );
  const [currentRideUser, setCurrentRideUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleNewRideOrder = useCallback(
    async (rideOrderId: number) => {
      const { rideOrder, rideUser } = await getRideOrder(rideOrderId);

      if (rideOrder) {
        setCurrentRideOrder(rideOrder);
        setCurrentRideUser(rideUser);
        setNewRideOrderModalOpen(true);
        sendDesktopNotification({ description: "New ride order" });
      }
    },
    [sendDesktopNotification]
  );

  const handleDeclineRide = async () => {
    if (!currentRideOrder) {
      return;
    }

    const { rideOrder } = await updateRideOrder({
      orderId: currentRideOrder.id,
      body: { status: RideOrderStatus.CANCELED, userDriverId: userDriver?.id! },
    });

    if (rideOrder) {
      setCurrentRideOrder(null);
      setNewRideOrderModalOpen(false);
      socketClient.emit("toRider_rideDeclined");
    }
  };

  const handleAcceptRide = async () => {
    if (!currentRideOrder) {
      return;
    }

    const { rideOrder } = await updateRideOrder({
      orderId: currentRideOrder.id,
      body: { status: RideOrderStatus.ACCEPTED, userDriverId: userDriver?.id! },
    });

    if (rideOrder) {
      setCurrentRideOrder(rideOrder);
      setNewRideOrderModalOpen(false);
      socketClient.emit("toRider_rideAccepted", userDriver?.id!);
    }
  };

  const handleCanceledRideByRider = () => {
    console.log("Chegou aqui");
    setCurrentRideOrder(null);
    setNewRideOrderModalOpen(false);
    toast({
      variant: "destructive",
      title: "Ride canceled",
      description: "The ride was canceled by the user",
    });
  };

  /** Subscribe socket events */
  useEffect(() => {
    socketClient.on("toDriver_newRideOrder", async (rideOrderId: number) => {
      handleNewRideOrder(rideOrderId);
    });
    socketClient.on("toDriver_rideCanceled", async () => {
      handleCanceledRideByRider();
    });
  }, []);

  return (
    <div>
      Driver
      {/* New RideOrder Modal */}
      <Dialog
        open={newRideOrderModalOpen}
        // onOpenChange={() => setNewRideOrderModalOpen(false)}
      >
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New ride request</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-2">
            <img
              className="rounded-md border w-60"
              src={currentRideUser?.avatarUrl}
              alt={currentRideUser?.name}
            />
            <h3 className="text-2xl font-bold">{currentRideUser?.name}</h3>
            <div className="text-xs text-center text-slate-500">
              <p>
                <b>Distance:</b> {currentRideOrder?.distance?.text}
              </p>
              <p>
                <b>Min:</b> {currentRideOrder?.duration?.text}
              </p>
            </div>
            <div className="text-sm text-center">
              <p>
                <b>From:</b> {currentRideOrder?.source?.label}
              </p>
              <p>
                <b>To:</b> {currentRideOrder?.destination?.label}
              </p>
            </div>
          </div>

          <DialogFooter className="flex items-center gap-2">
            <Button
              className="flex-1 bg-red-500"
              onClick={handleDeclineRide}
              disabled={isMutatingRideOrder}
            >
              Decline
            </Button>
            <Button
              className="flex-1 bg-green-500"
              onClick={handleAcceptRide}
              disabled={isMutatingRideOrder}
            >
              {isMutatingRideOrder ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                "Accept"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
