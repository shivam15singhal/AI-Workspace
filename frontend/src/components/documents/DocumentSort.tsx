import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function DocumentSort({
  value,
  onChange,
}: Props) {
  return (
    <Select
  value={value}
  onValueChange={(value) => {
    if (value) {
      onChange(value);
    }
  }}
>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="newest">
          Newest
        </SelectItem>

        <SelectItem value="oldest">
          Oldest
        </SelectItem>

        <SelectItem value="az">
          A-Z
        </SelectItem>

        <SelectItem value="za">
          Z-A
        </SelectItem>
      </SelectContent>
    </Select>
  );
}