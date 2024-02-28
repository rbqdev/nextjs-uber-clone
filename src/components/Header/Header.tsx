"use client";

import { getUserByEmail } from "@/app/api/user/controller";
import { mockUsersMap } from "@/app/api/user/mocks";
import { useEffect, useState } from "react";

export const Header = () => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const getUser = async () => {
    const isRiderUser = window.location.pathname === "/rider";
    const user = await getUserByEmail(
      mockUsersMap[isRiderUser ? "rider" : "driver"].email
    );
    setUser(user);
    setIsLoadingUser(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <header className="flex items-center justify-center min-h-[65px] border-b">
      <div className="flex items-center justify-between w-full max-w-[1400px] px-6">
        <h1 className="text-4xl font-bold">Goober</h1>

        <div className="flex items-center gap-2">
          <div>Toggle Theme</div>
          {/* @ts-ignore */}
          {!isLoadingUser ? <div>{user?.name}</div> : "Loading user..."}
        </div>
      </div>
    </header>
  );
};
