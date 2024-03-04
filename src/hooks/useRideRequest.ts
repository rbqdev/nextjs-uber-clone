"use client";

import { updateRideRequestMutation } from "@/app/api/ride/request/mutations";
import { useState } from "react";
import { Optional } from "@prisma/client/runtime/library";
import { RideRequest } from "@/sharedTypes";

export const useRideRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateRideRequest = async ({
    id,
    body,
  }: {
    id: number;
    body: Record<string, Optional<RideRequest>>;
  }) => {
    setIsLoading(true);
    const orderResponse = await updateRideRequestMutation(id, body);
    setIsLoading(false);
    return orderResponse;
  };

  return {
    isLoading,
    updateRideRequest,
  };
};
