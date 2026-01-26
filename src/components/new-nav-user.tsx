import {
    BadgeCheck,
    Bell,
    ChevronDown,
    // ChevronsDown,
    // ChevronsUpDown,
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
import { createContext, useContext, type PropsWithChildren } from "react";
import { t } from "i18next";
import { cn } from "../lib/utils";

type UserType = {
    name: string,
    email: string,
    avatar: string,

}


const NavUserContext = createContext<UserType | null>(null);


const useNavUser = () => {
    const context = useContext(NavUserContext)
    if (!context) {
        throw new Error("useNavUser inside the NavUser Component")
    }

    return context;
}
type NavUserType = {
    user: UserType
}
// export function NewNavUserAvatar() {
//     const user = useNavUser()
//     return (
//         <Avatar className="h-12 w-12 rounded-lg">
//             <AvatarImage src={user.avatar} alt={user.name} />
//             <AvatarFallback className="rounded-full">
//                 {user.name[0]}
//             </AvatarFallback>
//         </Avatar>
//     )
// }

interface NewNavUserAvatarProps {
    className?: string
}

export function NewNavUserAvatar({ className }: NewNavUserAvatarProps) {
    const user = useNavUser()
    return (
        <Avatar className={cn("h-8 w-8 rounded-lg", className)}>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-full">
                {user.name[0]}
            </AvatarFallback>
        </Avatar>
    )
}

export function NewNavUserInfo() {
    const user = useNavUser()
    return (
        <div className="flex flex-col gap-2">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
        </div>
    )
}


export function NewNavUser({ user, children }: NavUserType & PropsWithChildren) {
    const { isMobile } = useSidebar();

    return <NavUserContext.Provider value={user}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>

                {children}
                {/* <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-2 rounded-full min-h-14 bg-[#F4F2F3]"
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
                    <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton> */}
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

    </NavUserContext.Provider>
}


// export function NavUser({
//   user = {
//     name: "Guest",
//     email: "encoderit@gmail.com",
//     avatar: "/image/profilePhoto.png",
//   },
// }: {
//   user?: {
//     name: string;
//     email: string;
//     avatar: string;
//   };
// }) {
//   const { isMobile } = useSidebar();
//   const { t } = useTranslation();

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-2 rounded-full min-h-14 bg-[#F4F2F3]"
//             >
//               <Avatar className="h-8 w-8 rounded-lg">
//                 <AvatarImage src={user.avatar} alt={user.name} />
//                 <AvatarFallback className="rounded-full">
//                   {user.name[0]}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left">
//                 {/* <span className="truncate font-medium">{user.name}</span>
//                 <span className="truncate text-xs">{user.email}</span> */}
//               </div>
//               <ChevronDown className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage src={user.avatar} alt={user.name} />
//                   <AvatarFallback className="rounded-lg">
//                     {user.name[0]}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-medium">{user.name}</span>
//                   <span className="truncate text-xs">{user.email}</span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <Sparkles />
//                 {t("profile.upgradeToPro", "Upgrade to Pro")}
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <BadgeCheck />
//                 {t("profile.account", "Account")}
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <CreditCard />
//                 {t("profile.billing", "Billing")}
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Bell />
//                 {t("navbar.notifications", "Notifications")}
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem>
//               <LogOut />
//               {t("navbar.logout", "Log out")}
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }

