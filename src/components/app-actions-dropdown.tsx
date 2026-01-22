
import type { ComponentType, SVGProps } from "react";
import { Button } from "./ui/button";
import type { TFormType } from "../types/form";



type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type TProps = {
  actions: {
    type: TFormType;
    name: string;
    icon: IconType;
    props: React.ComponentProps<typeof Button>;
  }[];
};

export default function AppActionsDropdown({ actions }: TProps) {
  return (
    <div className="flex gap-1">
      {actions.map(({ name, icon: Icon, props }) => (
        <Button key={name} variant="ghost" size="icon" {...props}>
          <Icon />
        </Button>
      ))}
    </div>
  );
}

