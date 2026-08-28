"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@doresume/ui/components/avatar";
import { Button } from "@doresume/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@doresume/ui/components/dropdown-menu";
import { Skeleton } from "@doresume/ui/components/skeleton";
import { CreditCardIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const UserMenu = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (isPending) {
    return <Skeleton className="size-9 rounded-full" />;
  }

  if (!session?.user) {
    return (
      <Link href="/auth">
        <Button type="button" variant="outline">
          Sign In
        </Button>
      </Link>
    );
  }

  const { email, image, name } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
          />
        }
      >
        <Avatar size="sm">
          {image ? <AvatarImage alt={name} src={image} /> : null}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <span className="sr-only">User menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56 rounded-lg">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar>
                {image ? <AvatarImage alt={name} src={image} /> : null}
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/apply" />}>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
