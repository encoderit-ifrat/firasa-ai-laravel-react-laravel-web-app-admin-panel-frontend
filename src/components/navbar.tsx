import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { DropdownOption } from "./dropdown";
import { useIsMobile } from "../hooks/use-mobile";
import { SidebarMenuButton, SidebarTrigger } from "./ui/sidebar";
import i18n from "../i18n";
import { DropdownSelect } from "./DropdownSelect";
import { NewNavUser, NewNavUserAvatar } from "./new-nav-user";
import { ChevronDown } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";

// Custom flag components
const USFlag = ({ className }: { className?: string }) => (
  <span className={className || "text-base leading-none"}>🇺🇸</span>
);
const BDFlag = ({ className }: { className?: string }) => (
  <span className={className || "text-base leading-none"}>🇧🇩</span>
);
const SAFlag = ({ className }: { className?: string }) => (
  <span className={className || "text-base leading-none"}>🇸🇦</span>
);

const LANGUAGES: DropdownOption<string>[] = [
  { value: "en", label: "English", icon: USFlag },
  { value: "bn", label: "Bangla", icon: BDFlag },
  { value: "ar", label: "Arabic", icon: SAFlag },
];

export default function Navbar() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();


  // Load saved language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (value: string) => {
    const option = LANGUAGES.find((lang) => lang.value === value);
    if (option) {
      i18n.changeLanguage(option.value);
      document.documentElement.dir = option.value === "ar" ? "rtl" : "ltr";
      localStorage.setItem("language", option.value);
    }
  };

  const userStr = localStorage.getItem("user");
  const userData = userStr ? JSON.parse(userStr) : null;

  const user = {
    name: userData?.name || "Guest",
    email: userData?.email || "encoderit@gmail.com",
    avatar: userData?.avatar_url || "/image/profilePhoto.png",
  };



  // Get current language value
  const currentLanguage = i18n.language || "en";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 justify-between m-6">
      {isMobile && <SidebarTrigger className="-ml-1" />}

      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex-1 max-w-md">
          {/* <SearchBar
            searchPlaceholder="Search..."
            variant="default"
          /> */}
        </div>

        <div className="flex items-center gap-3">
          <DropdownSelect
            className="min-h-14 bg-[#F4F2F3] rounded-full text-primary"
            options={LANGUAGES.map((lang) => ({
              label: lang.label,
              value: lang.value,
              icon: lang.icon,
            }))}
            value={currentLanguage}
            onChange={handleLanguageChange}
          />

          <div className="relative">
            <NotificationDropdown />
          </div>

          {/* <NavUser /> */}
          <NewNavUser user={user}>
            <SidebarMenuButton
              size="lg"
              className="min-h-14 flex items-center justify-between gap-2 rounded-full border  py-2 text-sm text-custom-header-text shadow-sm bg-[#F4F2F3] hover:bg-accent transition-colors"
            >
              <NewNavUserAvatar className="h-12 w-12" />

              <ChevronDown className="ml-auto size-4 text-primary" />
            </SidebarMenuButton>
          </NewNavUser>
        </div>
      </div>
    </header>
  );
}
