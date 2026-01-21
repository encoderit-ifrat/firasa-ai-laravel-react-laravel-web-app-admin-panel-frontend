import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DropdownSelector, type DropdownOption } from "./dropdown";
import { useIsMobile } from "../hooks/use-mobile";
import SearchBar from "./ui/search-bar";
import { SidebarTrigger } from "./ui/sidebar";
import { NavUser } from "./nav-user";
import IconNotification from "./svg-icon/icon-notification";
import i18n from "../i18n";
import { DropdownSelect } from "./DropdownSelect";

// Custom flag components
const USFlag = () => <span className="text-xl">🇺🇸</span>;
const BDFlag = () => <span className="text-xl">🇧🇩</span>;
const SAFlag = () => <span className="text-xl">🇸🇦</span>;

const LANGUAGES: DropdownOption<string>[] = [
  { value: "en", label: "English", icon: USFlag },
  { value: "bn", label: "Bangla", icon: BDFlag },
  { value: "ar", label: "Arabic", icon: SAFlag },
];

export default function Navbar() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  console.log(t("common.search"));

  // Load saved language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (option: any) => {
    console.log("aa", option);
    i18n.changeLanguage(option.value);
    document.documentElement.dir = option.value === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", option.value);
  };

  // **Define currentLanguage here inside the component**
  const currentLanguage =
    LANGUAGES.find((lang) => lang.value === i18n.language) || LANGUAGES[0];

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 justify-between px-2 md:px-4">
      {isMobile && <SidebarTrigger className="-ml-1" />}

      <div className="flex items-center justify-between w-full px-4 py-2">
        <div className="w-1/3">
          <SearchBar
            searchPlaceholder="Search..."
            variant="bordered"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* <DropdownSelector
            options={LANGUAGES}
            onChange={handleLanguageChange}
            defaultValue={currentLanguage}
          /> */}

          <DropdownSelect
            className="rounded-full"
            options={LANGUAGES}
            onChange={handleLanguageChange}
          />

          <div title={t("notifications")}>
            <IconNotification className="size-12 cursor-pointer hover:opacity-70" />
          </div>

          <NavUser />
        </div>
      </div>
    </header>
  );
}
