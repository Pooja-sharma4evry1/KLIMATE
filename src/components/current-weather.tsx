import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { useUnit } from "@/context/unit-provider";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const { unit, formatTemp, formatWind } = useUnit();

  const displayTemp = (value: number) =>
    unit === "imperial" ? Math.round((value * 9) / 5 + 32) : Math.round(value);

  const unitLabel = unit === "imperial" ? "°F" : "°C";

  const locationTitle = locationName?.name || data.name;
  const locationState = locationName?.state;
  const locationCountry = locationName?.country || data.sys.country;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid min-h-[340px] gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  {locationTitle}
                </h2>

                {locationState && (
                  <span className="text-sm text-muted-foreground">
                    , {locationState}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {locationCountry}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-start leading-none">
                <span className="text-7xl font-bold tracking-tighter">
                  {displayTemp(temp)}
                </span>
                <span className="mt-3 text-3xl font-semibold tracking-tight">
                  {unitLabel}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>

                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>

                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid max-w-sm grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-sm">
                <Droplets className="h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Humidity
                  </p>
                  <p className="text-xs text-muted-foreground">{humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-sm">
                <Wind className="h-4 w-4 shrink-0 text-blue-500" />
                <div>
                  <p className="text-xs font-medium text-foreground">Wind</p>
                  <p className="text-xs text-muted-foreground">
                    {formatWind(speed)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-gradient-to-br from-background to-muted/30 md:h-[180px] md:w-[180px]">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain drop-shadow-md"
              />
            </div>

            <p className="mt-3 text-center text-xs font-medium capitalize text-muted-foreground md:text-sm">
              {currentWeather.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}