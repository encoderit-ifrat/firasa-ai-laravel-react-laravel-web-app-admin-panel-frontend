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

export const description = "A stacked bar chart showing conversion funnel";

const days: DropdownOption<number>[] = [
  { value: 7, label: "Last 7 Days" },
  { value: 14, label: "Last 14 Days" },
  { value: 30, label: "Last 30 Days" },
];

// Stacked bar chart data: conversion (pink) + non-conversion (grey)
const chartData = [
  { 
    category: "Visitors", 
    conversion: 89, 
    nonConversion: 11,
    total: 100
  },
  { 
    category: "Test Started", 
    conversion: 60, 
    nonConversion: 40,
    total: 100
  },
  { 
    category: "Test Completed", 
    conversion: 40, 
    nonConversion: 60,
    total: 100
  },
  { 
    category: "Upgraded", 
    conversion: 80, 
    nonConversion: 20,
    total: 100
  },
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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-3xl font-semibold">
            Conversion Funnel
          </CardTitle>
          <DropdownSelector options={days} defaultValue={days[0]} />
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
              domain={[0, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="conversion" stackId="a" fill="#FFA1E6" />
            <Bar dataKey="nonConversion" stackId="a" fill="#E5E5E5" />
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