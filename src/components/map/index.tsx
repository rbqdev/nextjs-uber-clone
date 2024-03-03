"use client";

import {
  GoogleMap,
  MarkerF,
  OverlayView,
  OverlayViewF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

type MapProps = {
  isMapLoaded: boolean;
  locationSource: any;
  locationDestination: any;
  directionRoutePoints: any;
  onSetDirectionRoute: () => void;
};

export const Map = ({
  isMapLoaded,
  locationSource,
  locationDestination,
  directionRoutePoints,
  onSetDirectionRoute,
}: MapProps) => {
  // TODO: ask/set current user location
  const [center, setCenter] = useState({
    lat: -15.793889,
    lng: -47.882778,
  });
  const [map, setMap] = useState(null);

  const onLoadMap = (map: any) => {
    setMap(map);
  };
  const onUnmountMap = () => {
    setMap(null);
  };

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
      onSetDirectionRoute();
    }
  }, [locationDestination, map, onSetDirectionRoute, locationSource]);

  useEffect(() => {
    // Initial map load
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
  );
};
