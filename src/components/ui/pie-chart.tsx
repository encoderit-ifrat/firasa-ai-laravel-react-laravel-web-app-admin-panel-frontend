import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import { DropdownSelector, type DropdownOption } from "../dropdown";

export const description = "A simple pie chart";

const days: DropdownOption<number>[] = [
  { value: 7, label: "Last 7 Days" },
  { value: 14, label: "Last 14 Days" },
  { value: 30, label: "Last 30 Days" },
];

const chartData = [
  { category: "Free", value: 89, fill: "#FFA1E6" },
  { category: "Pro", value: 14, fill: "#FA3ABC" },
  { category: "Subscribers", value: 18, fill: "#CC0A7E" },
  
];

const chartConfig = {
  // value: {
  //   label: "Count",
  // },
  // free: {
  //   label: "Free",
  //   color: "#FFA1E6",
  // },
  // pro: {
  //   label: "Pro",
  //   color: "#FA3ABC",
  // },
  // subscribers: {
  //   label: "Subscribers",
  //   color: "#CC0A7E",
  // },
} satisfies ChartConfig;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  category,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className=""
    >
      <tspan x={x} dy="-0.5em">
        {category}
      </tspan>
      <tspan x={x} dy="1.2em">
        {value}
      </tspan>
    </text>
  );
};

export function CircleChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-3xl font-semibold">User</CardTitle>
          <DropdownSelector options={days} defaultValue={days[0]} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:flex-1">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="category"
                  startAngle={90}
                  endAngle={-270}
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="flex flex-col gap-3 lg:justify-center">
            {chartData.map((entry) => (
              <div key={entry.category} className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm">{entry.category}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
