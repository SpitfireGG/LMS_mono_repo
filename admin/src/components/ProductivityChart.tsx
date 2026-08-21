import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ProductivityChartProps {
  completedCount: number;
}

export default function ProductivityChart({ completedCount }: ProductivityChartProps) {
  // We have 6 days of data, modeled closely to the design.
  // We can vary the last columns slightly depending on how many sessions the user has ticked completed!
  const baseData = [
    { name: 'Mon', progress: 40, active: 30 },
    { name: 'Tue', progress: 80, active: 55 },
    { name: 'Wed', progress: 30, active: 20 },
    { name: 'Thu', progress: 60, active: 45 },
    { name: 'Fri', progress: 90, active: 75 },
    { name: 'Sat', progress: 50, active: 35 },
  ];

  // Dynamically boost progress on the current day based on user interaction (e.g. completedCount)
  const chartData = baseData.map((d, index) => {
    if (index === 4) { // Friday (current day)
      const valueMultiplier = Math.min(100, 75 + completedCount * 5);
      return {
        ...d,
        progress: Math.min(100, valueMultiplier + 10),
        active: valueMultiplier,
      };
    }
    return d;
  });

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm text-zinc-150 uppercase tracking-wider font-mono">Productivity</h3>
        <button
          onClick={() => alert(`Productivity index is calculated at ${Math.round(chartData.reduce((acc, curr) => acc + curr.active, 0) / 6)}% based on complete sessions.`)}
          className="text-xs font-bold text-accent hover:text-accent-light flex items-center gap-1 font-mono cursor-pointer transition-colors"
        >
          Details <span className="text-[12px]">→</span>
        </button>
      </div>

      <div className="h-44 w-full text-[11px] font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            barSize={12}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', opacity: 0.8, fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              ticks={[25, 50, 75, 90]}
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: '#71717a', opacity: 0.6, fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(124, 58, 237, 0.05)', radius: 10 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-zinc-950 text-zinc-100 p-2.5 rounded-xl text-[11px] shadow-2xl font-sans">
                      <p className="font-bold text-center pb-1 mb-1 font-mono text-zinc-300">{data.name}</p>
                      <p className="flex justify-between gap-4 mt-1">
                        <span>Efficiency:</span>
                        <span className="font-bold text-accent font-mono">{data.active}%</span>
                      </p>
                      <p className="flex justify-between gap-4">
                        <span>Study Track:</span>
                        <span className="font-bold text-emerald-400 font-mono">{data.progress}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="progress" fill="rgba(124, 58, 237, 0.15)" radius={[10, 10, 10, 10]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 4 ? 'rgba(124, 58, 237, 0.75)' : 'rgba(124, 58, 237, 0.2)'} // Highlight Friday
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
