import { googleApiKey } from "@/constants";
import {
  GoogleMapsDirectionsRoute,
  LocationEvent,
  LocationEventDetailed,
} from "@/sharedTypes";
import { useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";

export const useMap = () => {
  const { isLoaded: isGoogleMapsLoaded } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    libraries: ["places"],
  });
  const [sourceAutocompleteValue, setSourceAutocompleteValue] =
    useState<LocationEvent>(null);
  const [destinationAutocompleteValue, setDestinationAutocompletevalueValue] =
    useState<LocationEvent>(null);
  const [locationSource, setLocationSource] =
    useState<LocationEventDetailed>(null);
  const [locationDestination, setLocationDestination] =
    useState<LocationEventDetailed>(null);
  const [directionRoutePoints, setDirectionRoutePoints] =
    useState<GoogleMapsDirectionsRoute>(null);
  const [isUpdatingDirectionRoutePoints, setIsUpdatingDirectionRoutePoints] =
    useState(false);

  const handleChangeLocationCords = useCallback(
    (event: LocationEvent, type: string) => {
      const placeId = event?.value.place_id;

      if (!placeId) {
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
    },
    []
  );

  const handleSetDirectionRoute = useCallback(() => {
    try {
      setIsUpdatingDirectionRoutePoints(true);
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
        setIsUpdatingDirectionRoutePoints(false);
      }, 1000);
    }
  }, [
    locationDestination?.lat,
    locationDestination?.lng,
    locationSource?.lat,
    locationSource?.lng,
  ]);

  return {
    isGoogleMapsLoaded,
    sourceAutocompleteValue,
    destinationAutocompleteValue,
    locationSource,
    locationDestination,
    directionRoutePoints,
    isUpdatingDirectionRoutePoints,
    setLocationSource,
    setLocationDestination,
    setDirectionRoutePoints,
    handleChangeLocationCords,
    handleSetDirectionRoute,
  };
};
