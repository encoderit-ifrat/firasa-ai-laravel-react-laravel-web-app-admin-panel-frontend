import { useState } from "react";
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
  const [selected, setSelected] = useState<DropdownOption<T>>(defaultValue || options[0]);

  const handleSelect = (option: DropdownOption<T>) => {
    console.log(option)
    setSelected(option);
    onChange?.(option);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className={`flex items-center gap-2 ${buttonClassName || ""}`}>
          {selected.icon && <selected.icon className="w-4 h-4" />}
          {selected.label}
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
