'use client';

import * as React from 'react';
import { Pie, PieChart, Cell, Label } from 'recharts';
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

interface SentimentChartProps {
  data: SentimentData[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

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
              formatter={(value, name) => {
                const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;
                return `${value} (${percentage}%)`;
              }}
            />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={80}
            strokeWidth={2}
            stroke="hsl(var(--background))"
            labelLine={false}
          >
             <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalValue}
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground text-sm"
                      >
                        Total Reviews
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} className="focus:outline-none focus:ring-2 focus:ring-primary/50" />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent 
              nameKey="name"
              formatter={(name, entry) => {
                const item = data.find(d => d.name === name);
                if (!item) return name;
                const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0;
                return `${item.name}: ${percentage}%`;
              }} 
            />}
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
