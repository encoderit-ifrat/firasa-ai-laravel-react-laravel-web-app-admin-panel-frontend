// import {  Ellipsis, type LucideIcon } from "lucide-react";
// import { Button } from "./ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
// import type { TFormType } from "../types/form";
// type TProps = {
//   actions: {
//     type: TFormType;
//     name: string;
//     icon: LucideIcon;
//     props: React.ComponentProps<typeof DropdownMenuItem>;
//   }[];
// } & React.ComponentProps<typeof Button>;

// export default function AppActionsDropdown({ actions, ...props }: TProps) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size={"icon"} {...props}>
//           <Ellipsis/>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="m-2">
//         {actions.map(({ name, icon: Icon, props }) => (
//           <DropdownMenuItem key={name} {...props}>
//             <Icon />
//             {name}
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

import type { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { TFormType } from "../types/form";

type TProps = {
  actions: {
    type: TFormType;
    name: string;
    icon: LucideIcon;
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

