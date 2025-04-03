"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { LoginDialog } from "./login-dialog";

export function UserNav() {
  // Update the isLoggedIn state to include user information
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const isLoggedIn = !!user;
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Update the login function
  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    setShowLoginDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            {/* Update the avatar display */}
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt={user?.name || "@user"} />
              <AvatarFallback>
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "JD"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {/* Update the dropdown menu content */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name || "John Doe"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "john.doe@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Bookings</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Update the logout function */}
          <DropdownMenuItem onClick={() => setUser(null)}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update the LoginDialog props */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />
    </>
  );
}
