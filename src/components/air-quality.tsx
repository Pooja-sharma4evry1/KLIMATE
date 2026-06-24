import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity, CloudFog, Gauge, Wind } from "lucide-react";
import type { AirQualityData } from "@/api/types";

interface AirQualityProps {
  data?: AirQualityData | null;
}

type Breakpoint = {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
};

const PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 9, iLow: 0, iHigh: 50 },
  { cLow: 9.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 125.4, iLow: 151, iHigh: 200 },
  { cLow: 125.5, cHigh: 225.4, iLow: 201, iHigh: 300 },
  { cLow: 225.5, cHigh: 325.4, iLow: 301, iHigh: 500 },
];

const PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 },
];

const OPENWEATHER_LEVELS: Record<number, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

function calculateAqi(value: number, breakpoints: Breakpoint[]) {
  const bp = breakpoints.find(
    (item) => value >= item.cLow && value <= item.cHigh
  );

  if (!bp) return value > breakpoints[breakpoints.length - 1].cHigh ? 500 : 0;

  return Math.round(
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
    (value - bp.cLow) +
    bp.iLow
  );
}

function getAqiMeta(aqi: number) {
  if (aqi <= 50) {
    return {
      label: "Good",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Air quality is healthy.",
    };
  }

  if (aqi <= 100) {
    return {
      label: "Moderate",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      description: "Air quality is acceptable for most people.",
    };
  }

  if (aqi <= 150) {
    return {
      label: "Unhealthy for Sensitive Groups",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: "Sensitive people should reduce outdoor activity.",
    };
  }

  if (aqi <= 200) {
    return {
      label: "Unhealthy",
      color: "text-red-500",
      bg: "bg-red-500/10",
      description: "Limit long outdoor exposure.",
    };
  }

  if (aqi <= 300) {
    return {
      label: "Very Unhealthy",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Avoid unnecessary outdoor activity.",
    };
  }

  return {
    label: "Hazardous",
    color: "text-rose-600",
    bg: "bg-rose-500/10",
    description: "Stay indoors and avoid outdoor exposure.",
  };
}

export function AirQuality({ data }: AirQualityProps) {
  if (!data?.list?.length) return null;

  const current = data.list[0];
  const openWeatherLevel = current.main.aqi;
  const components = current.components;

  const pm25Aqi = calculateAqi(components.pm2_5, PM25_BREAKPOINTS);
  const pm10Aqi = calculateAqi(components.pm10, PM10_BREAKPOINTS);
  const estimatedAqi = Math.max(pm25Aqi, pm10Aqi);
  const meta = getAqiMeta(estimatedAqi);

  const pollutants = [
    {
      label: "PM2.5",
      value: components.pm2_5,
      aqi: pm25Aqi,
      icon: CloudFog,
      color: "text-blue-500",
    },
    {
      label: "PM10",
      value: components.pm10,
      aqi: pm10Aqi,
      icon: Wind,
      color: "text-cyan-500",
    },
    {
      label: "CO",
      value: components.co,
      icon: Activity,
      color: "text-violet-500",
    },
    {
      label: "NO₂",
      value: components.no2,
      icon: Gauge,
      color: "text-orange-500",
    },
  ];

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Air Quality</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-background/60 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Estimated AQI</p>

              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-3xl font-semibold">{estimatedAqi}</p>
                <p className={`text-sm font-medium ${meta.color}`}>
                  {meta.label}
                </p>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {meta.description}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                OpenWeather level {openWeatherLevel}/5:{" "}
                {OPENWEATHER_LEVELS[openWeatherLevel]}
              </p>
            </div>

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${meta.bg}`}
            >
              <Activity className={`h-6 w-6 ${meta.color}`} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {pollutants.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border bg-background/60 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>

                <p className="text-xl font-semibold">
                  {Math.round(item.value)}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    μg/m³
                  </span>
                </p>

                {typeof item.aqi === "number" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    AQI: {item.aqi}
                  </p>
                )}

              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}