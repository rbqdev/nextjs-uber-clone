"use client";

import { Button } from "@/lib/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/shadcn/components/ui/card";
import {
  ArrowRightIcon,
  ArrowRightToLineIcon,
  DotIcon,
  LoaderIcon,
  StarIcon,
  User2Icon,
} from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  MarkerF,
  OverlayView,
  OverlayViewF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import SourceIconSvg from "@/assets/svg/SourceIconSvg";
import DestinationIconSvg from "@/assets/svg/DestinationIconSvg";
import { getRidePrice } from "./utils/getRidePrice";
import { minimumPrice, pricePerMeters } from "./mocks";
import { PageContext } from "../layout";
import {
  createRideOrderMutation,
  updateRideOrderMutation,
} from "@/app/api/ride/order/mutations";
import { RideOrderStatus, RideOrder, User, UserType } from "@prisma/client";
import socketClient from "@/configs/socket/client";
import { useGetUser } from "@/hooks/useGetUser";
import { UserResponse } from "@/app/api/user/sharedTypes";
import { Separator } from "@/lib/shadcn/components/ui/separator";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;

type LocationEvent = {
  label: string;
  value: Record<string, any>;
} | null;

type LocationSource = {
  lat: number;
  lng: number;
  name: string;
  label: string;
} | null;

enum RideOrderFlowSteps {
  INITIAL = "INITIAL",
  SEARCHING_DRIVER = "SEARCHING_DRIVER",
  ACCEPTED = "ACCEPTED",
  ONBOARDED = "ONBOARDED",
  FINISHED = "FINISHED",
}

