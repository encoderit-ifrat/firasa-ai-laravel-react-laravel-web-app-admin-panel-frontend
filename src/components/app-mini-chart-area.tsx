import { AreaChart, Area, ResponsiveContainer } from "recharts";

const miniDataPositive = [
  { value: 15 },
  { value: 35 },
  { value: 45 },
  { value: 25 },
  { value: 30 },
  { value: 35 },
  { value: 15 },
  { value: 40 },
  { value: 45 },
  { value: 40 },
  { value: 55 },
  { value: 25 },
  { value: 30 },
  { value: 35 },
  { value: 25 },
  { value: 15 },
];

const miniDataNegative = [
  { value: 15 },
  { value: 25 },
  { value: 35 },
  { value: 20 },
  { value: 25 },
  { value: 30 },
  { value: 25 },
  { value: 22 },
  { value: 28 },
  { value: 25 },
  { value: 35 },
  { value: 28 },
  { value: 32 },
  { value: 55 },
  { value: 35 },
  { value: 15 },
];

interface MiniAreaChartProps {
  trend?: "positive" | "negative";
}

export function MiniAreaChart({ trend = "positive" }: MiniAreaChartProps) {
  const data = trend === "positive" ? miniDataPositive : miniDataNegative;
  const strokeColor = trend === "positive" ? "#26BF94" : "#FF3B30";
  const gradientId = `color${trend.charAt(0).toUpperCase() + trend.slice(1)}`;

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26BF94" stopOpacity={0.59} />
            <stop offset="100%" stopColor="#26BF94" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
            <stop offset="23.13%" stopColor="#FF3B30" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
