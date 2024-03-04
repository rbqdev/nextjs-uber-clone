import { Button } from "@/lib/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { DotIcon, LoaderIcon } from "lucide-react";
import SourceIconSvg from "@/assets/svg/SourceIconSvg";
import DestinationIconSvg from "@/assets/svg/DestinationIconSvg";
import { User, RideRequest } from "@/sharedTypes";
import { RideRequestStatus } from "@prisma/client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/lib/shadcn/components/ui/alert";

type RideRequestCardProps = {
  currentRider: User;
  currentRideRequest: RideRequest | null;
  isLoading: boolean;
  onAcceptRideRequest: () => void;
  onCancelAcceptedRideRequest: () => void;
  onIgnoreRideRequest: () => void;
};

export const RideRequestCard = ({
  currentRider,
  currentRideRequest,
  isLoading,
  onAcceptRideRequest,
  onCancelAcceptedRideRequest,
  onIgnoreRideRequest,
}: RideRequestCardProps) => {
  const isRideRequestAccepted =
    currentRideRequest?.status === RideRequestStatus.ACCEPTED ||
    currentRideRequest?.status === RideRequestStatus.ONGOING;

  return (
    <Card className="min-w-[400px] max-w-[400px]">
      <CardHeader>
        <CardTitle>New ride request</CardTitle>
        <CardDescription>See informations and map route</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center items-center">
          <div className="relative">
            <img
              className="rounded-full border-4 border-white"
              src={currentRider?.avatarUrl}
              alt={currentRider?.name}
              width={120}
            />
          </div>

          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-center">
                {currentRider?.name}
              </h3>
              <p className="text-xs text-gray-400  flex items-center justify-center gap-1">
                {currentRider?.email}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center border px-4 gap-2 rounded-md bg-zinc-100">
                <div className="flex flex-col items-center py-2">
                  <strong className="text-xl ">
                    {currentRideRequest?.amount}
                  </strong>
                  <p className="text-xs text-zinc-400">
                    This will be the amount paid
                  </p>
                </div>
              </div>

              <div className="flex items-center border px-4 gap-2 rounded-md bg-zinc-100 py-2">
                <div className="flex items-center text-sm font-medium">
                  <p>{currentRideRequest?.distance?.text}</p>
                  <DotIcon />
                  <p>{currentRideRequest?.duration?.text}</p>
                </div>
              </div>

              <div className="relative flex flex-col border px-4 py-2 gap-4 rounded-md bg-zinc-100">
                <div className="flex items-center gap-2">
                  <SourceIconSvg />{" "}
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      Start location:
                    </span>
                    <span className="text-sm font-medium">
                      {currentRideRequest?.source?.label}
                    </span>
                  </div>
                </div>

                <div className="absolute top-10 left-[22px] border border-dashed border-black h-[22px] w-[2px]"></div>

                <div className="flex items-center gap-2">
                  <DestinationIconSvg />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Destination:</span>
                    <span className="text-sm font-medium">
                      {currentRideRequest?.destination?.label}
                    </span>
                  </div>
                </div>
              </div>

              {isRideRequestAccepted && (
                <Alert>
                  <AlertTitle className="text-center font-bold text-xl text-green-600">
                    Ride accepted!
                  </AlertTitle>
                  <AlertDescription>
                    <div className="flex flex-col">
                      <div className=" flex flex-col">
                        <p className="text-xs ">Some important informations:</p>
                      </div>
                      <ul className="list-disc pl-4 text-xs">
                        <li>Drive safe</li>
                        <li>Be polite</li>
                        <li>
                          Both you and the rider have the right to cancel the
                          ride anytime
                        </li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isRideRequestAccepted ? (
                <>
                  <Button
                    variant="secondary"
                    className="w-full flex items-center gap-2 font-bold text-red-600"
                    onClick={onIgnoreRideRequest}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full flex items-center gap-2 font-bold bg-green-600"
                    onClick={onAcceptRideRequest}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoaderIcon className="animate-spin" />
                    ) : (
                      <>Accept</>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full flex items-center gap-2 font-bold text-red-600"
                  onClick={onCancelAcceptedRideRequest}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <>Cancel</>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
