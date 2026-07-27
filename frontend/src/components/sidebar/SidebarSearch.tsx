import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SidebarSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="px-4 pb-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search conversations..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            h-10
            rounded-xl
            border-border/60
            bg-card
            pl-10
            transition-all
            duration-200
            focus-visible:ring-2
            focus-visible:ring-primary/30
          "
        />
      </div>
    </div>
  );
}