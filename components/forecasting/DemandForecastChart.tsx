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
import type { ForecastPoint } from "@/types";

interface DemandForecastChartProps {
  dataPoints: ForecastPoint[];
  equipmentTypeName: string;
  siteName: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as ForecastPoint;

  return (
    <div
      className="rounded-md border p-3 text-xs shadow-xl"
      style={{
        background: "#1C2128",
        borderColor: "#30363D",
        color: "#F0F6FC",
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-[#30363D]">
        <span className="text-[10px] text-[#8B949E] font-mono">{point.date}</span>
        <span
          className="text-[9px] px-1.5 py-0.2 rounded font-bold"
          style={{
            background: point.isForecasted ? "rgba(245,184,0,0.15)" : "rgba(77,166,217,0.15)",
            color: point.isForecasted ? "#F5B800" : "#4DA6D9",
          }}
        >
          {point.isForecasted ? "PROJECTION" : "HISTORICAL"}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#8B949E]">Required Units:</span>
          <span className="font-mono font-bold text-sm text-[#F0F6FC]">{point.value} units</span>
        </div>
        {point.isForecasted && (
          <div className="flex items-center justify-between gap-4 text-[10px] text-[#8B949E]">
            <span>Confidence Range (87%):</span>
            <span className="font-mono">{point.confidenceLow?.toFixed(1)} – {point.confidenceHigh?.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export function DemandForecastChart({
  dataPoints,
  equipmentTypeName,
  siteName,
}: DemandForecastChartProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-[var(--text-primary)]">
            {equipmentTypeName} Demand Curve — {siteName}
          </h3>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            30-Day Historical Baseline vs. 7-Day AI Shortage Projection (87% Confidence)
          </p>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-[#4DA6D9] rounded" />
            <span className="text-[var(--text-secondary)]">Historical Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-[#F5B800] rounded" />
            <span className="text-[var(--brand-primary)] font-semibold">Forecast Horizon (+2 Demand)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataPoints} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="historicalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4DA6D9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#4DA6D9" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F5B800" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F5B800" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "#8B949E", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#8B949E", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              domain={[0, 8]}
              tickFormatter={(v) => `${v}u`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Split historical vs forecasted rendering */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F5B800"
              strokeWidth={2}
              fill="url(#forecastGrad)"
              dot={(props: any) => {
                if (props.payload.isForecasted) {
                  return (
                    <circle
                      key={props.key}
                      cx={props.cx}
                      cy={props.cy}
                      r={3}
                      fill="#F5B800"
                      stroke="#0A0C0F"
                      strokeWidth={1}
                    />
                  );
                }
                return <circle key={props.key} cx={0} cy={0} r={0} />;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
