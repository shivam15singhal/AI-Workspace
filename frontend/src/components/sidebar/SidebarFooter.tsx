import { FileText, Settings } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function SidebarFooter() {
  return (
    <div className="border-t p-4">
      <Link to="/documents">
        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <FileText className="mr-2 h-4 w-4" />

          Documents
        </Button>
      </Link>

      <Button
        variant="ghost"
        className="mt-1 w-full justify-start"
      >
        <Settings className="mr-2 h-4 w-4" />

        Settings
      </Button>
    </div>
  );
}