import { Button } from "@/lib/shadcn/components/ui/button";
import { CarTaxiFrontIcon, User2Icon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center flex-1 py-6 h-screen">
      <div className="flex w-full max-w-[1400px] px-6">
        <div className="flex flex-col items-center justify-center w-full max-w-[1400px] gap-32">
          <h1 className="text-8xl font-bold">Goober</h1>
          <div className="flex gap-8">
            <Link
              target="_blank"
              href="./rider"
              className="flex items-center justify-center min-w-[400px] min-h-[80px] text-xl bg-black text-white rounded-md"
            >
              <User2Icon className="mr-2" /> I&apos;m a Rider
            </Link>
            <Link
              target="_blank"
              href="./driver"
              className="flex items-center justify-center min-w-[400px] min-h-[80px] text-xl bg-black text-white rounded-md"
            >
              <CarTaxiFrontIcon className="mr-2" /> I&apos;m a Driver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
