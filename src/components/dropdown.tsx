import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type DropdownOption<T = string> = {
  value: T;
  label: string;
  icon?: React.ComponentType<any>;
};

type DropdownSelectorProps<T = string> = {
  options: DropdownOption<T>[];
  defaultValue?: DropdownOption<T>;
  onChange?: (option: DropdownOption<T>) => void;
  buttonClassName?: string;
};

export function DropdownSelector<T = string>({
  options,
  defaultValue,
  onChange,
  buttonClassName,
}: DropdownSelectorProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T>(
    (defaultValue || options[0]).value,
  );

  // Sync state if defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue.value);
    }
  }, [defaultValue?.value]);

  const currentOption =
    options.find((opt) => opt.value === selectedValue) || options[0];

  const handleSelect = (option: DropdownOption<T>) => {
    setSelectedValue(option.value);
    onChange?.(option);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={`flex items-center gap-2 bg-[#F4F2F3] ${buttonClassName || ""}`}
        >
          {currentOption.icon && <currentOption.icon className="w-4 h-4" />}
          {currentOption.label}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="m-2">
        {options.map((opt) => (
          <DropdownMenuItem
            key={String(opt.value)}
            onClick={() => handleSelect(opt)}
            className="flex items-center gap-2"
          >
            {opt.icon && <opt.icon className="w-4 h-4" />}
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
