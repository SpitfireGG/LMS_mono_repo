import {
  Calendar,
  Clock,
  Users,
  BarChart3,
  FileText,
  Download,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Star,
  Target,
} from "lucide-react";
import Modal from "./Modal";

interface AssignmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: {
    title: string;
    class: string;
    className: string;
    type: string;
    dueDate: string;
    dueLabel: string;
    submissions: number;
    totalStudents: number;
    avgScore: number;
    maxScore: number;
    status: string;
    weight: number;
    color: string;
  };
}

const recentSubmissions = [
  { name: "Aria Chen", score: 92, submitted: "2h ago", status: "graded" },
  { name: "Marcus Webb", score: 85, submitted: "5h ago", status: "graded" },
  { name: "Zara Patel", score: 78, submitted: "1d ago", status: "graded" },
  { name: "David Kim", score: 0, submitted: "Pending", status: "pending" },
  { name: "Lily Tanaka", score: 0, submitted: "Pending", status: "pending" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: Clock },
  grading: { label: "Needs Grading", color: "text-amber-400", bg: "bg-amber-500/10", icon: AlertCircle },
  closed: { label: "Closed", color: "text-zinc-400", bg: "bg-zinc-800", icon: CheckCircle2 },
};

export default function AssignmentDetailsModal({
  isOpen,
  onClose,
  assignment,
}: AssignmentDetailsModalProps) {
  const st = statusConfig[assignment.status] || statusConfig.active;
  const StatusIcon = st.icon;
  const submissionPercent = Math.round(
    (assignment.submissions / assignment.totalStudents) * 100,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignment.title}
      subtitle={`${assignment.class} — ${assignment.className}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Status + Meta Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${assignment.color}15`, color: assignment.color }}
          >
            {assignment.type}
          </span>
          <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>
            <StatusIcon className="w-3 h-3" />
            {st.label}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            Worth {assignment.weight}% of final grade
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">Due Date</p>
            <p className="text-sm font-extrabold text-zinc-100 mt-0.5">{assignment.dueLabel}</p>
          </div>
          <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">Submissions</p>
            <p className="text-sm font-extrabold text-zinc-100 mt-0.5">
              {assignment.submissions}/{assignment.totalStudents}
            </p>
          </div>
          <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">Avg Score</p>
            <p className="text-sm font-extrabold text-zinc-100 mt-0.5">
              {assignment.avgScore > 0 ? `${assignment.avgScore}%` : "—"}
            </p>
          </div>
          <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">Max Score</p>
            <p className="text-sm font-extrabold text-zinc-100 mt-0.5">{assignment.maxScore}</p>
          </div>
        </div>

        {/* Submission Progress */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
            <span>Submission Rate</span>
            <span className="text-zinc-300 font-bold">{submissionPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${submissionPercent}%`, backgroundColor: assignment.color }}
            />
          </div>
        </div>

        {/* Recent Submissions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Recent Submissions
            </h4>
            <button className="text-[11px] font-bold text-accent hover:text-accent-light transition-colors cursor-pointer">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentSubmissions.map((sub, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-zinc-950 rounded-lg p-3 border border-zinc-800/50"
              >
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-accent">
                    {sub.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-200">{sub.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{sub.submitted}</p>
                </div>
                <div className="shrink-0">
                  {sub.status === "graded" ? (
                    <span className={`text-xs font-extrabold ${sub.score >= 90 ? "text-emerald-400" : sub.score >= 70 ? "text-accent" : "text-amber-400"}`}>
                      {sub.score}%
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
          <button className="flex-1 flex items-center justify-center gap-2 bg-accent-dark hover:bg-accent-dark text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
            <Edit3 className="w-3.5 h-3.5" />
            Edit Assignment
          </button>
          <button className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>
    </Modal>
  );
}
