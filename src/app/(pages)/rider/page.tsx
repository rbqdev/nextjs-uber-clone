"use client";

import Image from "next/image";
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
import { useCallback, useEffect, useRef, useState } from "react";
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
import SourceIconSvg from "@/assets/SourceIconSvg";
import DestinationIconSvg from "@/assets/DestinationIconSvg";
import { getPrice } from "./utils/getPrice";
import { minimumPrice, pricePerMeters } from "./mocks";

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
  const [pickupValue, setPickupValue] = useState<LocationEvent>(null);
  const [destinationValue, setDestinationValue] = useState<LocationEvent>(null);
  const [source, setSource] = useState<LocationSource>(null);
  const [destination, setDestination] = useState<LocationSource>(null);

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

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map) => {
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
      map.panTo({
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

  const submitRideOrder = () => {
    const route = directionRoutePoints?.routes[0].legs[0];
    const body = {
      userId: "userId",
      price: getPrice({
        distance: route.distance.value,
        minimumPrice: minimumPrice,
        pricePerMeters: pricePerMeters,
      }),
      distance: route.distance,
      duration: route.duration,
      source,
      destination,
    };
    console.log({ body });
    // mutation
  };

  /**
   * API function to get a ride
   * {
     userId: X,
     price: X.XX,
     distance: X, 
     duration: X, 
     
      };
   */

  return (
    <div className="h-full flex gap-4">
      {/* get ride card */}
      <section className="flex flex-col gap-4">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Get a ride</CardTitle>
            <CardDescription>Search where you want to go</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="relative border rounded-md">
                  {/* <Disc2Icon className="absolute z-10 top-3 left-3 w-4 h-4" /> */}
                  <SourceIconSvg />
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
                        }),
                      },
                    }}
                  />
                </div>
                <div className="relative">
                  {/* <DotSquareIcon className="absolute top-3 left-3 w-4 h-4" /> */}
                  <DestinationIconSvg />
                  <GooglePlacesAutocomplete
                    apiKey={API_KEY}
                    selectProps={{
                      value: destinationValue,
                      onChange: (event) => getLatAndLnt(event, "destination"),
                      placeholder: "Where to?",
                      isClearable: true,
                      components: {
                        DropdownIndicator: null,
                      },
                    }}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              className="w-full"
              disabled={!source || !destination}
              onClick={submitRideOrder}
            >
              Confirm locations
            </Button>
          </CardFooter>
        </Card>

        {directionRoutePoints && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      {/* eslint-disable-next-line */}
                      <img
                        src="https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Select_v1.png"
                        alt="carImg"
                        width={80}
                        height={80}
                      />
                      <span className="text-2xl font-bold">GooberX</span>
                      <div className="flex items-center text-xs">
                        <User2Icon className="w-3 h-3" /> 4
                      </div>
                    </div>
                    <span className="text-sm">
                      {directionRoutePoints.routes[0].legs[0].duration.text}{" "}
                      distance
                    </span>
                  </div>

                  <span className="text-2xl font-bold">
                    {getPrice({
                      distance:
                        directionRoutePoints.routes[0].legs[0].distance.value,
                      minimumPrice: minimumPrice,
                      pricePerMeters: pricePerMeters,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div>
              <Button onClick={submitRideOrder}>
                To Ride <ArrowRightIcon />
              </Button>
            </div>
          </>
        )}
      </section>

      {/* map */}
      <LoadScript googleMapsApiKey={API_KEY}>
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
      </LoadScript>
    </div>
  );
}
