import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goober App Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="w-full max-w-[1400px] px-6">{children}</section>;
}
