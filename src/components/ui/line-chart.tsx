import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import { DropdownSelector, type DropdownOption } from "../dropdown";
import { useGetDashboardConversionFunnel } from "../../routes/_app/_dashboard/-api/queries/use-dashboard-conversion-funnel";

export const description = "A stacked bar chart showing conversion funnel";

type ChartRange = "daily" | "last_7_days" | "monthly" | "yearly" | "all";

const rangeOptions: DropdownOption<ChartRange>[] = [
  { label: "Daily", value: "daily" },
  { label: "Last 7 days", value: "last_7_days" },
  { label: "Month", value: "monthly" },
  { label: "Year", value: "yearly" },
];

const chartConfig = {
  conversion: {
    label: "Conversion",
    color: "#FFA1E6",
  },
  nonConversion: {
    label: "Non-Conversion",
    color: "#E5E5E5",
  },
} satisfies ChartConfig;

export function LineChart() {
  const [range, setRange] = useState<ChartRange>("yearly");

  const { data: dashboardConversionFunnel } = useGetDashboardConversionFunnel({
    params: {
      range: range,
    },
    options: {
      enabled: true,
    },
  });

  // Build chart data dynamically from API response
  const chartData = useMemo(() => {
    const visitors = dashboardConversionFunnel?.visitors ?? 0;
    const testStarted = dashboardConversionFunnel?.test_started ?? 0;
    const testCompleted = dashboardConversionFunnel?.test_completed ?? 0;
    const upgraded = dashboardConversionFunnel?.upgraded ?? 0;

    return [
      { category: "Visitors", conversion: visitors },
      { category: "Test Started", conversion: testStarted },
      { category: "Test Completed", conversion: testCompleted },
      { category: "Upgraded", conversion: upgraded },
    ];
  }, [dashboardConversionFunnel]);

  // Calculate max value for Y-axis domain
  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.conversion));
    return Math.ceil(max / 10) * 10 || 100; // Round up to nearest 10, default to 100
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-3xl font-semibold">
            Conversion Funnel
          </CardTitle>
          <DropdownSelector
            options={rangeOptions}
            defaultValue={rangeOptions.find(opt => opt.value === range)}
            onChange={(opt) => setRange(opt.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
            />
            <YAxis
              axisLine={true}
              domain={[0, maxValue]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="conversion" fill="#FFA1E6" />
          </BarChart>
        </ChartContainer>
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#FFA1E6]"></div>
            <span className="text-sm text-muted-foreground">Conversion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}