// components/mini-area-chart.tsx

import { AreaChart, Area } from "recharts";

const miniDataPositive = [
  { value: 186 },
  { value: 305 },
  { value: 237 },
  { value: 73 },
  { value: 209 },
  { value: 214 },
];

const miniDataNegative = [
  { value: 214 },
  { value: 209 },
  { value: 73 },
  { value: 237 },
  { value: 305 },
  { value: 186 },
];

interface MiniAreaChartProps {
  trend?: "positive" | "negative";
}

export function MiniAreaChart({ trend = "positive" }: MiniAreaChartProps) {
  const data = trend === "positive" ? miniDataPositive : miniDataNegative;
  const color = trend === "positive" ? "#22c55e" : "#ef4444"; // green-500 or red-500

  return (
    <AreaChart width={80} height={40} data={data}>
      <Area
        dataKey="value"
        type="natural"
        stroke={color}
        fill={color}
        fillOpacity={0.4}
      />
    </AreaChart>
  );
}
