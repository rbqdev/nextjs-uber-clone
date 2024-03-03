import { Button } from "@/lib/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { LoaderIcon } from "lucide-react";

type RideRequestSearchingDriverStepProps = {
  isLoading: boolean;
  onCancelRideRequest: () => void;
};

export const RideRequestSearchingDriverStep = ({
  isLoading,
  onCancelRideRequest,
}: RideRequestSearchingDriverStepProps) => (
  <Card className="min-w-[400px] max-w-[400px]">
    <CardHeader>
      <CardTitle>Searching for driver...</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative flex items-center justify-center ">
        <div className="absolute bg-blue-400 animate-ping w-[80px] h-[80px] z-0 rounded-full"></div>
        <img
          src="https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png"
          alt="carImg"
          width={80}
          height={80}
          className="z-10 w-[200px] h-[200px]"
        />
      </div>
    </CardContent>
    <CardFooter>
      <Button
        variant="destructive"
        className="w-full flex items-center gap-2 font-bold"
        onClick={onCancelRideRequest}
        disabled={isLoading}
      >
        {isLoading ? <LoaderIcon className="animate-spin" /> : <>Cancel</>}
      </Button>
    </CardFooter>
  </Card>
);
