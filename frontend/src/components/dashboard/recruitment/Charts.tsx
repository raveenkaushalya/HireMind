import {
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface CommonProps {
  dark: boolean;
}

const axisTick = (dark: boolean) => ({
  fill: dark ? "#94a3b8" : "#64748b",
  fontSize: 11,
});

const gridStroke = (dark: boolean) => (dark ? "#1e293b" : "#e2e8f0");

function TooltipBox({
  active,
  payload,
  label,
  dark,
  suffix = "",
}: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className={`rounded-lg border px-3 py-2 shadow-lg backdrop-blur-md text-xs ${
        dark
          ? "bg-slate-900/90 border-slate-700 text-slate-100"
          : "bg-white/95 border-slate-200 text-slate-800"
      }`}
    >
      {label !== undefined && (
        <div className="font-semibold mb-1 opacity-80">{label}</div>
      )}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color || p.payload?.fill }}
          />
          <span className="opacity-70">{p.name}:</span>
          <span className="font-semibold">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ------------------ Line / Area Chart ------------------
interface TrendPoint {
  date: string;
  shortlisted: number;
  interviews: number;
  offers: number;
}
export function ShortlistTrendChart({
  data,
  dark,
}: CommonProps & { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gShort" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gInt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gOff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke(dark)} vertical={false} />
        <XAxis dataKey="date" tick={axisTick(dark)} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick(dark)} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox dark={dark} />} cursor={{ stroke: dark ? "#334155" : "#cbd5e1", strokeWidth: 1 }} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: dark ? "#cbd5e1" : "#475569", paddingTop: 8 }}
        />
        <Area
          type="monotone"
          dataKey="shortlisted"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#gShort)"
          name="Shortlisted"
          animationDuration={800}
        />
        <Area
          type="monotone"
          dataKey="interviews"
          stroke="#14b8a6"
          strokeWidth={2.5}
          fill="url(#gInt)"
          name="Interviews"
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="offers"
          stroke="#f59e0b"
          strokeWidth={2.5}
          fill="url(#gOff)"
          name="Offers"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ------------------ Bar Chart ------------------
export function DepartmentBarChart({
  data,
  dark,
}: CommonProps & { data: { name: string; count: number; hired: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke(dark)} vertical={false} />
        <XAxis dataKey="name" tick={axisTick(dark)} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick(dark)} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<TooltipBox dark={dark} />} cursor={{ fill: dark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.05)" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: dark ? "#cbd5e1" : "#475569", paddingTop: 8 }} />
        <Bar dataKey="count" name="Shortlisted" fill="#6366f1" radius={[6, 6, 0, 0]} animationDuration={800} />
        <Bar dataKey="hired" name="Hired" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ------------------ Donut Chart ------------------
const DONUT_COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#ec4899", "#0ea5e9", "#a855f7"];

export function SourceDonutChart({
  data,
  dark,
}: CommonProps & { data: { name: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div>
      <div className="relative mx-auto" style={{ width: 200, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<TooltipBox dark={dark} />} />
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              stroke="none"
              animationDuration={900}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold leading-none ${dark ? "text-slate-100" : "text-slate-900"}`}>{total}</span>
          <span className={`text-[11px] mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Total sources</span>
        </div>
      </div>
      <div className="mt-5 pt-1 text-xs grid grid-cols-2 gap-x-6 gap-y-0">
        {data.map((d, i) => (
          <div
            key={d.name}
            className={`flex items-center gap-2.5 py-2 ${
              i < data.length - 2 ? (dark ? "border-b border-slate-800/60" : "border-b border-slate-100") : ""
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className={`truncate font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{d.name}</span>
            <span className={`ml-auto font-bold text-sm ${dark ? "text-slate-100" : "text-slate-900"}`}>
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------ Stage Funnel (horizontal bar) ------------------
export function StageFunnelChart({
  data,
  dark,
}: CommonProps & { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke(dark)} horizontal={false} />
        <XAxis type="number" tick={axisTick(dark)} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={axisTick(dark)} tickLine={false} axisLine={false} width={90} />
        <Tooltip content={<TooltipBox dark={dark} />} cursor={{ fill: dark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.05)" }} />
        <Bar dataKey="value" name="Candidates" radius={[0, 6, 6, 0]} animationDuration={900}>
          {data.map((_, i) => (
            <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Sparkline for KPI cards
export function Sparkline({ data, color, height = 42 }: { data: number[]; color: string; height?: number }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const gradId = `sparkGrad-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" fill={`url(#${gradId})`} stroke="none" isAnimationActive animationDuration={800} />
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
