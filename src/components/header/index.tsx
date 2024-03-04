import { Badge } from "@/lib/shadcn/components/ui/badge";
import { User } from "@/sharedTypes";
import { UserNav } from "./userNav";
import { UserType } from "@prisma/client";

type HeaderProps = {
  user: User;
};

export const Header = ({ user }: HeaderProps) => {
  const isDriver = user?.type === UserType.DRIVER;
  return (
    <header className="w-full flex items-center justify-center min-h-[65px] border-b">
      <div className="flex items-center justify-between w-full max-w-[1400px] px-6">
        <h1 className="text-4xl font-bold">Goober</h1>

        <Badge className={isDriver ? "bg-green-600" : ""}>
          {isDriver ? "Driver" : "Rider"}
        </Badge>

        <div className="flex items-center gap-2">
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
};
