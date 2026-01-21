import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { NavMain } from "./nav-main";
import IconDashboard from "./svg-icon/icon-dashboard";
import IconUserResult from "./svg-icon/icon-user-result";
import { useRouterState } from "@tanstack/react-router";
import type { TRoute } from "../types";
import IconSetting from "./svg-icon/icon-setting";
import IconContent from "./svg-icon/icon-content";
import IconPublicApi from "./svg-icon/icon-public-api";
import IconHead from "./svg-icon/icon-head";
import IconHeaderName from "./svg-icon/icon-header-name";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t, i18n } = useTranslation();
  const {
    location: { pathname },
  } = useRouterState();
  const { open } = useSidebar();
  const [isHovered, setIsHovered] = React.useState(false);

  const user = {
    name: "Guest",
    email: "encoderit@gmail.com",
    avatar: "/image/profilePhoto.png",
  };

  // Determine active link
  function isActiveLink(items: string[]): boolean {
    return items.includes(pathname);
  }

  const routes: TRoute[] = [
    {
      name: t("sidebar.dashboard", "Dashboard"),
      url: "/",
      icon: IconDashboard,
      isActive: isActiveLink(["/"]),
      isVisible: true,
    },
    {
      name: t("sidebar.usersResults", "Users & Results"),
      url: "/users-results",
      icon: IconUserResult,
      isActive: isActiveLink(["/users-results"]),
      isVisible: true,
    },
    {
      name: t("sidebar.settings", "Settings"),
      url: "/settings",
      icon: IconSetting,
      isActive: isActiveLink(["/settings"]),
      isVisible: true,
    },
    {
      name: t("sidebar.contentManagement", "Content Management"),
      url: "/content-management",
      icon: IconContent,
      isActive: isActiveLink(["/content-management"]),
      isVisible: true,
    },
    {
      name: t("sidebar.publicApiManagement", "Public API Management"),
      url: "/public-api-management",
      icon: IconPublicApi,
      isActive: isActiveLink(["/public-api-management"]),
      isVisible: true,
    },
  ];

  // RTL support: open sidebar from right for Arabic
  const sidebarSide = i18n.language === "ar" ? "right" : "left";

  return (
    <Sidebar collapsible="icon" side={sidebarSide} {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          {!open ? (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative"
            >
              {!isHovered ? (
                <IconHead className="size-8 cursor-pointer" />
              ) : (
                <SidebarTrigger className="rounded-md p-1" />
              )}
            </div>
          ) : (
            <>
              <IconHead className="size-8 cursor-pointer" />
              <IconHeaderName />
              <SidebarTrigger className="rounded-md p-1" />
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain routes={routes} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
