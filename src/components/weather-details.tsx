import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Compass, Eye, Gauge, Sunrise, Sunset, SunMedium } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";
import { useUnit } from "@/context/unit-provider";

interface WeatherDetailsProps {
  data: WeatherData;
}

export function WeatherDetails({ data }: WeatherDetailsProps) {
  const { wind, main, sys, visibility } = data;
  const { unit } = useUnit();

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };

  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  const getDaylightDuration = () => {
    const seconds = sys.sunset - sys.sunrise;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatVisibility = () => {
    const km = visibility / 1000;

    if (unit === "imperial") {
      return `${Math.round(km * 0.621371)} mi`;
    }

    return `${Math.round(km)} km`;
  };

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      note: "Start of daylight",
      icon: Sunrise,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      note: "End of daylight",
      icon: Sunset,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
    },
    {
      title: "Daylight",
      value: getDaylightDuration(),
      note: "Total daylight",
      icon: SunMedium,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Wind Direction",
      value: `${getWindDirection(wind.deg)} ${wind.deg}°`,
      note: "Current direction",
      icon: Compass,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      note: "Atmospheric pressure",
      icon: Gauge,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Visibility",
      value: formatVisibility(),
      note: "Clear viewing range",
      icon: Eye,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Weather Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {details.map((detail) => (
            <div
              key={detail.title}
              className="rounded-2xl border bg-background/60 p-4 transition-colors hover:bg-background/90"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {detail.title}
                </p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${detail.bg} ring-1 ring-black/5 dark:ring-white/10`}
                >
                  <detail.icon
                    className={`h-5 w-5 stroke-[2.4] ${detail.color}`}
                  />
                </div>
              </div>

              <p className="text-2xl font-medium tracking-tight">
                {detail.value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {detail.note}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}