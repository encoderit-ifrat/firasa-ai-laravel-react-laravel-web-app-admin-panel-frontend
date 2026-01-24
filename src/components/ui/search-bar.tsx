import { useId } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "./input";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
  variant?: "default" | "bordered"; 
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
          "peer min-h-14 w-full ps-9 pe-3 rounded-xl text-base",
          variant === "default" && "bg-white  border-1 border-[#E2E0DF] ",
          variant === "bordered" && "bg-[#F4F2F3] border-gray-200 min-h-11"
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