import { LineChart, BarChart2, TrendingUp, Award } from 'lucide-react';

export default function ProgressView() {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
          Progress & Analytics
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Track your study habits, scores, and achievement history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-dark/10 text-accent flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-200">Study Streak</h3>
          </div>
          <p className="text-3xl font-extrabold text-zinc-100">14 Days</p>
          <p className="text-xs text-emerald-400 font-bold mt-2">▲ Personal Best!</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-200">Completion Velocity</h3>
          </div>
          <p className="text-3xl font-extrabold text-zinc-100">8.5 <span className="text-sm text-zinc-500 font-medium">hrs/week</span></p>
          <p className="text-xs text-emerald-400 font-bold mt-2">▲ Top 10% of cohort</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-200">Average Grade</h3>
          </div>
          <p className="text-3xl font-extrabold text-zinc-100">92%</p>
          <p className="text-xs text-zinc-500 font-bold mt-2">Stable across 4 courses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800 min-h-[300px] flex flex-col items-center justify-center text-center">
          <LineChart className="w-12 h-12 text-zinc-700 mb-4" />
          <h4 className="font-bold text-zinc-300">Grade Trend Chart</h4>
          <p className="text-xs text-zinc-500 mt-2 max-w-xs">Detailed historical grade trends will populate here once enough graded assignments are returned.</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-800 min-h-[300px] flex flex-col items-center justify-center text-center">
          <BarChart2 className="w-12 h-12 text-zinc-700 mb-4" />
          <h4 className="font-bold text-zinc-300">Time-of-day Heatmap</h4>
          <p className="text-xs text-zinc-500 mt-2 max-w-xs">Shows when you are most productive during the week. Data gathering in progress.</p>
        </div>
      </div>
    </div>
  );
}
