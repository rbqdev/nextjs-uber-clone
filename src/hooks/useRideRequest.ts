"use client";

import { baseUrl } from "@/constants";
import { updateRideRequestMutation } from "@/app/api/ride/order/mutations";
import { RideRequest, RideRequestStatus, User, UserType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Optional } from "@prisma/client/runtime/library";

export const useRideRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateRideRequest = async ({
    orderId,
    body,
  }: {
    orderId: number;
    body: Record<string, Optional<RideRequest>>;
  }) => {
    setIsLoading(true);
    const orderResponse = await updateRideRequestMutation(orderId, body);
    setIsLoading(false);

    return orderResponse;
  };

  return {
    isLoading,
    updateRideRequest,
  };
};