export default function Rider() {
  const { user } = useContext(PageContext);
  const [currentRideOrderFlowStep, setCurrentRideOrderFlowStep] =
    useState<RideOrderFlowSteps>(RideOrderFlowSteps.INITIAL);
  const [sourceAutocompleteValue, setSourceAutocompleteValue] =
    useState<LocationEvent>(null);
  const [destinationAutocompleteValue, setDestinationAutocompletevalueValue] =
    useState<LocationEvent>(null);
  const [locationSource, setLocationSource] = useState<LocationSource>(null);
  const [locationDestination, setLocationDestination] =
    useState<LocationSource>(null);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [currentRideOrder, setCurrentRideOrder] = useState<RideOrder | null>(
    null
  );
  const [currentRideDriver, setCurrentRideDriver] = useState<
    UserResponse | undefined
  >(undefined);
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });
  const [center, setCenter] = useState({
    lat: -15.793889,
    lng: -47.882778,
  });
  const [map, setMap] = useState(null);
  const [isMutatingRideOrder, setIsMutatingRideOrder] = useState(false);
  const [isSettingDirectionRoutePoints, setIsSettingDirectionRoutePoints] =
    useState(false);
  const [directionRoutePoints, setDirectionRoutePoints] = useState(null);
  const { getUserByType } = useGetUser();

  const onLoadMap = useCallback((map: any) => {
    setMap(map);
  }, []);

  const onUnmountMap = useCallback(() => {
    setMap(null);
  }, []);

  const getLatAndLnt = (event: LocationEvent, type: string) => {
    const placeId = event?.value.place_id;

    if (!placeId) {
      // Reset values
      if (type === "source") {
        setSourceAutocompleteValue(null);
        setLocationSource(null);
      } else {
        setDestinationAutocompletevalueValue(null);
        setLocationDestination(null);
      }
      setDirectionRoutePoints(null);
      return;
    }
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (place, status) => {
      if (status === "OK") {
        if (type === "source") {
          setSourceAutocompleteValue(event);
          setLocationSource({
            lat: place?.geometry?.location?.lat()!,
            lng: place?.geometry?.location?.lng()!,
            name: place?.formatted_address!,
            label: place?.name!,
          });
        } else if (type === "destination") {
          setDestinationAutocompletevalueValue(event);
          setLocationDestination({
            lat: place?.geometry?.location?.lat()!,
            lng: place?.geometry?.location?.lng()!,
            name: place?.formatted_address!,
            label: place?.name!,
          });
        }
      }
    });
  };

  const setDirectionRoute = useCallback(() => {
    try {
      setIsSettingDirectionRoutePoints(true);
      const directionService = new google.maps.DirectionsService();
      directionService.route(
        {
          origin: { lat: locationSource?.lat!, lng: locationSource?.lng! },
          destination: {
            lat: locationDestination?.lat!,
            lng: locationDestination?.lng!,
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            // @ts-ignore
            setDirectionRoutePoints(result);
          } else {
            console.error("Error to set routes");
          }
        }
      );
    } catch (error) {
      console.error("Error to set routes");
    } finally {
      setTimeout(() => {
        setIsSettingDirectionRoutePoints(false);
      }, 1000);
    }
  }, [
    locationDestination?.lat,
    locationDestination?.lng,
    locationSource?.lat,
    locationSource?.lng,
  ]);

  useEffect(() => {
    if (locationSource) {
      // @ts-ignore
      map?.panTo({
        lat: locationSource.lat,
        lng: locationSource.lng,
      });
      setCenter({
        lat: locationSource.lat,
        lng: locationSource.lng,
      });
    }

    if (locationSource && locationDestination) {
      setDirectionRoute();
    }
  }, [locationDestination, map, setDirectionRoute, locationSource]);

  useEffect(() => {
    // Initial map load
    if (locationDestination) {
      setCenter({
        lat: locationDestination.lat,
        lng: locationDestination.lng,
      });
    }

    if (locationSource && locationDestination) {
      setDirectionRoute();
    }
  }, [locationDestination, locationSource, setDirectionRoute]);

  const handleSubmitRideOrder = async () => {
    setIsMutatingRideOrder(true);
    // @ts-ignore
    const route = directionRoutePoints?.routes[0].legs[0];
    const body = {
      userRiderId: user?.id,
      price: getRidePrice({
        distance: route.distance.value,
        minimumPrice: minimumPrice,
        pricePerMeters: pricePerMeters,
      }),
      distance: route.distance,
      duration: route.duration,
      source: locationSource,
      destination: locationDestination,
    };
    const { rideOrder } = await createRideOrderMutation(body);

    if (rideOrder && rideOrder.status === RideOrderStatus.SEARCHING) {
      socketClient.emit("toDriver_newRideOrder", rideOrder.id);
      setCurrentRideOrder(rideOrder);
      setIsMutatingRideOrder(false);
      setIsSearchingDriver(true);
      setCurrentRideOrderFlowStep(RideOrderFlowSteps.SEARCHING_DRIVER);
    }
  };

  const handleCancelRideOrder = async () => {
    setIsMutatingRideOrder(true);

    const body = {
      status: RideOrderStatus.CANCELED,
    };
    const { rideOrder: updatedRideOrder } = await updateRideOrderMutation(
      currentRideOrder?.id!,
      body
    );

    if (
      updatedRideOrder &&
      updatedRideOrder.status === RideOrderStatus.CANCELED
    ) {
      if (currentRideOrder?.status === RideOrderStatus.ACCEPTED) {
        socketClient.emit("toDriver_rideCanceled", "canceled");
      }
      setCurrentRideOrder(null);
      setIsMutatingRideOrder(false);

      if (isSearchingDriver) {
        setIsSearchingDriver(false);
      }

      setCurrentRideOrderFlowStep(RideOrderFlowSteps.INITIAL);
    }
  };

  const handleRideAccepted = useCallback(async () => {
    if (currentRideDriver) {
      return;
    }

    let updatedRideOrder = {} as RideOrder;
    setCurrentRideOrder((prevValue) => {
      updatedRideOrder = {
        ...prevValue,
        status: RideOrderStatus.ACCEPTED,
      } as RideOrder;
      return prevValue;
    });

    const driverUser = await getUserByType(UserType.DRIVER);
    setCurrentRideDriver(driverUser);
    setCurrentRideOrder(updatedRideOrder);
    setIsSearchingDriver(false);
    setCurrentRideOrderFlowStep(RideOrderFlowSteps.ACCEPTED);
  }, [currentRideDriver, getUserByType]);

  useEffect(() => {
    socketClient.on("toRider_rideAccepted", () => {
      handleRideAccepted();
    });
  }, []);

  return (
    <div className="h-full flex gap-4">
      <section className="flex flex-col gap-4">
        {currentRideOrderFlowStep === RideOrderFlowSteps.INITIAL && (
          <>
            <Card className="min-w-[400px] max-w-[400px]">
              <CardHeader>
                <CardTitle>Get a ride</CardTitle>
                <CardDescription>Pick the locations</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-2">
                    <div className="relative border rounded-md z-20">
                      <div className="absolute top-2.5 left-2 z-[1]">
                        <SourceIconSvg />
                      </div>
                      {isMapLoaded && (
                        <GooglePlacesAutocomplete
                          apiKey={API_KEY}
                          selectProps={{
                            value: sourceAutocompleteValue,
                            onChange: (event) => getLatAndLnt(event, "source"),
                            placeholder: "Enter pickup location",
                            isClearable: true,
                            isDisabled: isMutatingRideOrder,
                            components: {
                              DropdownIndicator: null,
                            },
                            styles: {
                              control: () => ({
                                display: "flex",
                                border: "none",
                                background: "#f4f4f4",
                                paddingLeft: "24px",
                                borderRadius: "4px",
                              }),
                            },
                          }}
                        />
                      )}
                    </div>
                    <div className="relative border rounded-md z-10">
                      {/* <DotSquareIcon className="absolute top-3 left-3 w-4 h-4" /> */}
                      <div className="absolute top-2.5 left-2 z-[1]">
                        <DestinationIconSvg />
                      </div>
                      {isMapLoaded && (
                        <GooglePlacesAutocomplete
                          apiKey={API_KEY}
                          selectProps={{
                            value: destinationAutocompleteValue,
                            onChange: (event) =>
                              getLatAndLnt(event, "destination"),
                            placeholder: "Where to?",
                            isClearable: true,
                            isDisabled: isMutatingRideOrder,
                            components: {
                              DropdownIndicator: null,
                            },
                            styles: {
                              control: () => ({
                                display: "flex",
                                border: "none",
                                background: "#f4f4f4",
                                paddingLeft: "24px",
                                borderRadius: "4px",
                              }),
                            },
                          }}
                        />
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {directionRoutePoints && (
              <>
                {isSettingDirectionRoutePoints ? (
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
                            {/* eslint-disable-next-line */}
                            <img
                              src="https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png"
                              alt="carImg"
                              width={80}
                              height={80}
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">
                                  GooberX
                                </span>
                                <div className="flex items-center text-xs">
                                  <User2Icon className="w-3 h-3" /> 4
                                </div>
                              </div>
                              <span className="text-sm">
                                {
                                  // @ts-ignore
                                  directionRoutePoints.routes[0].legs[0]
                                    .duration.text
                                }{" "}
                                distance
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-2xl font-bold">
                          {getRidePrice({
                            distance:
                              /* @ts-ignore */
                              directionRoutePoints.routes[0].legs[0].distance
                                .value,
                            minimumPrice: minimumPrice,
                            pricePerMeters: pricePerMeters,
                          })}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full flex items-center gap-2"
                        onClick={handleSubmitRideOrder}
                        disabled={isMutatingRideOrder}
                      >
                        {isMutatingRideOrder ? (
                          <LoaderIcon className="animate-spin" />
                        ) : (
                          <>
                            Search a driver{" "}
                            <ArrowRightIcon className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </>
            )}
          </>
        )}

        {currentRideOrderFlowStep === RideOrderFlowSteps.SEARCHING_DRIVER && (
          <Card className="min-w-[400px] max-w-[400px]">
            <CardHeader>
              <CardTitle>Searching for driver...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative flex items-center justify-center ">
                <div className="absolute bg-blue-400 animate-ping w-[80px] h-[80px] z-0 rounded-full"></div>
                {/* eslint-disable-next-line */}
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
                onClick={handleCancelRideOrder}
                disabled={isMutatingRideOrder}
              >
                {isMutatingRideOrder ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <>Cancel</>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentRideOrderFlowStep === RideOrderFlowSteps.ACCEPTED && (
          <Card className="min-w-[400px] max-w-[400px]">
            <CardHeader>
              <CardTitle>Ride accepted</CardTitle>
              <CardDescription>Meet driver at the pickup point</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center">
                <div className="relative">
                  {/* <img
                      src="https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png"
                      alt="carImg"
                      className="w-40"
                    /> */}
                  <img
                    className="rounded-full border-4 border-white w-[120px]"
                    src={currentRideDriver?.avatarUrl}
                    alt={currentRideDriver?.name}
                  />
                </div>

                <div className="flex flex-col w-full gap-4">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-center">
                      {currentRideDriver?.name}
                    </h3>
                    <p className="text-xs text-gray-400  flex items-center justify-center gap-1">
                      Top rated driver <StarIcon className="h-3 w-3" />
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center border px-4 gap-2 rounded-md bg-zinc-100">
                      <img
                        src="https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png"
                        alt="carImg"
                        className="w-[45px]"
                      />

                      <div className="flex items-center text-sm font-medium">
                        <p>{currentRideDriver?.driver?.carName}</p>
                        <DotIcon />
                        <p>{currentRideDriver?.driver?.carColor}</p>
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
                            {currentRideOrder?.source?.label}
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
                            {currentRideOrder?.destination?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 rounded-md bg-black text-white text-xs">
                      <p>Driver will arrive in:</p>
                      <span className="px-2 py-1 bg-zinc-800 rounded-md font-medium">
                        05:30Mins
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full flex items-center gap-2 font-bold"
                    onClick={handleCancelRideOrder}
                    disabled={isMutatingRideOrder}
                  >
                    {isMutatingRideOrder ? (
                      <LoaderIcon className="animate-spin" />
                    ) : (
                      <>Cancel</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* map */}
      <section className="flex-1 h-full bg-zinc-200 rounded-md">
        {isMapLoaded && (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            center={center}
            zoom={16}
            onLoad={onLoadMap}
            onUnmount={onUnmountMap}
            options={{ mapId: "9433ee85b1f142eb" }}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {locationSource && (
              <MarkerF
                position={{
                  lat: locationSource?.lat!,
                  lng: locationSource?.lng!,
                }}
              >
                <OverlayViewF
                  position={{
                    lat: locationSource?.lat!,
                    lng: locationSource?.lng!,
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div>
                    <p>{locationSource.label}</p>
                  </div>
                </OverlayViewF>
              </MarkerF>
            )}
            {locationDestination && (
              <MarkerF
                position={{
                  lat: locationDestination?.lat!,
                  lng: locationDestination?.lng!,
                }}
              >
                <OverlayViewF
                  position={{
                    lat: locationDestination?.lat!,
                    lng: locationDestination?.lng!,
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div>
                    <p>{locationDestination.label}</p>
                  </div>
                </OverlayViewF>
              </MarkerF>
            )}

            {directionRoutePoints && (
              <DirectionsRenderer
                options={{
                  polylineOptions: { strokeColor: "black", strokeWeight: 4 },
                  suppressMarkers: true,
                }}
                directions={directionRoutePoints}
              />
            )}
          </GoogleMap>
        )}
      </section>
    </div>
  );
}
