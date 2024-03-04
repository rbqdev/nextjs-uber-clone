"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { PageContext } from "../layout";
import {
  createRideRequestMutation,
  updateRideRequestMutation,
} from "@/app/api/ride/request/mutations";
import { RideRequestStatus, UserType } from "@prisma/client";
import socketClient from "@/configs/socket/client";
import { useGetUser } from "@/hooks/useGetUser";
import { User } from "@/sharedTypes";
import { RideRequestFlowSteps } from "./sharedTypes";
import { RideRequestInitialStep } from "./components/rideRequestInitialStep";
import { RideRequestSearchingDriverStep } from "./components/rideRequestSearchingDriverStep";
import { RideRequestAcceptedStep } from "./components/rideRequestAcceptedStep";
import { Map } from "@/components/map";
import { useMap } from "@/hooks/useMap";
import { useCountup } from "@/hooks/useCountup";
import { RideRequest } from "@/sharedTypes";
import { useToast } from "@/lib/shadcn/components/ui/use-toast";
import { getRideAmount } from "@/utils/getRideAmount";
import { useRideAmountConfig } from "@/hooks/useRideAmountConfig";

export default function Rider() {
  const { user, currentUserPosition } = useContext(PageContext);
  const { getUserByType } = useGetUser();
  const { rideAmountConfig, isLoading: isRideAmountConfigLoading } =
    useRideAmountConfig();
  const {
    locationSource,
    locationDestination,
    sourceAutocompleteValue,
    destinationAutocompleteValue,
    directionRoutePoints,
    isGoogleMapsLoaded,
    isUpdatingDirectionRoutePoints,
    setLocationSource,
    handleChangeLocationCords,
    handleSetDirectionRoute,
  } = useMap();
  const { toast } = useToast();
  const [currentRideRequestFlowStep, setCurrentRideRequestFlowStep] =
    useState<RideRequestFlowSteps>(RideRequestFlowSteps.INITIAL);
  const [currentRideRequest, setCurrentRideRequest] =
    useState<RideRequest | null>(null);
  const [currentDriver, setCurrentDriver] = useState<User>(undefined);
  const [isRideRequestLoading, setIsRideRequestLoading] = useState(false);
  const [currentRideAmount, setCurrentRideAmount] = useState("");
  const {
    time: { minutes, seconds },
    isTimeup,
    resetCountup,
    incrementCountup,
    padWithZeros,
  } = useCountup({
    maxMinutes: 0,
    maxSeconds: 130, // Stop search after 30 seconds
  });

  const isPageLoaded = isGoogleMapsLoaded && !isRideAmountConfigLoading;

  const handleSubmitRideRequest = async () => {
    setIsRideRequestLoading(true);
    const route = directionRoutePoints?.routes[0].legs[0];
    const body = {
      riderId: user?.id,
      amount: getRideAmount({
        distance: route?.distance?.value!,
        minimumAmount: rideAmountConfig?.minimumAmount!,
        percentagePerMeters: rideAmountConfig?.percentagePerMeters!,
        locale: rideAmountConfig?.countryLocale!,
        currency: rideAmountConfig?.currency!,
      }),
      distance: route?.distance,
      duration: route?.duration,
      source: locationSource,
      destination: locationDestination,
    };
    const { rideRequest } = await createRideRequestMutation(body);

    if (rideRequest && rideRequest.status === RideRequestStatus.SEARCHING) {
      setCurrentRideRequest(rideRequest);
      setIsRideRequestLoading(false);
      setCurrentRideRequestFlowStep(RideRequestFlowSteps.SEARCHING_DRIVER);
      socketClient.emit("toDriver_newRideRequest", rideRequest.id);
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
    if (updatedRideRequest) {
      setCurrentRideRequest(null);
      setIsRideRequestLoading(false);
      setCurrentRideRequestFlowStep(RideRequestFlowSteps.INITIAL);
      socketClient.emit("toDriver_rideCanceled");
    }
  };

  const handleRideCanceledByDriver = () => {
    toast({
      title: "Ride request canceled",
      description: "The ride was canceled by driver",
    });
    setCurrentRideRequest(null);
    setCurrentRideRequestFlowStep(RideRequestFlowSteps.INITIAL);
  };

  const handleRideAccepted = useCallback(async () => {
    if (currentDriver) {
      return;
    }

    /** Need to be setted with previous value because this function is inside of socket scope */
    let updatedRideRequest = {} as RideRequest;
    setCurrentRideRequest((prevValue) => {
      updatedRideRequest = {
        ...prevValue,
        status: RideRequestStatus.ACCEPTED,
      } as RideRequest;
      return prevValue;
    });

    const driverUser = await getUserByType(UserType.DRIVER);
    if (driverUser) {
      setCurrentDriver(driverUser);
      setCurrentRideRequest(updatedRideRequest);
      setCurrentRideRequestFlowStep(RideRequestFlowSteps.ACCEPTED);
    }
  }, [currentDriver, getUserByType]);

  useEffect(() => {
    if (directionRoutePoints) {
      const route = directionRoutePoints?.routes[0].legs[0];
      setCurrentRideAmount(
        getRideAmount({
          distance: route?.distance?.value!,
          minimumAmount: rideAmountConfig?.minimumAmount!,
          percentagePerMeters: rideAmountConfig?.percentagePerMeters!,
          locale: rideAmountConfig?.countryLocale!,
          currency: rideAmountConfig?.currency!,
        })
      );
    }
  }, [directionRoutePoints, rideAmountConfig]);

  useEffect(() => {
    if (
      currentRideRequestFlowStep === RideRequestFlowSteps.SEARCHING_DRIVER &&
      isTimeup
    ) {
      setCurrentRideRequestFlowStep(RideRequestFlowSteps.INITIAL);
      resetCountup();
      socketClient.emit("toDriver_rideCanceled");
    }
  }, [currentRideRequestFlowStep, isTimeup, resetCountup]);

  useEffect(() => {
    socketClient.on("toRider_rideAccepted", () => {
      handleRideAccepted();
    });
    socketClient.on("toRider_rideCanceledByDriver", () => {
      handleRideCanceledByDriver();
    });
  }, []);

  useEffect(() => {
    if (currentUserPosition) {
      setLocationSource(currentUserPosition);
    }
  }, [currentUserPosition, setLocationSource]);

  return (
    <div className="h-full flex gap-4">
      <section className="flex flex-col gap-4">
        {currentRideRequestFlowStep === RideRequestFlowSteps.INITIAL && (
          <RideRequestInitialStep
            isGoogleMapsLoaded={isPageLoaded}
            sourceAutocompleteValue={sourceAutocompleteValue}
            destinationAutocompleteValue={destinationAutocompleteValue}
            directionRoutePoints={directionRoutePoints}
            isUpdatingDirectionRoutePoints={isUpdatingDirectionRoutePoints}
            isSubmitingRequest={isRideRequestLoading}
            currentRideAmount={currentRideAmount}
            onChangeLocationCords={handleChangeLocationCords}
            onSubmitRideRequest={handleSubmitRideRequest}
          />
        )}

        {currentRideRequestFlowStep ===
          RideRequestFlowSteps.SEARCHING_DRIVER && (
          <RideRequestSearchingDriverStep
            isLoading={isRideRequestLoading}
            minutes={padWithZeros(minutes, 2)}
            seconds={padWithZeros(seconds, 2)}
            isTimeup={isTimeup}
            onCancelRideRequest={handleCancelRideRequest}
            onIncrementCountup={incrementCountup}
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
