import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>
        Theme
      </DropdownMenuLabel>

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
    </DropdownMenuGroup>
  );
}