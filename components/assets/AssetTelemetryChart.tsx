"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AssetTelemetryChartProps {
  engineHoursPerDay: number;
  idleHoursPerDay: number;
  operatingDays: number;
}

// Generate realistic daily telemetry data based on current average rates
function generateDailyTelemetry(engineRate: number, idleRate: number, days: number) {
  const points = [];
  const today = new Date("2025-09-01");
  const count = Math.min(days, 14); // show last 14 days

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Add realistic variance
    const variance = (Math.sin(i * 1.2) * 0.3);
    const engine = Math.max(0, Number((engineRate + (engineRate > 0 ? variance : 0)).toFixed(1)));
    const idle = Math.max(0, Number((idleRate + (idleRate > 0 ? variance * 0.5 : 0)).toFixed(1)));

    points.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      engineHours: engine,
      idleHours: idle,
      totalHours: Number((engine + idle).toFixed(1)),
    });
  }
  return points;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const engine = payload.find((p: any) => p.dataKey === "engineHours")?.value ?? 0;
  const idle = payload.find((p: any) => p.dataKey === "idleHours")?.value ?? 0;

  return (
    <div
      className="rounded-md border p-2.5 text-xs shadow-xl"
      style={{
        background: "#1C2128",
        borderColor: "#30363D",
        color: "#F0F6FC",
      }}
    >
      <p className="text-[10px] text-[#8B949E] font-medium mb-1.5">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[#3FB66C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB66C]" />
            Engine Runtime:
          </span>
          <span className="font-mono font-bold">{engine}h</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[#F5A623]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
            Idle Time:
          </span>
          <span className="font-mono font-bold">{idle}h</span>
        </div>
      </div>
    </div>
  );
};

export function AssetTelemetryChart({
  engineHoursPerDay,
  idleHoursPerDay,
  operatingDays,
}: AssetTelemetryChartProps) {
  const data = generateDailyTelemetry(engineHoursPerDay, idleHoursPerDay, operatingDays);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-label text-[10px] text-[var(--text-tertiary)]">
          TELEMETRY LOG (LAST {data.length} DAYS)
        </span>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3FB66C]" />
            <span className="text-[var(--text-secondary)] text-[11px]">Engine (Avg {engineHoursPerDay}h/d)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
            <span className="text-[var(--text-secondary)] text-[11px]">Idle (Avg {idleHoursPerDay}h/d)</span>
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="engineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3FB66C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3FB66C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="idleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F5A623" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F5A623" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#8B949E", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#8B949E", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="engineHours"
              name="Engine Hours"
              stroke="#3FB66C"
              strokeWidth={2}
              fill="url(#engineGradient)"
            />
            <Area
              type="monotone"
              dataKey="idleHours"
              name="Idle Hours"
              stroke="#F5A623"
              strokeWidth={2}
              fill="url(#idleGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
