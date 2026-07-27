import { FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarFooter() {
  const location = useLocation();

  const items = [
    {
      name: "Documents",
      icon: FileText,
      href: "/documents",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <div className="border-t border-border/60 p-4">
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}