import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Edit3,
  FileText,
  Calendar,
  Users,
  BarChart3,
  ChevronDown,
  ArrowUpRight,
  Star,
  Filter,
} from "lucide-react";
import CreateAssignmentModal from "./CreateAssignmentModal";
import GradeSubmissionModal from "./GradeSubmissionModal";
import AssignmentDetailsModal from "./AssignmentDetailsModal";

const assignmentsData = [
  {
    id: "a1",
    title: "User Research Report",
    class: "UXD-301",
    className: "Foundations of UX Design",
    dueDate: "2024-04-20",
    dueLabel: "Apr 20",
    submissions: 22,
    totalStudents: 28,
    avgScore: 84,
    maxScore: 100,
    status: "grading",
    type: "Report",
    weight: 20,
    color: "#fbbf24",
  },
  {
    id: "a2",
    title: "Binary Tree Implementation",
    class: "CSE-410",
    className: "Advanced Data Structures",
    dueDate: "2024-04-22",
    dueLabel: "Apr 22",
    submissions: 18,
    totalStudents: 24,
    avgScore: 76,
    maxScore: 100,
    status: "active",
    type: "Code",
    weight: 15,
    color: "#34d399",
  },
  {
    id: "a3",
    title: "Usability Heuristic Evaluation",
    class: "HCI-220",
    className: "Human-Computer Interaction",
    dueDate: "2024-04-18",
    dueLabel: "Apr 18",
    submissions: 21,
    totalStudents: 21,
    avgScore: 88,
    maxScore: 100,
    status: "closed",
    type: "Analysis",
    weight: 25,
    color: "#a78bfa",
  },
  {
    id: "a4",
    title: "Neural Network From Scratch",
    class: "ML-501",
    className: "Machine Learning Foundations",
    dueDate: "2024-04-25",
    dueLabel: "Apr 25",
    submissions: 12,
    totalStudents: 32,
    avgScore: 71,
    maxScore: 100,
    status: "active",
    type: "Project",
    weight: 30,
    color: "#fb7185",
  },
  {
    id: "a5",
    title: "Wireframe Prototype Submission",
    class: "UXD-301",
    className: "Foundations of UX Design",
    dueDate: "2024-04-15",
    dueLabel: "Apr 15",
    submissions: 28,
    totalStudents: 28,
    avgScore: 91,
    maxScore: 100,
    status: "closed",
    type: "Design",
    weight: 20,
    color: "#fbbf24",
  },
  {
    id: "a6",
    title: "Graph Algorithm Analysis",
    class: "CSE-410",
    className: "Advanced Data Structures",
    dueDate: "2024-04-28",
    dueLabel: "Apr 28",
    submissions: 5,
    totalStudents: 24,
    avgScore: 0,
    maxScore: 100,
    status: "active",
    type: "Written",
    weight: 10,
    color: "#34d399",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: Clock,
  },
  grading: {
    label: "Needs Grading",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: AlertCircle,
  },
  closed: {
    label: "Closed",
    color: "text-zinc-400",
    bg: "bg-zinc-800",
    icon: CheckCircle2,
  },
};

const summaryStats = [
  {
    label: "Total Assignments",
    value: "6",
    sublabel: "Across all classes",
    icon: ClipboardList,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    label: "Needs Grading",
    value: "2",
    sublabel: "6 submissions pending",
    icon: AlertCircle,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    label: "Avg Score",
    value: "82%",
    sublabel: "Class average",
    icon: BarChart3,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    label: "Completion Rate",
    value: "78%",
    sublabel: "Submissions received",
    icon: CheckCircle2,
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
];

export default function TeacherAssignments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [gradeTarget, setGradeTarget] = useState<{ student: string; assignment: string }>({ student: "", assignment: "" });
  const [selectedAssignment, setSelectedAssignment] = useState<typeof assignmentsData[0] | null>(null);

  const filtered = assignmentsData.filter((a) => {
    const matchesSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    const matchesClass = filterClass === "all" || a.class === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const uniqueClasses = [...new Set(assignmentsData.map((a) => a.class))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
            Assignments
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create, manage, and grade assignments across your classes.
          </p>
        </div>
        <button
          onClick={() => setShowCreateAssignment(true)}
          className="flex items-center gap-2 bg-accent-dark hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-dark/20 active:scale-95 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="bg-zinc-900 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-extrabold text-zinc-100 mt-1">
                {stat.value}
              </p>
              <p className="text-[11px] text-zinc-500 font-semibold mt-1">
                {stat.sublabel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-accent-dark/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="appearance-none bg-zinc-900 border border-zinc-800 focus:border-accent-dark/50 rounded-2xl pl-4 pr-10 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all cursor-pointer"
          >
            <option value="all">All Classes</option>
            {uniqueClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-zinc-900 border border-zinc-800 focus:border-accent-dark/50 rounded-2xl pl-4 pr-10 py-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="grading">Needs Grading</option>
            <option value="closed">Closed</option>
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Assignment Cards */}
      <div className="space-y-3">
        {filtered.map((assignment, i) => {
          const st = statusConfig[assignment.status];
          const StatusIcon = st.icon;
          const submissionPercent = Math.round(
            (assignment.submissions / assignment.totalStudents) * 100,
          );

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="bg-zinc-900 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-zinc-800 hover:border-zinc-700 hover:scale-[1.005]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: Title + Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${assignment.color}15`,
                        color: assignment.color,
                      }}
                    >
                      {assignment.type}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {assignment.class}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {st.label}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-100 truncate">
                    {assignment.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due {assignment.dueLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {assignment.submissions}/{assignment.totalStudents}{" "}
                        submitted
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" />
                      <span>Worth {assignment.weight}%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score + Progress + Actions */}
                <div className="flex items-center gap-6 lg:gap-8 shrink-0">
                  {/* Avg Score */}
                  <div className="text-center min-w-[70px]">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Avg Score
                    </p>
                    <p className="text-xl font-extrabold text-zinc-100">
                      {assignment.avgScore > 0 ? `${assignment.avgScore}%` : "—"}
                    </p>
                  </div>

                  {/* Submission Progress */}
                  <div className="min-w-[120px] hidden md:block">
                    <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1">
                      <span>Submissions</span>
                      <span className="text-zinc-300 font-bold">
                        {submissionPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${submissionPercent}%`,
                          backgroundColor: assignment.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {assignment.status === "grading" && (
                      <button
                        onClick={() => {
                          setGradeTarget({ student: "Student", assignment: assignment.title });
                          setShowGradeModal(true);
                        }}
                        className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Grade
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectedAssignment(assignment); setShowDetailsModal(true); }}
                      className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center">
          <ClipboardList className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-400">
            No assignments match your filters
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
      />
      <GradeSubmissionModal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        studentName={gradeTarget.student}
        assignmentTitle={gradeTarget.assignment}
      />
      {selectedAssignment && (
        <AssignmentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          assignment={selectedAssignment}
        />
      )}
    </div>
  );
}
