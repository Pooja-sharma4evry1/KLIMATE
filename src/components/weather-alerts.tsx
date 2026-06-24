import {
  AlertTriangle,
  CloudRain,
  Eye,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { ForecastData, WeatherData } from "@/api/types";
import { useUnit } from "@/context/unit-provider";

interface WeatherAlertsProps {
  data: WeatherData;
  forecast?: ForecastData;
}

type WeatherAlert = {
  title: string;
  message: string;
  icon: typeof AlertTriangle;
  color: string;
  bg: string;
};

export function WeatherAlerts({ data, forecast }: WeatherAlertsProps) {
  const { formatTemp, formatWind, unit } = useUnit();

  const alerts: WeatherAlert[] = [];

  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeedMs = data.wind.speed;
  const windSpeedKmh = windSpeedMs * 3.6;
  const visibilityKm = data.visibility / 1000;
  const condition = data.weather[0].main.toLowerCase();

  const formattedVisibility =
    unit === "imperial"
      ? `${Math.round(visibilityKm * 0.621371)} mi`
      : `${Math.round(visibilityKm)} km`;

  const rainExpected = forecast?.list
    .slice(0, 8)
    .some((item) => item.weather[0].main.toLowerCase().includes("rain"));

  if (temp >= 38) {
    alerts.push({
      title: "High Temperature",
      message: `Heat levels are high at ${formatTemp(
        temp
      )}. Stay hydrated and avoid long outdoor exposure.`,
      icon: ThermometerSun,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    });
  }

  if (windSpeedKmh >= 30) {
    alerts.push({
      title: "Strong Wind",
      message: `Wind speed is around ${formatWind(
        windSpeedMs
      )}. Be careful outdoors.`,
      icon: Wind,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    });
  }

  if (humidity >= 75) {
    alerts.push({
      title: "High Humidity",
      message: `Humidity is ${humidity}%, so the weather may feel warmer than shown.`,
      icon: ThermometerSun,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    });
  }

  if (visibilityKm <= 3) {
    alerts.push({
      title: "Low Visibility",
      message: `Visibility is around ${formattedVisibility}. Take extra care while travelling.`,
      icon: Eye,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    });
  }

  if (condition.includes("rain") || rainExpected) {
    alerts.push({
      title: "Rain Expected",
      message: "Rain is possible in the coming hours. Carry an umbrella.",
      icon: CloudRain,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      title: "No Weather Alerts",
      message: "Conditions look stable for now.",
      icon: AlertTriangle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    });
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Weather Alerts
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.title}
              className="flex gap-3 rounded-2xl border bg-background/60 p-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${alert.bg}`}
              >
                <alert.icon className={`h-5 w-5 ${alert.color}`} />
              </div>

              <div>
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}