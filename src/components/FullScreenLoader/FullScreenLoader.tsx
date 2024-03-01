"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/lib/shadcn/components/ui/progress";

export const FullScreenLoader = ({ isCompleted }: { isCompleted: boolean }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(isCompleted ? 66 : 100), 500);
    return () => clearTimeout(timer);
  }, [isCompleted]);

  return (
    <div className="flex items-center justify-center w-full px-6 h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-[1400px] gap-28">
        <h1 className="text-8xl font-bold">Goober</h1>
        <Progress value={progress} className="w-[50%]" />
      </div>
    </div>
  );
};
