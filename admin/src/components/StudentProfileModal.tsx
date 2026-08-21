import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react";
import Modal from "./Modal";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    email: string;
    class: string;
    className: string;
    grade: string;
    gradePoint: number;
    attendance: number;
    completion: number;
    trend: "up" | "down";
    trendChange: string;
    lastActive: string;
    submissions: number;
    status: string;
  };
}

const recentGrades = [
  { assignment: "User Research Report", score: 92, maxScore: 100, date: "Apr 15" },
  { assignment: "Wireframe Prototype", score: 88, maxScore: 100, date: "Apr 10" },
  { assignment: "Usability Heuristic Eval", score: 95, maxScore: 100, date: "Apr 5" },
  { assignment: "Midterm Project", score: 87, maxScore: 100, date: "Mar 28" },
];

const upcomingDeadlines = [
  { title: "Final Project Proposal", due: "Apr 25", class: "UXD-301" },
  { title: "Portfolio Review", due: "Apr 28", class: "UXD-301" },
];

export default function StudentProfileModal({
  isOpen,
  onClose,
  student,
}: StudentProfileModalProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const statusColor =
    student.status === "top"
      ? "text-emerald-400 bg-emerald-500/10"
      : student.status === "at-risk"
        ? "text-rose-400 bg-rose-500/10"
        : "text-accent bg-accent/10";

  const statusLabel =
    student.status === "top"
      ? "Top Performer"
      : student.status === "at-risk"
        ? "At Risk"
        : "On Track";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile"
      subtitle={student.email}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center shrink-0 ring-2 ring-zinc-800">
              <span className="text-lg font-bold text-accent">{initials}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-zinc-100">
                  {student.name}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {student.class} — {student.className}
              </p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Active {student.lastActive}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer" title="Message">
                <Mail className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer" title="Call">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Grade", value: student.grade, sub: `GPA ${student.gradePoint.toFixed(1)}` },
            { label: "Attendance", value: `${student.attendance}%`, sub: "This semester" },
            { label: "Completion", value: `${student.completion}%`, sub: student.trendChange, trend: student.trend },
            { label: "Submissions", value: student.submissions.toString(), sub: "Total submitted" },
          ].map((m) => (
            <div key={m.label} className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase">{m.label}</p>
              <p className="text-lg font-extrabold text-zinc-100 mt-0.5">{m.value}</p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                {"trend" in m && m.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                ) : "trend" in m && m.trend === "down" ? (
                  <ArrowDownRight className="w-3 h-3 text-rose-400" />
                ) : null}
                <span className={`text-[10px] font-bold ${"trend" in m && m.trend === "up" ? "text-emerald-400" : "trend" in m && m.trend === "down" ? "text-rose-400" : "text-zinc-500"}`}>
                  {m.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Grades */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Recent Grades
          </h4>
          <div className="space-y-2">
            {recentGrades.map((g, i) => {
              const pct = Math.round((g.score / g.maxScore) * 100);
              return (
                <div key={i} className="flex items-center gap-3 bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-200 truncate">{g.assignment}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{g.date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-accent-dark" : "bg-amber-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-extrabold text-zinc-100 w-8 text-right">
                      {g.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Upcoming Deadlines
          </h4>
          <div className="space-y-2">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className="flex items-center justify-between bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <p className="text-xs font-bold text-zinc-200">{d.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">{d.class}</span>
                  <span className="text-[11px] font-mono text-amber-400">Due {d.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
