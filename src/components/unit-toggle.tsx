import { Button } from "./ui/button";
import { useUnit } from "@/context/unit-provider";

export function UnitToggle() {
  const { unit, toggleUnit } = useUnit();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleUnit}
      className="h-9 rounded-full px-3 text-sm font-medium"
      aria-label="Toggle temperature unit"
    >
      {unit === "metric" ? "°C" : "°F"}
    </Button>
  );
}