import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import type { TRoute } from "../types";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

type TProps = { routes: TRoute[] };
export function NavMain({ routes }: TProps) {
  const { open, openMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes
          .filter((route) => route.isVisible)
          .map((route) =>
            !!route.children == false ? (
              <SidebarMenuItem key={route.name}>
                <Link to={route.url}>
                  {/* <SidebarMenuButton
                  variant={route.isActive ?"gradient":"default"}
                    tooltip={route.name}
                    isActive={route.isActive}
                    className="capitalize"
                  >
                    {route.icon && <route.icon />}
                    <span>{route.name}</span>
                  </SidebarMenuButton> */}
                  <SidebarMenuButton
                    variant={route.isActive ? "gradient" : "default"}
                    tooltip={route.name}
                    isActive={route.isActive}
                    className="capitalize group data-[active=true]:bg-gradient"
                    
                  >
                    {route.icon && (
                      <route.icon className="group-hover:text-primary group-data-[active=true]:text-black " />
                    )}

                    <span className="group-hover:text-primary ">
                      {route.name}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ) : open || openMobile ? (
              <Collapsible
                key={route.name}
                asChild
                defaultOpen={route.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem className="">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={route.name}
                      isActive={route.isActive}
                      className="capitalize"
                    >
                      {route.icon && <route.icon />}
                      <span>{route.name}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mr-0 pr-0">
                      {route.children
                        ?.filter((route) => route.isVisible)
                        .map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              asChild
                              className="py-1.5 capitalize"
                              isActive={subItem.isActive}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={route.name}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      tooltip={route.name}
                      isActive={route.isActive}
                    >
                      <Link to={route.url}>
                        {route.icon && <route.icon />}

                        <span>{route.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg ml-2"
                    side={"right"}
                    align={"start"}
                  >
                    {route.children?.map((subItem) => (
                      <DropdownMenuItem key={subItem.name}>
                        {subItem.icon && <subItem.icon />}
                        <span>{subItem.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )
          )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
