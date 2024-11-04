"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { WeeklyMetricsResponse } from "@/actions";

interface Props {
  data: WeeklyMetricsResponse[];
  labels?: string[];
}

const chartConfig = {
  desktop: {
    label: "Impressões",
    color: "#098637",
  },
  mobile: {
    label: "Conversões",
    color: "#125326",
  },
} satisfies ChartConfig;
export function BarMultiple({ data, labels }: Props) {

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="impressions" fill="#098637" radius={4} />
        <Bar dataKey="conversions" fill="#125326" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
