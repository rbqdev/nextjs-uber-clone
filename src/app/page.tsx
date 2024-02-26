import { Button } from "@/lib/shadcn/components/ui/button";
import { CarTaxiFrontIcon, User2Icon } from "lucide-react";

export default function Home() {
  return (
    <section className="flex w-full max-w-[1200px] px-6">
      <div className="flex items-center justify-center w-full max-w-[1200px] gap-8">
        <Button size="lg" className="min-w-[400px] min-h-[80px] text-xl">
          <User2Icon className="mr-2" /> I&apos;m a Rider
        </Button>
        <Button size="lg" className="min-w-[400px] min-h-[80px] text-xl">
          <CarTaxiFrontIcon className="mr-2" /> I&apos;m a Driver
        </Button>
      </div>
    </section>
  );
}
