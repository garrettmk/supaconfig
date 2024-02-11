"use client";

import { User } from "@supabase/supabase-js"
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { signOut } from "@/lib/actions";

export type UserMenuButtonProps = {
  user: User
}

export function UserMenuButton(props: UserMenuButtonProps) {
  const { user } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuLabel>
            Theme
          </DropdownMenuLabel>
          <DropdownMenuRadioItem value="light">
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={async () => signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}