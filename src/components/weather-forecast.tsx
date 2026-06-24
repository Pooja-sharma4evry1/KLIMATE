import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { useUnit } from "@/context/unit-provider";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const { formatTemp, formatWind } = useUnit();

  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecasts).slice(1, 6);

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          5-Day Forecast
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid gap-3 rounded-2xl border bg-background/60 p-4 transition-colors hover:bg-background/90 sm:grid-cols-[1.25fr_1fr_1fr]"
            >
              <div className="min-w-0">
                <p className="font-medium leading-none">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="mt-1 truncate text-sm capitalize text-muted-foreground">
                  {day.weather.description}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:justify-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <ArrowDown className="h-3.5 w-3.5" />
                  {formatTemp(day.temp_min)}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-sm font-medium text-red-600 dark:text-red-400">
                  <ArrowUp className="h-3.5 w-3.5" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground sm:justify-end">
                <span className="inline-flex items-center gap-1.5">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  {day.humidity}%
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Wind className="h-4 w-4 text-cyan-500" />
                  {formatWind(day.wind)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}