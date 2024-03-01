"use client";

import { FullScreenLoader } from "@/components/FullScreenLoader/FullScreenLoader";
import { Header } from "@/components/Header/Header";
import { useGetUserByType } from "@/hooks/useGetUserByType";
import { User, UserType } from "@prisma/client";
import { usePathname } from "next/navigation";
import { createContext } from "react";

type PageContextProps = {
  user: User | null;
};

export const PageContext = createContext({} as PageContextProps);

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  Notification.requestPermission();
  const pathname = usePathname().replace("/", "");
  const userType = pathname === "driver" ? UserType.DRIVER : UserType.RIDER;
  const { isLoading: isUserLoading, user } = useGetUserByType(userType);

  if (isUserLoading) {
    return <FullScreenLoader isCompleted={!!user} />;
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
