import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (
    value: string,
  ) => void;
};

export default function SidebarSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="px-4 pb-3">
      <Input
        placeholder="Search chats..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}