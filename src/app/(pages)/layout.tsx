"use client";

import { FullScreenLoader } from "@/components/fullScreenLoader";
import { Header } from "@/components/header";
import { useGetUser } from "@/hooks/useGetUser";
import { UserType } from "@prisma/client";
import { usePathname } from "next/navigation";
import { createContext, useEffect } from "react";
import { LocationEventDetailed, User } from "@/sharedTypes";
import { Toaster } from "@/lib/shadcn/components/ui/toaster";
import { useCurrentUserLocation } from "@/hooks/useCurrentUserLocation";

type PageContextProps = {
  user?: User;
  currentUserPosition?: LocationEventDetailed | null;
};

export const PageContext = createContext({} as PageContextProps);

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname().replace("/", "");
  const userType = pathname === "driver" ? UserType.DRIVER : UserType.RIDER;
  const { isLoading: isUserLoading, user, getUserByType } = useGetUser();
  const { currentUserPosition, isLoading: isCurrentLocationLoading } =
    useCurrentUserLocation();

  useEffect(() => {
    getUserByType(userType);
  }, []);

  if (isUserLoading || isCurrentLocationLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <Header user={user} />
      <div className="w-full h-screen max-w-[1400px] py-6 px-6">
        <PageContext.Provider value={{ user, currentUserPosition }}>
          {children}
        </PageContext.Provider>
      </div>
      <Toaster />
    </div>
  );
}
