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

export enum RideRequestFlowSteps {
  INITIAL = "INITIAL",
  SEARCHING_DRIVER = "SEARCHING_DRIVER",
  ACCEPTED = "ACCEPTED",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
}
