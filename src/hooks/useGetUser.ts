"use client";

import { getUser } from "@/app/api/user/queries";
import { UserResponse } from "@/app/api/user/sharedTypes";
import { baseUrl } from "@/constants";
import { User, UserType } from "@prisma/client";
import { useEffect, useState } from "react";

export const useGetUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserResponse | undefined>(undefined);

  const getUserById = async (id: number) => {
    setIsLoading(true);
    const userResponse = await getUser(`${baseUrl}/api/user/id/${id}`);
    setIsLoading(false);
    setUser(userResponse);

    return userResponse;
  };

  const getUserByType = async (type: UserType) => {
    setIsLoading(true);
    const userResponse = await getUser(`${baseUrl}/api/user/type/${type}`);
    setIsLoading(false);
    setUser(userResponse);
    return userResponse;
  };

  return {
    isLoading,
    user,
    getUserById,
    getUserByType,
  };
};
