import {
  LogOut,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";

function getInitials(username: string) {
  return username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

        <Button
          onClick={() => navigate("/register")}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="
          flex
          items-center
          gap-3
          rounded-xl
          px-2
          py-1.5
          transition-colors
          hover:bg-accent
          cursor-pointer
        "
      >
        <Avatar className="h-10 w-10 border border-primary/20">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {getInitials(user.username)}
          </AvatarFallback>
        </Avatar>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold leading-none">
            {user.username}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72"
      >
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold">
              {user.username}
            </p>

            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            Theme
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value)}
            >
              <DropdownMenuRadioItem value="light">
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="dark">
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="system">
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}