import { UserResponse } from "@/app/api/user/sharedTypes";
import { User } from "@prisma/client";

type HeaderProps = {
  user?: UserResponse;
};

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="w-full flex items-center justify-center min-h-[65px] border-b">
      <div className="flex items-center justify-between w-full max-w-[1400px] px-6">
        <h1 className="text-4xl font-bold">Goober</h1>

        <div className="flex items-center gap-2">
          <div>Toggle Theme</div>
          <div>{user?.name}</div>
        </div>
      </div>
    </header>
  );
};
