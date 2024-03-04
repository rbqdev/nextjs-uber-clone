import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/lib/shadcn/components/ui/avatar";
import { Button } from "@/lib/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/shadcn/components/ui/dropdown-menu";
import { User } from "@/sharedTypes";
import { LogOutIcon, SettingsIcon } from "lucide-react";

type UserNavProps = {
  user: User;
};

export const UserNav = ({ user }: UserNavProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar className="border cursor-pointer">
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="flex flex-col space-y-1 font-normal">
        <p className="text-sm font-medium leading-none">{user?.name}</p>
        <p className="text-xs leading-none text-muted-foreground">
          {user?.email}
        </p>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="flex gap-2 cursor-pointer">
          <SettingsIcon className="w-4 h-4" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="flex gap-2 cursor-pointer text-red-600">
        <LogOutIcon className="w-4 h-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
