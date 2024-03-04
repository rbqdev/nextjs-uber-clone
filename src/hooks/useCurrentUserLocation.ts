"use client";

import { googleApiKey } from "@/constants";
import { LocationEventDetailed } from "@/sharedTypes";
import { useEffect, useState } from "react";

export const useCurrentUserLocation = () => {
  const [watchId, setWatchId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserPosition, setCurrentUserPosition] =
    useState<LocationEventDetailed | null>({
      lat: 0,
      lng: 0,
      name: "",
      label: "",
    });

  useEffect(() => {
    setIsLoading(true);
    try {
      if (navigator.geolocation) {
        setWatchId(
          navigator.geolocation.watchPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`;
              const response = await fetch(geocodingApiUrl);
              const geoCoding = await response.json();
              const formatted_address =
                geoCoding?.results[0]?.formatted_address;

              setCurrentUserPosition({
                lat,
                lng,
                name: formatted_address,
                label: formatted_address,
              });
            },
            (error) => {
              console.error(`Error getting location: ${error.message}`);
            }
          )
        );
      } else {
        console.error("Geolocation is not supported by your browser");
      }
    } catch (error) {
      console.error("Something went wrong with geolocation");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    watchId,
    isLoading,
    currentUserPosition,
  };
};
