import { LoaderIcon } from "lucide-react";

export const FullScreenLoader = () => {
  return (
    <div className="flex items-center justify-center w-full px-6 h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-[1400px] gap-8">
        <h1 className="text-8xl font-bold">Goober</h1>
        <LoaderIcon className="animate-spin w-[40px] h-[40px]" />
      </div>
    </div>
  );
};
