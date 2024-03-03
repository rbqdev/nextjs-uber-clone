"use client";

import { getUser } from "@/app/api/user/queries";
import { User } from "@/sharedTypes";
import { UserType } from "@prisma/client";
import { baseUrl } from "@/constants";
import { useState } from "react";

export const useGetUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>(undefined);

  const _getUser = async (url: string) => {
    setIsLoading(true);
    const user = await getUser(url);
    setIsLoading(false);
    setUser(user);
    return user;
  };

  const getUserById = async (id: number) => {
    const user = await _getUser(`${baseUrl}/api/user/id/${id}`);
    return user as User;
  };

  const getUserByType = async (type: UserType) => {
    const user = await _getUser(`${baseUrl}/api/user/type/${type}`);
    return user as User;
  };

  return {
    isLoading,
    user,
    getUserById,
    getUserByType,
  };
};
