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

export const description = "A bar chart showing user metrics";

const days: DropdownOption<number>[] = [
  { value: 7, label: "Last 7 Days" },
  { value: 14, label: "Last 14 Days" },
  { value: 30, label: "Last 30 Days" },
];

const chartData = [
  { category: "Visitors", value: 89, fill: "#FFA1E6" },
  { category: "Test Started", value: 55, fill: "#FFA1E6" },
  { category: "Test Completed", value: 65, fill: "#FFA1E6" },
  { category: "Upgraded", value: 95, fill: "#FFA1E6" },
];

const chartConfig = {
  value: {
    label: "Count",
    color: "#FFA1E6",
  },
} satisfies ChartConfig;

export function LineChart() {
  return (
    <Card >
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-3xl font-semibold">
            Conversion Funnel
          </CardTitle>
          <DropdownSelector options={days} defaultValue={days[0]} />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}  >
          <BarChart accessibilityLayer data={chartData} >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
            />
            <YAxis
             axisLine={true}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value"  />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}