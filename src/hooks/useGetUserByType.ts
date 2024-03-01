"use client";

import { baseUrl } from "@/constants";
import { User, UserType } from "@prisma/client";
import { useEffect, useState } from "react";

export const useGetUserByType = (type: UserType) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserByType = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user?type=${type}`);
        const { data: user } = await response.json();
        setUser(user);
      } catch (error) {
        console.error("Something went wrong with get user!");
      } finally {
        setIsLoading(false);
      }
    };
    getUserByType();
  }, [type]);

  return {
    isLoading,
    user,
  };
};
