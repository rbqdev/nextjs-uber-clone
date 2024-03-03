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
import { RideRequest, RideRequestStatus, User } from "@prisma/client";
import { useDesktopNotification } from "@/hooks/useDesktopNotifications";
import { useGetUser } from "@/hooks/useGetUser";
import { getRideRequest } from "@/app/api/ride/order/queries";
import { useToast } from "@/lib/shadcn/components/ui/use-toast";
import { useRideRequest } from "@/hooks/useRideRequest";

export default function Driver() {
  const { user: userDriver } = useContext(PageContext);
  const { sendDesktopNotification } = useDesktopNotification();
  const { isLoading: isMutatingRideRequest, updateRideRequest } =
    useRideRequest();
  const [newRideRequestModalOpen, setNewRideRequestModalOpen] = useState(false);
  const [currentRideRequest, setCurrentRideRequest] =
    useState<RideRequest | null>(null);
  const [currentRideUser, setCurrentRideUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleNewRideRequest = useCallback(
    async (rideRequestId: number) => {
      const { rideRequest, rideUser } = await getRideRequest(rideRequestId);

      if (rideRequest) {
        setCurrentRideRequest(rideRequest);
        setCurrentRideUser(rideUser);
        setNewRideRequestModalOpen(true);
        sendDesktopNotification({ description: "New ride order" });
      }
    },
    [sendDesktopNotification]
  );

  const handleDeclineRide = async () => {
    if (!currentRideRequest) {
      return;
    }

    const { rideRequest } = await updateRideRequest({
      orderId: currentRideRequest.id,
      body: { status: RideRequestStatus.CANCELED, driverId: userDriver?.id! },
    });

    if (rideRequest) {
      setCurrentRideRequest(null);
      setNewRideRequestModalOpen(false);
      socketClient.emit("toRider_rideDeclined");
    }
  };

  const handleAcceptRide = async () => {
    if (!currentRideRequest) {
      return;
    }

    const { rideRequest } = await updateRideRequest({
      orderId: currentRideRequest.id,
      body: { status: RideRequestStatus.ACCEPTED, driverId: userDriver?.id! },
    });

    if (rideRequest) {
      setCurrentRideRequest(rideRequest);
      setNewRideRequestModalOpen(false);
      socketClient.emit("toRider_rideAccepted", userDriver?.id!);
    }
  };

  const handleCanceledRideByRider = () => {
    setCurrentRideRequest(null);
    setNewRideRequestModalOpen(false);
    toast({
      variant: "destructive",
      title: "Ride canceled",
      description: "The ride was canceled by the user",
    });
  };

  /** Subscribe socket events */
  useEffect(() => {
    socketClient.on(
      "toDriver_newRideRequest",
      async (rideRequestId: number) => {
        handleNewRideRequest(rideRequestId);
      }
    );
    socketClient.on("toDriver_rideCanceled", async () => {
      handleCanceledRideByRider();
    });
  }, []);

  return (
    <div>
      Driver
      {/* New RideRequest Modal */}
      <Dialog
        open={newRideRequestModalOpen}
        // onOpenChange={() => setNewRideRequestModalOpen(false)}
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
                <b>Distance:</b> {currentRideRequest?.distance?.text}
              </p>
              <p>
                <b>Min:</b> {currentRideRequest?.duration?.text}
              </p>
            </div>
            <div className="text-sm text-center">
              <p>
                <b>From:</b> {currentRideRequest?.source?.label}
              </p>
              <p>
                <b>To:</b> {currentRideRequest?.destination?.label}
              </p>
            </div>
          </div>

          <DialogFooter className="flex items-center gap-2">
            <Button
              className="flex-1 bg-red-500"
              onClick={handleDeclineRide}
              disabled={isMutatingRideRequest}
            >
              Decline
            </Button>
            <Button
              className="flex-1 bg-green-500"
              onClick={handleAcceptRide}
              disabled={isMutatingRideRequest}
            >
              {isMutatingRideRequest ? (
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
