import { motion } from "motion/react";
import {
  Users,
  TrendingUp,
  Clock,
  Award,
  BarChart3,
  Target,
} from "lucide-react";
import Modal from "./Modal";

interface ClassAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  classCode: string;
  students: number;
  completion: number;
  avgGrade: string;
}

const gradeDistribution = [
  { grade: "A", percent: 42, color: "bg-emerald-500" },
  { grade: "B", percent: 36, color: "bg-accent" },
  { grade: "C", percent: 15, color: "bg-amber-500" },
  { grade: "D/F", percent: 7, color: "bg-rose-500" },
];

const weeklyEngagement = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 90 },
  { day: "Thu", value: 68 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 30 },
  { day: "Sun", value: 20 },
];

const recentActivity = [
  { action: "Aria Chen submitted User Research Report", time: "2h ago", type: "submission" },
  { action: "Jake Morrison missed deadline", time: "5h ago", type: "alert" },
  { action: "David Kim completed Milestone 3", time: "1d ago", type: "completion" },
  { action: "Average quiz score improved to 84%", time: "2d ago", type: "stat" },
];

export default function ClassAnalyticsModal({
  isOpen,
  onClose,
  className,
  classCode,
  students,
  completion,
  avgGrade,
}: ClassAnalyticsModalProps) {
  const maxEngagement = Math.max(...weeklyEngagement.map((d) => d.value));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${classCode} — Analytics`}
      subtitle={className}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Students", value: students.toString(), icon: Users, color: "text-accent", bg: "bg-accent/15" },
            { label: "Avg Grade", value: avgGrade, icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/15" },
            { label: "Completion", value: `${completion}%`, icon: Target, color: "text-violet-400", bg: "bg-violet-500/15" },
            { label: "Engagement", value: "82%", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/15" },
          ].map((m) => (
            <div key={m.label} className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
              <div className={`w-8 h-8 rounded-lg ${m.bg} ${m.color} flex items-center justify-center mx-auto mb-2`}>
                <m.icon className="w-4 h-4" />
              </div>
              <p className="text-sm font-extrabold text-zinc-100">{m.value}</p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Grade Distribution */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Grade Distribution
          </h4>
          <div className="space-y-2">
            {gradeDistribution.map((g) => (
              <div key={g.grade} className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-400 w-6 text-right">
                  {g.grade}
                </span>
                <div className="flex-1 bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${g.color}`}
                  />
                </div>
                <span className="text-[11px] font-mono text-zinc-500 w-8 text-right">
                  {g.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Engagement */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Weekly Engagement
          </h4>
          <div className="flex items-end gap-2 h-28">
            {weeklyEngagement.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxEngagement) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full bg-accent-dark/80 rounded-t-lg min-h-[4px]"
                />
                <span className="text-[9px] font-mono text-zinc-500">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Recent Activity
          </h4>
          <div className="space-y-2">
            {recentActivity.map((act, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-zinc-950 rounded-lg p-2.5 border border-zinc-800/50"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    act.type === "submission"
                      ? "bg-accent"
                      : act.type === "alert"
                        ? "bg-rose-400"
                        : act.type === "completion"
                          ? "bg-emerald-400"
                          : "bg-violet-400"
                  }`}
                />
                <p className="text-[11px] text-zinc-300 flex-1">{act.action}</p>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
