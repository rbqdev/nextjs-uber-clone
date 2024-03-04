import DestinationIconSvg from "@/assets/svg/DestinationIconSvg";
import SourceIconSvg from "@/assets/svg/SourceIconSvg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import { GooglePlacesAutocompleteInput } from "./googlePlacesAutocomplete";
import { OrderInformationCard } from "./informationCard";
import { GoogleMapsDirectionsRoute, LocationEvent } from "@/sharedTypes";

type RideRequestInitialStepProps = {
  isGoogleMapsLoaded: boolean;
  sourceAutocompleteValue: any;
  destinationAutocompleteValue: any;
  directionRoutePoints: GoogleMapsDirectionsRoute;
  isUpdatingDirectionRoutePoints: boolean;
  isSubmitingRequest: boolean;
  currentRideAmount: string;
  onChangeLocationCords: (event: LocationEvent, type: string) => void;
  onSubmitRideRequest: () => void;
};

export const RideRequestInitialStep = ({
  isGoogleMapsLoaded,
  sourceAutocompleteValue,
  destinationAutocompleteValue,
  directionRoutePoints,
  isUpdatingDirectionRoutePoints,
  isSubmitingRequest,
  currentRideAmount,
  onChangeLocationCords,
  onSubmitRideRequest,
}: RideRequestInitialStepProps) => {
  return (
    <>
      <Card className="min-w-[400px] max-w-[400px]">
        <CardHeader>
          <CardTitle>Get a ride</CardTitle>
          <CardDescription>Pick the locations</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid w-full gap-2">
            <div className="z-20">
              <GooglePlacesAutocompleteInput
                isGoogleMapsLoaded={isGoogleMapsLoaded}
                leftIcon={<SourceIconSvg />}
                placeholder="Enter pickup location"
                autocompleteType="source"
                autocompleteValue={sourceAutocompleteValue}
                isDisabled={isSubmitingRequest}
                onChangeLocationCords={onChangeLocationCords}
              />
            </div>
            <div className="z-10">
              <GooglePlacesAutocompleteInput
                isGoogleMapsLoaded={isGoogleMapsLoaded}
                leftIcon={<DestinationIconSvg />}
                placeholder="Where to?"
                autocompleteType="destination"
                autocompleteValue={destinationAutocompleteValue}
                isDisabled={isSubmitingRequest}
                onChangeLocationCords={onChangeLocationCords}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {directionRoutePoints && (
        <OrderInformationCard
          directionRoutePoints={directionRoutePoints}
          isLoading={isUpdatingDirectionRoutePoints}
          isSubmiting={isSubmitingRequest}
          currentRideAmount={currentRideAmount}
          onSubmitRideRequest={onSubmitRideRequest}
        />
      )}
    </>
  );
};
