import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { ArrowRightIcon, LoaderIcon, User2Icon } from "lucide-react";
import { Button } from "@/lib/shadcn/components/ui/button";
import { GoogleMapsDirectionsRoute } from "@/sharedTypes";

type OrderInformationCardProps = {
  isLoading: boolean;
  isSubmiting: boolean;
  directionRoutePoints: GoogleMapsDirectionsRoute;
  currentRideAmount: string;
  onSubmitRideRequest: () => void;
};

export const OrderInformationCard = ({
  isLoading,
  isSubmiting,
  directionRoutePoints,
  currentRideAmount,
  onSubmitRideRequest,
}: OrderInformationCardProps) => {
  if (!directionRoutePoints) {
    // Should be a empty state
    return null;
  }

  return (
    <>
      {isLoading ? (
        <Card className="min-w-[400px] max-w-[400px]">
          <CardHeader>
            <CardTitle>Calculating price and distance...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <LoaderIcon className="animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <Card className="min-w-[400px] max-w-[400px]">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center gap-1">
                  <img
                    src="https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png"
                    alt="carImg"
                    width={80}
                    height={80}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">GooberX</span>
                      <div className="flex items-center text-xs">
                        <User2Icon className="w-3 h-3" /> 4
                      </div>
                    </div>
                    <span className="text-sm">
                      {directionRoutePoints.routes[0].legs[0].duration?.text}{" "}
                      distance
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-2xl font-bold">{currentRideAmount}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full flex items-center gap-2"
              onClick={onSubmitRideRequest}
              disabled={isSubmiting}
            >
              {isSubmiting ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <>
                  Search a driver <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
