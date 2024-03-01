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
import { ArrowRightIcon, ArrowRightToLineIcon, User2Icon } from "lucide-react";
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
import { createRideOrderMutation } from "./queries/mutations";
import { RideOrderStatus, RideOrder } from "@prisma/client";

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

export default function Rider() {
  const mapRef = useRef(null);
  const { user } = useContext(PageContext);
  const [pickupValue, setPickupValue] = useState<LocationEvent>(null);
  const [destinationValue, setDestinationValue] = useState<LocationEvent>(null);
  const [source, setSource] = useState<LocationSource>(null);
  const [destination, setDestination] = useState<LocationSource>(null);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [currentRideOrder, setCurrentRideOrder] = useState<RideOrder | null>(
    null
  );
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });
  const [center, setCenter] = useState({
    lat: -15.793889,
    lng: -47.882778,
  });
  const [map, setMap] = useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = useState(null);

  const onLoad = useCallback((map: any) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: any) => {
    setMap(null);
  }, []);

  const getLatAndLnt = (event: LocationEvent, type: string) => {
    console.log({ event });
    const placeId = event?.value.place_id;

    if (!placeId) {
      return;
    }
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (place, status) => {
      if (status === "OK") {
        if (type === "source") {
          setPickupValue(event);
          setSource({
            lat: place?.geometry?.location?.lat()!,
            lng: place?.geometry?.location?.lng()!,
            name: place?.formatted_address!,
            label: place?.name!,
          });
        } else if (type === "destination") {
          setDestinationValue(event);
          setDestination({
            lat: place?.geometry?.location?.lat()!,
            lng: place?.geometry?.location?.lng()!,
            name: place?.formatted_address!,
            label: place?.name!,
          });
        }
      }
    });
  };

  useEffect(() => {
    if (source) {
      // @ts-ignore
      map?.panTo({
        lat: source.lat,
        lng: source.lng,
      });
      setCenter({
        lat: source.lat,
        lng: source.lng,
      });
    }

    const directionRoute = () => {
      const directionService = new google.maps.DirectionsService();

      directionService.route(
        {
          origin: { lat: source?.lat!, lng: source?.lng! },
          destination: { lat: destination?.lat!, lng: destination?.lng! },
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
    };

    if (source && destination) {
      directionRoute();
    }
  }, [destination, map, source]);

  useEffect(() => {
    if (destination) {
      setCenter({
        lat: destination.lat,
        lng: destination.lng,
      });
    }

    const directionRoute = () => {
      const directionService = new google.maps.DirectionsService();

      directionService.route(
        {
          origin: { lat: source?.lat!, lng: source?.lng! },
          destination: { lat: destination?.lat!, lng: destination?.lng! },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            console.log({ result });
            // @ts-ignore
            setDirectionRoutePoints(result);
          } else {
            console.error("Error to set routes");
          }
        }
      );
    };

    if (source && destination) {
      directionRoute();
    }
  }, [destination, source]);

  const submitRideOrder = async () => {
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
      source,
      destination,
    };

    const orderResponse = await createRideOrderMutation(body);

    if (orderResponse && orderResponse.status === RideOrderStatus.SEARCHING) {
      setIsSearchingDriver(true);
    }
  };

  const shouldShowLocationsStep = !isSearchingDriver && !currentRideOrder;
  const shouldShowSearchingDriveStep = isSearchingDriver;
  const shouldShowRideAcceptedStep = !isSearchingDriver && currentRideOrder;

  return (
    <div className="h-full flex gap-4">
      {/* get ride card */}
      <section className="flex flex-col gap-4">
        {/* First Card Steps */}
        {shouldShowLocationsStep && (
          <>
            <Card className="min-w-[400px]">
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
                      <GooglePlacesAutocomplete
                        apiKey={API_KEY}
                        selectProps={{
                          value: pickupValue,
                          onChange: (event) => getLatAndLnt(event, "source"),
                          placeholder: "Enter pickup location",
                          isClearable: true,
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
                    </div>
                    <div className="relative border rounded-md z-10">
                      {/* <DotSquareIcon className="absolute top-3 left-3 w-4 h-4" /> */}
                      <div className="absolute top-2.5 left-2 z-[1]">
                        <DestinationIconSvg />
                      </div>
                      <GooglePlacesAutocomplete
                        apiKey={API_KEY}
                        selectProps={{
                          value: destinationValue,
                          onChange: (event) =>
                            getLatAndLnt(event, "destination"),
                          placeholder: "Where to?",
                          isClearable: true,
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
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {directionRoutePoints && (
              <Card className="min-w-[400px]">
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
                            <span className="text-2xl font-bold">GooberX</span>
                            <div className="flex items-center text-xs">
                              <User2Icon className="w-3 h-3" /> 4
                            </div>
                          </div>
                          <span className="text-sm">
                            {
                              /* @ts-ignore */
                              directionRoutePoints.routes[0].legs[0].duration
                                .text
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
                          directionRoutePoints.routes[0].legs[0].distance.value,
                        minimumPrice: minimumPrice,
                        pricePerMeters: pricePerMeters,
                      })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full flex items-center gap-2"
                    onClick={submitRideOrder}
                  >
                    Search a driver <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        )}

        {shouldShowSearchingDriveStep && (
          <>
            <Card className="min-w-[400px]">
              <div>Searching for driver...</div>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full flex items-center gap-2 text-red-700 font-medium"
                  onClick={() => {}}
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </>
        )}

        {shouldShowRideAcceptedStep && (
          <>
            <Card className="min-w-[400px]">
              <div>Driver accepted!!!</div>
            </Card>
          </>
        )}
      </section>

      {/* map */}
      <section className="flex-1 h-full bg-gray-200 rounded-md" ref={mapRef}>
        {isMapLoaded && (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            center={center}
            zoom={16}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{ mapId: "9433ee85b1f142eb" }}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {source && (
              <MarkerF position={{ lat: source?.lat!, lng: source?.lng! }}>
                <OverlayViewF
                  position={{ lat: source?.lat!, lng: source?.lng! }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div>
                    <p>{source.label}</p>
                  </div>
                </OverlayViewF>
              </MarkerF>
            )}
            {destination && (
              <MarkerF
                position={{ lat: destination?.lat!, lng: destination?.lng! }}
              >
                <OverlayViewF
                  position={{
                    lat: destination?.lat!,
                    lng: destination?.lng!,
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div>
                    <p>{destination.label}</p>
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
