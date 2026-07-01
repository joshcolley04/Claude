"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { AllocationSlice } from "@/types/market";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#64748B"];

export function AllocationChart({ data }: { data: AllocationSlice[] }) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2">
        {data.map((slice, i) => (
          <li key={slice.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-muted-foreground">{slice.label}</span>
            <span className="tabular-nums text-muted-foreground">
              {formatCurrency(slice.value)}
            </span>
            <span className="w-12 text-right font-medium tabular-nums">
              {slice.pct.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
