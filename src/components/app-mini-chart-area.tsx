// components/mini-area-chart.tsx

import { AreaChart, Area } from "recharts";

const miniData = [
  { value: 186 },
  { value: 305 },
  { value: 237 },
  { value: 73 },
  { value: 209 },
  { value: 214 },
];

export function MiniAreaChart() {
  return (
    <AreaChart width={80} height={40} data={miniData}>
      <Area
        dataKey="value"
        type="natural"
        stroke="var(--chart-2)"
        fill="var(--chart-2)"
        fillOpacity={0.4}
      />
    </AreaChart>
  );
}
