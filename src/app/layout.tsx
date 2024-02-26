import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/shadcn/utils";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Goober App",
  description: "By Trashlab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          fontSans.variable
        )}
      >
        <header className="flex items-center justify-center min-h-[65px] border-b">
          <div className="flex items-center justify-between w-full max-w-[1200px] px-6">
            <h1 className="text-4xl font-bold">Goober</h1>

            <div className="flex items-center gap-2">
              <div>Toggle Theme</div>
              <div>User Info Nav</div>
            </div>
          </div>
        </header>

        <main className="flex justify-center flex-1 py-6">{children}</main>
      </body>
    </html>
  );
}
