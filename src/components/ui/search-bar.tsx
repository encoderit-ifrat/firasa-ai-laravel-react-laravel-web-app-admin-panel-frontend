import { useId } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "./input";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
  variant?: "default" | "bordered"; // Add variant prop
}

export default function SearchBar({
  searchValue = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  className,
  variant = "default",
}: SearchBarProps) {
  const id = useId();

  return (
    <div className={cn("relative w-full max-w-xs", className)}>
      <Input
        id={`search-${id}`}
        className={cn(
          "peer h-10 w-full ps-9 pe-3",
          variant === "default" && "bg-[#F4F2F3]  border-1 border-[#E2E0DF] ",
          variant === "bordered" && "bg-white border border-gray-200"
        )}
        type="search"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  );
}