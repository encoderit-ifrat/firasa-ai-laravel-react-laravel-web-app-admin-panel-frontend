import { useEffect, useState } from "react";
import { Moon, Sun, type LucideIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

const themes: { value: Theme; name: string; icon: LucideIcon }[] = [
  { value: "light", name: "Light", icon: Sun },
  { value: "dark", name: "Dark", icon: Moon },
  // { value: "system", name: "System", icon: LaptopMinimal },
];

export default function AppThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      applyTheme(savedTheme);
      setTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    const finalTheme = newTheme === "system" ? "dark" : newTheme;
    localStorage.setItem("theme", finalTheme);
    root.classList.remove("light", "dark");
    root.classList.add(finalTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <DropdownMenu>
      {/* The button users click to open the dropdown */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          {/* Sun icon for light mode */}
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          {/* Moon icon for dark mode */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown content listing all available themes */}
      <DropdownMenuContent align="end" className="space-y-0.5">
        {themes.map((item) => {
          const isActive = item.value === theme;
          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => applyTheme(item.value)}
              className={`flex items-center gap-2 ${
                isActive ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <item.icon />
              <span>{item.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
