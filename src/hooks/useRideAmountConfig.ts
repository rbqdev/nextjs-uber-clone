"use client";

import { getRideAmountConfig } from "@/app/api/ride/amountConfig/queries";
import { RideAmountConfig } from "@prisma/client";
import { useEffect, useState } from "react";

export const useRideAmountConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rideAmountConfig, setRideAmountConfig] =
    useState<RideAmountConfig | null>(null);

  const getConfig = async () => {
    setIsLoading(true);
    const rideAmountConfig = await getRideAmountConfig();
    setRideAmountConfig(rideAmountConfig);
    setIsLoading(false);
    return rideAmountConfig;
  };

  useEffect(() => {
    getConfig();
  }, []);

  return {
    isLoading,
    rideAmountConfig,
  };
};
