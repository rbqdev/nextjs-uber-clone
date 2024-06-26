import { Card, CardContent } from "@/lib/shadcn/components/ui/card";

export const NoRequestsCard = () => (
  <Card className="min-w-[400px] max-w-[400px] min-h-[200px] ">
    <CardContent>
      <div className="flex flex-col items-center justify-center">
        <img src="/assets/car.png" alt="carImg" width={180} height={180} />
        <div className="flex flex-col gap-2 items-center">
          <p className="font-bold text-2xl">No ride requests!</p>
          <p className="text-xs text-zinc-400">
            New requests will appear here once a rider make a request.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
