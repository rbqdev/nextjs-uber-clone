import {
  Driver,
  User as PrismaUser,
  RideRequest as PrismaRideRequest,
} from "@prisma/client";

export type User = (PrismaUser & { driver?: Driver }) | undefined;

export type LocationEvent = {
  label: string;
  value: Record<string, any>;
} | null;

export type LocationEventDetailed = {
  lat: number;
  lng: number;
  name: string;
  label: string;
} | null;

export type GoogleMaps = google.maps.Map | null;
export type GoogleMapsDirectionsRoute = google.maps.DirectionsResult | null;

type RideRequestJsonValuesParsed = {
  label: string;
  text: string;
};

export type RideRequest = PrismaRideRequest & {
  duration: RideRequestJsonValuesParsed;
  distance: RideRequestJsonValuesParsed;
  source: RideRequestJsonValuesParsed;
  destination: RideRequestJsonValuesParsed;
};
