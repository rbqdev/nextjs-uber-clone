"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { getRidePrice } from "./utils/getRidePrice";
import { minimumPrice, pricePerMeters } from "./mocks";
import { PageContext } from "../layout";
import {
  createRideRequestMutation,
  updateRideRequestMutation,
} from "@/app/api/ride/order/mutations";
import { RideRequestStatus, RideRequest, UserType } from "@prisma/client";
import socketClient from "@/configs/socket/client";
import { useGetUser } from "@/hooks/useGetUser";
import { User } from "@/app/api/user/sharedTypes";
import {
  GoogleDirectionsRoute,
  LocationEvent,
  LocationEventDetailed,
  RideRequestFlowSteps,
} from "./sharedTypes";
import { googleApiKey } from "@/constants";
import { RideRequestInitialStep } from "./components/rideRequestInitialStep";
import { RideRequestSearchingDriverStep } from "./components/rideRequestSearchingDriverStep";
import { RideRequestAcceptedStep } from "./components/rideRequestAcceptedStep";
import { Map } from "@/components/map";
import { useMap } from "@/hooks/useMap";

export default function Rider() {
  const { user } = useContext(PageContext);
  const { getUserByType } = useGetUser();
  const {
    locationSource,
    locationDestination,
    sourceAutocompleteValue,
    destinationAutocompleteValue,
    directionRoutePoints,
    isGoogleMapsLoaded,
    isUpdatingDirectionRoutePoints,
    handleChangeLocationCords,
    handleSetDirectionRoute,
  } = useMap();
  const [currentRideRequestFlowStep, setCurrentRideRequestFlowStep] =
    useState<RideRequestFlowSteps>(RideRequestFlowSteps.INITIAL);
  const [currentRideRequest, setCurrentRideRequest] =
    useState<RideRequest | null>(null);
  const [currentDriver, setCurrentDriver] = useState<User>(undefined);
  const [isRideRequestLoading, setIsRideRequestLoading] = useState(false);

  const handleSubmitRideRequest = async () => {
    setIsRideRequestLoading(true);
    const route = directionRoutePoints?.routes[0].legs[0];
    const body = {
      riderId: user?.id,
      price: getRidePrice({
        distance: route?.distance?.value!,
        minimumPrice: minimumPrice,
        pricePerMeters: pricePerMeters,
      }),
      distance: route?.distance,
      duration: route?.duration,
      source: locationSource,
      destination: locationDestination,
    };
    const { rideRequest } = await createRideRequestMutation(body);

    if (rideRequest && rideRequest.status === RideRequestStatus.SEARCHING) {
      socketClient.emit("toDriver_newRideRequest", rideRequest.id);
      setCurrentRideRequest(rideRequest);
      setIsRideRequestLoading(false);
      setCurrentRideRequestFlowStep(RideRequestFlowSteps.SEARCHING_DRIVER);
    }
  };

  const handleCancelRideRequest = async () => {
    setIsRideRequestLoading(true);

    const body = {
      status: RideRequestStatus.CANCELED,
    };
    const { rideRequest: updatedRideRequest } = await updateRideRequestMutation(
      currentRideRequest?.id!,
      body
    );

    if (
      updatedRideRequest &&
      updatedRideRequest.status === RideRequestStatus.CANCELED
    ) {
      setCurrentRideRequest(null);
      setIsRideRequestLoading(false);
      setCurrentRideRequestFlowStep(RideRequestFlowSteps.INITIAL);
      socketClient.emit("toDriver_rideCanceled");
    }
  };

  const handleRideAccepted = useCallback(async () => {
    if (currentDriver) {
      return;
    }

    let updatedRideRequest = {} as RideRequest;
    setCurrentRideRequest((prevValue) => {
      updatedRideRequest = {
        ...prevValue,
        status: RideRequestStatus.ACCEPTED,
      } as RideRequest;
      return prevValue;
    });

    const driverUser = await getUserByType(UserType.DRIVER);
    setCurrentDriver(driverUser);
    setCurrentRideRequest(updatedRideRequest);
    setCurrentRideRequestFlowStep(RideRequestFlowSteps.ACCEPTED);
  }, [currentDriver, getUserByType]);

  useEffect(() => {
    socketClient.on("toRider_rideAccepted", () => {
      handleRideAccepted();
    });
  }, []);

  return (
    <div className="h-full flex gap-4">
      <section className="flex flex-col gap-4">
        {currentRideRequestFlowStep === RideRequestFlowSteps.INITIAL && (
          <RideRequestInitialStep
            isGoogleMapsLoaded={isGoogleMapsLoaded}
            sourceAutocompleteValue={sourceAutocompleteValue}
            destinationAutocompleteValue={destinationAutocompleteValue}
            directionRoutePoints={directionRoutePoints}
            isUpdatingDirectionRoutePoints={isUpdatingDirectionRoutePoints}
            isSubmitingRequest={isRideRequestLoading}
            onChangeLocationCords={handleChangeLocationCords}
            onSubmitRideRequest={handleSubmitRideRequest}
          />
        )}

        {currentRideRequestFlowStep ===
          RideRequestFlowSteps.SEARCHING_DRIVER && (
          <RideRequestSearchingDriverStep
            isLoading={isRideRequestLoading}
            onCancelRideRequest={handleCancelRideRequest}
          />
        )}

        {(currentRideRequestFlowStep === RideRequestFlowSteps.ACCEPTED ||
          currentRideRequestFlowStep === RideRequestFlowSteps.ONGOING) && (
          <RideRequestAcceptedStep
            isLoading={isRideRequestLoading}
            currentDriver={currentDriver}
            currentRideRequest={currentRideRequest}
            onCancelRideRequest={handleCancelRideRequest}
          />
        )}
      </section>

      {/* map */}
      <section className="flex-1 h-full bg-zinc-200 rounded-md">
        <Map
          isMapLoaded={isGoogleMapsLoaded}
          locationSource={locationSource}
          locationDestination={locationDestination}
          directionRoutePoints={directionRoutePoints}
          onSetDirectionRoute={handleSetDirectionRoute}
        />
      </section>
    </div>
  );
}
