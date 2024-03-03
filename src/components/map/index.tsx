"use client";

import { LocationEventDetailed } from "@/app/(pages)/rider/sharedTypes";
import { GoogleMaps, GoogleMapsDirectionsRoute } from "@/sharedTypes";
import {
  GoogleMap,
  OverlayView,
  OverlayViewF,
  DirectionsRenderer,
  MarkerF,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

type MapProps = {
  isMapLoaded: boolean;
  locationSource: LocationEventDetailed;
  locationDestination: LocationEventDetailed;
  directionRoutePoints: GoogleMapsDirectionsRoute;
  shouldShowDriverPin?: boolean;
  onSetDirectionRoute: () => void;
};

export const Map = ({
  isMapLoaded,
  locationSource,
  locationDestination,
  directionRoutePoints,
  shouldShowDriverPin,
  onSetDirectionRoute,
}: MapProps) => {
  // TODO: ask/set current user location
  const [center, setCenter] = useState({
    lat: -15.793889,
    lng: -47.882778,
  });
  const [map, setMap] = useState<GoogleMaps>(null);

  const onLoadMap = (map: any) => {
    setMap(map);
  };
  const onUnmountMap = () => {
    setMap(null);
  };

  useEffect(() => {
    if (locationSource) {
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
      onSetDirectionRoute();
    }
  }, [locationDestination, map, onSetDirectionRoute, locationSource]);

  useEffect(() => {
    if (locationDestination) {
      setCenter({
        lat: locationDestination.lat,
        lng: locationDestination.lng,
      });
    }

    if (locationSource && locationDestination) {
      onSetDirectionRoute();
    }
  }, [locationDestination, locationSource, onSetDirectionRoute]);

  if (!isMapLoaded) {
    // TODO: empty state
    return null;
  }

  return (
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
      {locationSource && (
        <MarkerF
          icon={shouldShowDriverPin ? "/assets/location-pin.png" : undefined}
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
            <div className="px-2 py-2 bg-white text-black font-bold">
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
            <div className="px-2 py-2 bg-white text-black font-bold">
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
  );
};
