import { Button } from "@/lib/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { DotIcon, LoaderIcon, StarIcon } from "lucide-react";
import SourceIconSvg from "@/assets/svg/SourceIconSvg";
import DestinationIconSvg from "@/assets/svg/DestinationIconSvg";
import { User, RideRequest } from "@/sharedTypes";

type RideRequestAcceptedStepProps = {
  currentDriver: User;
  currentRideRequest: RideRequest | null;
  isLoading: boolean;
  onCancelRideRequest: () => void;
};

export const RideRequestAcceptedStep = ({
  currentDriver,
  currentRideRequest,
  isLoading,
  onCancelRideRequest,
}: RideRequestAcceptedStepProps) => (
  <Card className="min-w-[400px] max-w-[400px]">
    <CardHeader>
      <CardTitle>Ride accepted</CardTitle>
      <CardDescription>Meet driver at the pickup point</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col justify-center items-center">
        <div className="relative">
          <img
            className="rounded-full border-4 border-white w-[120px]"
            src={currentDriver?.avatarUrl}
            alt={currentDriver?.name}
            width={120}
          />
        </div>

        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-center">
              {currentDriver?.name}
            </h3>
            <p className="text-xs text-gray-400  flex items-center justify-center gap-1">
              Top rated driver <StarIcon className="h-3 w-3" />
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between  border px-4 gap-2 rounded-md bg-zinc-100">
              <div className="flex items-center text-sm font-medium">
                <p>{currentDriver?.driver?.carName}</p>
                <DotIcon />
                <p>{currentDriver?.driver?.carColor}</p>
              </div>

              <img src="/assets/car.png" alt="carImg" width={45} />
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
                  <span className="text-xs text-gray-500">Start location:</span>
                  <span className="text-sm font-medium">
                    {currentRideRequest?.source?.label}
                  </span>
                </div>
              </div>

              <div className="absolute top-10 left-[22px] border border-dashed border-black  h-[22px] w-[2px]"></div>

              <div className="flex items-center gap-2">
                <DestinationIconSvg />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    Your destination:
                  </span>
                  <span className="text-sm font-medium">
                    {currentRideRequest?.destination?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* RideRequest status ACCEPTED */}
            <div className="flex items-center justify-between px-4 py-2 rounded-md bg-green-600 text-white text-xs">
              <p>Driver will arrive in:</p>
              <span className="px-2 py-1 bg-green-500 rounded-md font-medium">
                05:30Mins
              </span>
            </div>
            {/* RideRequest status ONGOING */}
            {/* TODO */}
          </div>

          <Button
            variant="secondary"
            className="w-full flex items-center gap-2 font-bold text-red-600"
            onClick={onCancelRideRequest}
            disabled={isLoading}
          >
            {isLoading ? <LoaderIcon className="animate-spin" /> : <>Cancel</>}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
