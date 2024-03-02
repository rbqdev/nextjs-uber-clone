"use client";

import { FullScreenLoader } from "@/components/FullScreenLoader/FullScreenLoader";
import { Header } from "@/components/Header/Header";
import { useDesktopNotification } from "@/hooks/useDesktopNotifications";
import { useGetUser } from "@/hooks/useGetUser";
import { User, UserType } from "@prisma/client";
import { usePathname } from "next/navigation";
import { createContext, useEffect } from "react";
import { UserResponse } from "../api/user/sharedTypes";

type PageContextProps = {
  user?: UserResponse;
};

export const PageContext = createContext({} as PageContextProps);

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { requestDesktopNotificationsPermission } = useDesktopNotification();
  const pathname = usePathname().replace("/", "");
  const userType = pathname === "driver" ? UserType.DRIVER : UserType.RIDER;
  const { isLoading: isUserLoading, user, getUserByType } = useGetUser();

  useEffect(() => {
    requestDesktopNotificationsPermission();
    getUserByType(userType);
  }, []);

  if (isUserLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <Header user={user} />
      <div className="w-full h-screen max-w-[1400px] py-6 px-6">
        <PageContext.Provider value={{ user }}>{children}</PageContext.Provider>
      </div>
    </div>
  );
}
