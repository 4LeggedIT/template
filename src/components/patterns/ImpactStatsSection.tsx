import type { LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ImpactStat = {
  id: string;
  value: string | number;
  label: string;
  icon?: LucideIcon;
};

export type ImpactStatsPeriod = {
  id: string;
  label: string;
  metrics: Record<string, number>;
};

export type ImpactStatsMetricConfig = {
  label: string;
  color?: string;
};

export type ImpactStatsSectionLabels = {
  chartCaption?: string;
};

type ImpactStatsSectionProps = {
  title?: string;
  description?: string;
  lifetimeStats: ImpactStat[];
  periods?: ImpactStatsPeriod[];
  periodMetrics?: Record<string, ImpactStatsMetricConfig>;
  granularityLabel?: string;
  /** Optional small context line next to granularityLabel, e.g. "Since 2024" or "As of July 2026" — plain text, not used for any date math. */
  timeframeNote?: string;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
  labels?: ImpactStatsSectionLabels;
};

const DEFAULT_METRIC_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--highlight))",
  "hsl(var(--paw))",
  "hsl(var(--destructive))",
];

/**
 * Lifetime big-number tiles are always the primary content — this matches how small,
 * foster-based rescues actually report impact (see the standards page for the research
 * this was based on). The period-by-period bar chart is an optional add-on that only
 * appears once there are at least two periods to compare; a single period falls back to
 * a plain value list instead of a one-bar "chart" that wouldn't show a trend.
 */
const ImpactStatsSection = ({
  title,
  description,
  lifetimeStats,
  periods = [],
  periodMetrics = {},
  granularityLabel,
  timeframeNote,
  ctaHref,
  ctaLabel,
  className,
  labels = {},
}: ImpactStatsSectionProps) => {
  if (!lifetimeStats.length && !periods.length) return null;

  const metricKeys =
    Object.keys(periodMetrics).length > 0
      ? Object.keys(periodMetrics)
      : Array.from(new Set(periods.flatMap((period) => Object.keys(period.metrics))));

  const chartConfig: ChartConfig = Object.fromEntries(
    metricKeys.map((key, index) => [
      key,
      {
        label: periodMetrics[key]?.label ?? key,
        color: periodMetrics[key]?.color ?? DEFAULT_METRIC_COLORS[index % DEFAULT_METRIC_COLORS.length],
      },
    ]),
  );

  const showChart = periods.length >= 2 && metricKeys.length > 0;
  const showSinglePeriod = periods.length === 1;

  return (
    <section className={cn("space-y-8", className)}>
      {title || description || granularityLabel || timeframeNote ? (
        <div className="space-y-2 text-center">
          {title ? <h2 className="text-3xl font-bold tracking-tight">{title}</h2> : null}
          {description ? <p className="mx-auto max-w-2xl text-muted-foreground">{description}</p> : null}
          {granularityLabel || timeframeNote ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {granularityLabel ? (
                <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {granularityLabel}
                </span>
              ) : null}
              {timeframeNote ? <span className="text-xs text-muted-foreground">{timeframeNote}</span> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {lifetimeStats.length ? (
        <div className="flex flex-wrap justify-center gap-4">
          {lifetimeStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="flex w-[calc(50%-0.5rem)] flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(16.666%-0.833rem)]"
              >
                {Icon ? <Icon className="h-6 w-6 text-primary" aria-hidden="true" /> : null}
                <span className="text-3xl font-bold tabular-nums">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {showChart ? (
        <div className="space-y-2">
          {labels.chartCaption ? <p className="text-sm text-muted-foreground">{labels.chartCaption}</p> : null}
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart data={periods.map((period) => ({ label: period.label, ...period.metrics }))}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
              {/* eslint-disable @typescript-eslint/no-explicit-any -- recharts v3's generic Tooltip/Legend
                  `content` prop types don't line up with the shadcn chart.tsx wrapper's prop shape; the
                  props are still injected correctly at runtime via cloneElement. */}
              <ChartTooltip content={((props) => <ChartTooltipContent {...props} />) as any} />
              <ChartLegend content={((props) => <ChartLegendContent {...props} />) as any} />
              {/* eslint-enable @typescript-eslint/no-explicit-any */}
              {metricKeys.map((key) => (
                <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      ) : null}

      {showSinglePeriod && !showChart ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium text-foreground">{periods[0].label}</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(periods[0].metrics).map(([key, value]) => (
              <li key={key} className="flex flex-col">
                <span className="text-xl font-bold tabular-nums">{value.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{periodMetrics[key]?.label ?? key}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {ctaHref && ctaLabel ? (
        <div className="text-center">
          <Button asChild>
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>
      ) : null}
    </section>
  );
};

export default ImpactStatsSection;
