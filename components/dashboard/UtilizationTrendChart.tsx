"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Generate 14 days of utilization data
function generateData() {
  const base = [62, 58, 65, 70, 68, 72, 55, 60, 63, 66, 64, 69, 71, 62];
  const today = new Date("2025-09-01");
  return base.map((v, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      utilization: v,
      target: 70,
    };
  });
}

const DATA = generateData();

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const util = payload.find((p: any) => p.dataKey === "utilization");
  return (
    <div
      className="rounded-md border px-3 py-2 text-xs"
      style={{
        background: "#1C2128",
        borderColor: "#30363D",
        color: "#F0F6FC",
        boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
      }}
    >
      <p className="text-[10px] text-[#6E7681] mb-1">{label}</p>
      <p className="font-semibold font-mono">{util?.value}% utilization</p>
      <p className="text-[10px] text-[#6E7681] mt-0.5">Target: 70%</p>
    </div>
  );
};

export function UtilizationTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="util-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#4DA6D9" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#4DA6D9" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#21262D"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: "#6E7681", fontFamily: "JetBrains Mono, monospace" }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "#6E7681", fontFamily: "JetBrains Mono, monospace" }}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={70}
          stroke="#F5B800"
          strokeDasharray="4 3"
          strokeWidth={1}
          strokeOpacity={0.5}
          label={{
            value: "Target 70%",
            position: "insideTopRight",
            fontSize: 9,
            fill: "#F5B800",
            fontFamily: "JetBrains Mono, monospace",
          }}
        />
        <Area
          type="monotone"
          dataKey="utilization"
          stroke="#4DA6D9"
          strokeWidth={2}
          fill="url(#util-gradient)"
          dot={false}
          activeDot={{ r: 3, fill: "#4DA6D9", stroke: "#0A0C0F", strokeWidth: 1 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
