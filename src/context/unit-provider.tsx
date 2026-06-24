import { createContext, useContext, useMemo, useState } from "react";

type Unit = "metric" | "imperial";

interface UnitContextType {
  unit: Unit;
  toggleUnit: () => void;
  formatTemp: (tempCelsius: number) => string;
  formatWind: (speedMetersPerSecond: number) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

function celsiusToFahrenheit(value: number) {
  return (value * 9) / 5 + 32;
}

function getInitialUnit(): Unit {
  if (typeof window === "undefined") return "metric";

  const savedUnit = window.localStorage.getItem("klimate-unit");

  if (savedUnit === "metric" || savedUnit === "imperial") {
    return savedUnit;
  }

  return "metric";
}

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<Unit>(getInitialUnit);

  const value = useMemo(
    () => ({
      unit,
      toggleUnit: () =>
        setUnit((current) => {
          const nextUnit = current === "metric" ? "imperial" : "metric";
          window.localStorage.setItem("klimate-unit", nextUnit);
          return nextUnit;
        }),
      formatTemp: (tempCelsius: number) => {
        if (unit === "imperial") {
          return `${Math.round(celsiusToFahrenheit(tempCelsius))}°F`;
        }

        return `${Math.round(tempCelsius)}°C`;
      },
      formatWind: (speedMetersPerSecond: number) => {
        if (unit === "imperial") {
          return `${Math.round(speedMetersPerSecond * 2.237)} mph`;
        }

        return `${Math.round(speedMetersPerSecond * 3.6)} km/h`;
      },
    }),
    [unit]
  );

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
}

export function useUnit() {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error("useUnit must be used inside UnitProvider");
  }

  return context;
}