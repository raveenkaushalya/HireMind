import { Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";

interface CommonProps { dark: boolean; }
const axisTick = (dark: boolean) => ({ fill: dark ? "#94a3b8" : "#64748b", fontSize: 11 });
const gridStroke = (dark: boolean) => (dark ? "#1e293b" : "#e2e8f0");

// Gold Color Palette Scheme
const DONUT_COLORS = ["#eab308", "#ca8a04", "#d97706", "#f59e0b", "#b45309", "#78350f"];

export function ShortlistTrendChart({ data, dark }: CommonProps & { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gShort" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eab308" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke(dark)} vertical={false} />
        <XAxis dataKey="date" tick={axisTick(dark)} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick(dark)} tickLine={false} axisLine={false} width={40} />
        <Tooltip cursor={{ stroke: dark ? "#334155" : "#cbd5e1", strokeWidth: 1 }} />
        <Area type="monotone" dataKey="shortlisted" stroke="#eab308" strokeWidth={2.5} fill="url(#gShort)" name="Shortlisted" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SourceDonutChart({ data, dark }: CommonProps & { data: { name: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div>
      <div className="relative mx-auto" style={{ width: 200, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" nameKey="name" stroke="none">
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
    </div>
  );
}

export function DepartmentBarChart({ data, dark }: CommonProps & { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke(dark)} vertical={false} />
        <XAxis dataKey="name" tick={axisTick(dark)} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick(dark)} tickLine={false} axisLine={false} width={40} />
        <Bar dataKey="count" name="Shortlisted" fill="#eab308" radius={[6, 6, 0, 0]} />
        <Bar dataKey="hired" name="Hired" fill="#ca8a04" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StageFunnelChart({ data, dark }: CommonProps & { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke(dark)} horizontal={false} />
        <XAxis type="number" tick={axisTick(dark)} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={axisTick(dark)} tickLine={false} axisLine={false} width={90} />
        <Bar dataKey="value" name="Candidates" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}