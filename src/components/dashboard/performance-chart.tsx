"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PerformancePoint } from "@/types/market";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: "#8a8a8a", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            tick={{ fill: "#8a8a8a", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => formatCompact(v)}
            domain={["dataMin - 2000", "dataMax + 2000"]}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(17,17,17,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 12,
            }}
            labelStyle={{ color: "#8a8a8a" }}
            formatter={(value: number) => [formatCurrency(value), "Value"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#perfFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
