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

const chartConfig = {
  positive: { label: 'Positive', color: 'hsl(var(--chart-3))' },
  negative: { label: 'Negative', color: 'hsl(var(--chart-5))' },
  neutral: { label: 'Neutral', color: 'hsl(var(--chart-4))' },
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
            cursor={true}
            content={<ChartTooltipContent 
              className="bg-card/80 backdrop-blur-sm"
              hideLabel 
            />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
            stroke="hsl(var(--background))"
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} className="focus:outline-none focus:ring-2 focus:ring-primary/50" />
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