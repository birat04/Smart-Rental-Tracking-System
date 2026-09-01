"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface FleetCompositionChartProps {
  fleet: {
    total: number;
    active: number;
    idle: number;
    overdue: number;
    unassigned: number;
    returnDue: number;
  };
}

const SEGMENTS = [
  { key: "active",     label: "Active",     color: "var(--status-active-dot)" },
  { key: "idle",       label: "Idle",       color: "var(--status-warning-dot)" },
  { key: "overdue",    label: "Overdue",    color: "var(--status-critical-dot)" },
  { key: "unassigned", label: "Unassigned", color: "#D93131" },
  { key: "returnDue",  label: "Return Due", color: "#CC8800" },
];

// Resolve CSS variables for recharts (which can't read CSS vars directly)
const COLORS: Record<string, string> = {
  active:     "#3FB66C",
  idle:       "#CC8800",
  overdue:    "#D93131",
  unassigned: "#B42020",
  returnDue:  "#F5A623",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
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
      <p className="font-semibold">{entry.name}</p>
      <p>
        {entry.value} asset{entry.value !== 1 ? "s" : ""} (
        {Math.round((entry.value / entry.payload.total) * 100)}%)
      </p>
    </div>
  );
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
    {payload?.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: entry.color }}
        />
        <span className="text-[10px] text-[#B1BAC4]">{entry.value}</span>
      </div>
    ))}
  </div>
);

export function FleetCompositionChart({ fleet }: FleetCompositionChartProps) {
  const data = SEGMENTS.map((s) => ({
    name: s.label,
    value: fleet[s.key as keyof typeof fleet] as number,
    total: fleet.total,
    color: COLORS[s.key],
  })).filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="42%"
          innerRadius={55}
          outerRadius={78}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
