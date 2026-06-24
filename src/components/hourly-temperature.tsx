import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { useUnit } from "@/context/unit-provider";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
  tempLabel: string;
  feelsLikeLabel: string;
  icon: string;
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  const { unit, formatTemp } = useUnit();

  const toDisplayTemp = (tempCelsius: number) => {
    if (unit === "imperial") {
      return Math.round((tempCelsius * 9) / 5 + 32);
    }

    return Math.round(tempCelsius);
  };

  const chartData: ChartData[] = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: toDisplayTemp(item.main.temp),
    feels_like: toDisplayTemp(item.main.feels_like),
    tempLabel: formatTemp(item.main.temp),
    feelsLikeLabel: formatTemp(item.main.feels_like),
    icon: item.weather[0].icon,
  }));

  return (
    <Card className="flex-1 border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold">
            Today's Temperature
          </CardTitle>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Temp
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="h-2 w-4 border-t-2 border-dashed border-slate-400" />
              Feels
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {chartData.map((item) => (
            <div
              key={item.time}
              className="rounded-xl border bg-background/55 px-2 py-2 text-center"
            >
              <p className="text-[11px] font-medium text-muted-foreground">
                {item.time}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt=""
                className="mx-auto h-8 w-8"
              />
              <p className="text-sm font-medium">{item.tempLabel}</p>
            </div>
          ))}
        </div>

        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />

              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={8}
              />

              <YAxis
  stroke="hsl(var(--muted-foreground))"
  fontSize={12}
  tickLine={false}
  axisLine={false}
  tickFormatter={(value) => `${value}°${unit === "imperial" ? "F" : "C"}`}
  width={42}
/>

              <Tooltip
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const item = payload[0].payload as ChartData;

                  return (
                    <div className="rounded-xl border bg-background/95 p-3 shadow-md backdrop-blur">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">
                        {label}
                      </p>

                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-6">
                          <span className="text-xs text-muted-foreground">
                            Temperature
                          </span>
                          <span className="text-sm font-semibold">
                            {item.tempLabel}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-6">
                          <span className="text-xs text-muted-foreground">
                            Feels like
                          </span>
                          <span className="text-sm font-semibold">
                            {item.feelsLikeLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                }}
              />

              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}