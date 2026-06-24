import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";
import { ThemeToggle } from "./theme-toggle";
import { UnitToggle } from "./unit-toggle";
import { useTheme } from "@/context/theme-provider";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-20 items-center justify-between px-4 lg:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img
              src={theme === "dark" ? "/logo.png" : "/logo2.png"}
              alt="KLIMATE Logo"
              className="h-12 w-auto md:h-14"
            />

            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Weather Forecast
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block">
              <CitySearch />
            </div>

            <UnitToggle />
            <ThemeToggle />
          </div>
        </div>

        <div className="border-t border-border/50 px-4 py-3 md:hidden">
          <CitySearch />
        </div>
      </div>
    </header>
  );
}