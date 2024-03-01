import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/shadcn/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Goober App",
  description: "By Trashlab",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable
        )}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
