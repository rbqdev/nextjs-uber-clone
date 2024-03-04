"use client";

import { Button } from "@/lib/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

type RideRequestSearchingDriverStepProps = {
  isLoading: boolean;
  minutes: string | number;
  seconds: string | number;
  isTimeup: boolean;
  onIncrementCountup: () => void;
  onCancelRideRequest: () => void;
};

export const RideRequestSearchingDriverStep = ({
  isLoading,
  minutes,
  seconds,
  isTimeup,
  onIncrementCountup,
  onCancelRideRequest,
}: RideRequestSearchingDriverStepProps) => {
  useEffect(() => {
    const interval = setInterval(onIncrementCountup, 1000);
    if (isTimeup) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimeup, onIncrementCountup]);

  return (
    <Card className="min-w-[400px] max-w-[400px]">
      <CardHeader>
        <CardTitle>Searching close drivers...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex items-center justify-center ">
          <div className="absolute bg-blue-400 animate-ping w-[80px] h-[80px] z-0 rounded-full"></div>
          <img
            src="https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png"
            alt="carImg"
            width={200}
            height={200}
            className="z-10"
          />
        </div>

        <div className="text-center text-zinc-500">
          {minutes}:{seconds}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          className="w-full flex items-center gap-2 font-bold text-red-600"
          onClick={onCancelRideRequest}
          disabled={isLoading}
        >
          {isLoading ? <LoaderIcon className="animate-spin" /> : <>Cancel</>}
        </Button>
      </CardFooter>
    </Card>
  );
};
