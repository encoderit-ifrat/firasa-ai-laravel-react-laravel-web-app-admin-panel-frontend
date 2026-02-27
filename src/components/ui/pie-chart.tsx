import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import { DropdownSelector, type DropdownOption } from "../dropdown";
import { useGetDashboardDistribution } from "../../routes/_app/_dashboard/-api/queries/use-dashboard-users-destribution";

export const description = "A simple pie chart";

type ChartRange = "daily" | "last_7_days" | "monthly" | "yearly" | "all";

const chartConfig = {} satisfies ChartConfig;

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
  const { t } = useTranslation();
  const [range, setRange] = useState<ChartRange>("yearly");

  const rangeOptions: DropdownOption<ChartRange>[] = [
    { label: t("dashboard.daily"), value: "daily" },
    { label: t("dashboard.last7days"), value: "last_7_days" },
    { label: t("dashboard.month"), value: "monthly" },
    { label: t("dashboard.year"), value: "yearly" },
  ];

  const { data: dashboardDistribution } = useGetDashboardDistribution({
    params: {
      range: range,
    },
    options: {
      enabled: true,
    },
  });

  // Build chart data dynamically from API response
  const chartData = useMemo(() => {
    return [
      {
        category: t("charts.free"),
        value: dashboardDistribution?.free ?? 0,
        fill: "#FFA1E6",
      },
      {
        category: t("charts.pro"),
        value: dashboardDistribution?.pro ?? 0,
        fill: "#FA3ABC",
      },
      {
        category: t("charts.subscribers"),
        value: dashboardDistribution?.subscribers ?? 0,
        fill: "#CC0A7E",
      },
    ];
  }, [dashboardDistribution, t]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-3xl font-semibold">
            {t("charts.users")}
          </CardTitle>
          <DropdownSelector
            options={rangeOptions}
            defaultValue={rangeOptions.find((opt) => opt.value === range)}
            onChange={(opt) => setRange(opt.value)}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:flex-1">
            <ChartContainer config={chartConfig} className="min-h-[350px]">
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
                  innerRadius="0%"
                  outerRadius="100%"
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
