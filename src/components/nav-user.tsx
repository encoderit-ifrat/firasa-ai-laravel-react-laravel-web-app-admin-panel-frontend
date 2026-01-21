import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTranslation } from "react-i18next";

export function NavUser({
  user = {
    name: "Guest",
    email: "encoderit@gmail.com",
    avatar: "/image/profilePhoto.png",
  },
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                {t("profile.upgradeToPro", "Upgrade to Pro")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                {t("profile.account", "Account")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                {t("profile.billing", "Billing")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                {t("navbar.notifications", "Notifications")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <LogOut />
              {t("navbar.logout", "Log out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// import {
//   ChevronsUpDown,
//   LogOut,
//   Sparkles,
//   BadgeCheck,
//   CreditCard,
//   Bell,
// } from "lucide-react";

// import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";

// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuGroup,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
// } from "./ui/dropdown-menu";

// export function NavUser() {
//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//             >
//               <div className="flex flex-col text-left text-sm leading-tight">
//                 <span className="font-medium">Username</span>
//                 <span className="text-xs text-muted-foreground">
//                   email@example.com
//                 </span>
//               </div>

//               <ChevronsUpDown className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             className="min-w-56 rounded-lg"
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="font-normal">
//               <div className="flex flex-col text-sm">
//                 <span className="font-medium">Username</span>
//                 <span className="text-xs">email@example.com</span>
//               </div>
//             </DropdownMenuLabel>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <Sparkles />
//                 Upgrade to Pro
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <BadgeCheck />
//                 Account
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <CreditCard />
//                 Billing
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Bell />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem>
//               <LogOut />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
