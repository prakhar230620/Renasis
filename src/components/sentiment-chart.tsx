'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import type { SentimentData } from '@/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

interface SentimentChartProps {
  data: SentimentData[];
}

const chartConfig = {
  positive: { label: 'Positive' },
  negative: { label: 'Negative' },
  neutral: { label: 'Neutral' },
};

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} className="focus:outline-none" />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            verticalAlign="bottom"
            align="center"
            iconSize={10}
            className="pt-4"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
