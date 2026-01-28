import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";


type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type DropdownSelectProps = {
  value?: string | number;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function DropdownSelect({
  value,
  options,
  onChange,
  placeholder = "Select option",
  className,
  disabled = false,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);
  const SelectedIcon = selectedOption?.icon;

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "h-9 flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm text-custom-header-text shadow-sm bg-background hover:bg-accent transition-colors",
            disabled && "opacity-50 cursor-not-allowed bg-muted",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {SelectedIcon && <SelectedIcon className="text-base leading-none" />}
            <span>{selectedOption?.label || placeholder}</span>
          </div>
          <ChevronDownIcon size={16} className="text-primary" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-48" align="end">
        <ul className="divide-y rounded-md border bg-background">
          {options.map((option) => {
            const OptionIcon = option.icon;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 transition-colors",
                    value === option.value && "bg-accent/50 font-medium"
                  )}
                >
                  {OptionIcon && <OptionIcon className="text-base leading-none" />}
                  <span>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}