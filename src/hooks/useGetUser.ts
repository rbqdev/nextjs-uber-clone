"use client";

import { getUser } from "@/app/api/user/queries";
import { User } from "@/app/api/user/sharedTypes";
import { baseUrl } from "@/constants";
import { UserType } from "@prisma/client";
import { useState } from "react";

export const useGetUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>(undefined);

  const _getUser = async (url: string) => {
    setIsLoading(true);
    const User = await getUser(url);
    setIsLoading(false);
    setUser(User);
    return User;
  };

  const getUserById = async (id: number) => {
    const user = await _getUser(`${baseUrl}/api/user/id/${id}`);
    return user;
  };

  const getUserByType = async (type: UserType) => {
    const user = await _getUser(`${baseUrl}/api/user/type/${type}`);
    return user;
  };

  return {
    isLoading,
    user,
    getUserById,
    getUserByType,
  };
};
