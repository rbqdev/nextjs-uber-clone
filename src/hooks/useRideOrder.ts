"use client";

import { baseUrl } from "@/constants";
import { updateRideOrderMutation } from "@/app/api/ride/order/mutations";
import { RideOrder, RideOrderStatus, User, UserType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Optional } from "@prisma/client/runtime/library";

export const useRideOrder = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateRideOrder = async ({
    orderId,
    body,
  }: {
    orderId: number;
    body: Record<string, Optional<RideOrder>>;
  }) => {
    setIsLoading(true);
    const orderResponse = await updateRideOrderMutation(orderId, body);
    setIsLoading(false);

    return orderResponse;
  };

  return {
    isLoading,
    updateRideOrder,
  };
};
