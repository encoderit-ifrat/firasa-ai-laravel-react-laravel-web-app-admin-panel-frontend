import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { DropdownOption } from "./dropdown";
import { useIsMobile } from "../hooks/use-mobile";
import SearchBar from "./ui/search-bar";
import { SidebarTrigger } from "./ui/sidebar";
import { NavUser } from "./nav-user";
import IconNotification from "./svg-icon/icon-notification";
import i18n from "../i18n";
import { DropdownSelect } from "./DropdownSelect";

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

  // Get current language value
  const currentLanguage = i18n.language || "en";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 justify-between px-2 md:px-4 border-b">
      {isMobile && <SidebarTrigger className="-ml-1" />}

      <div className="flex items-center justify-between w-full px-4 py-2 gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            searchPlaceholder="Search..."
            variant="bordered"
          />
        </div>

        <div className="flex items-center gap-3">
          <DropdownSelect
            className="min-w-[120px]"
            options={LANGUAGES.map((lang) => ({
              label: lang.label,
              value: lang.value,
              icon: lang.icon,
            }))}
            value={currentLanguage}
            onChange={handleLanguageChange}
          />

          <div className="relative" title={t("notifications")}>
            <IconNotification className="size-6 cursor-pointer hover:opacity-70 transition-opacity" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </div>

          <NavUser />
        </div>
      </div>
    </header>
  );
}
