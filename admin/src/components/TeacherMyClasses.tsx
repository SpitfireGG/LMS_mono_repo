import { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  TrendingUp,
  BookOpen,
  Clock,
  Search,
  ChevronRight,
  BarChart3,
  FileText,
  Calendar,
  Plus,
  ArrowUpRight,
  Star,
  Settings,
  Eye,
  GraduationCap,
} from "lucide-react";
import CreateClassModal from "./CreateClassModal";
import ClassStudentsModal from "./ClassStudentsModal";
import ClassAnalyticsModal from "./ClassAnalyticsModal";

const classesData = [
  {
    id: "ux-design",
    name: "Foundations of UX Design",
    code: "UXD-301",
    students: 28,
    maxStudents: 35,
    avgGrade: "B+",
    avgGradePoint: 3.3,
    completion: 82,
    trend: "+4%",
    trendUp: true,
    sessionsTotal: 16,
    sessionsCompleted: 13,
    pendingSubmissions: 6,
    lastActive: "2 hours ago",
    nextSession: "Today, 2:00 PM",
    gradient: "from-accent/20 via-accent-darker/10 to-zinc-900",
    accentBorder: "border-accent/20",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    category: "Intermediate",
    color: "#fbbf24",
  },
  {
    id: "data-structures",
    name: "Advanced Data Structures",
    code: "CSE-410",
    students: 24,
    maxStudents: 30,
    avgGrade: "B",
    avgGradePoint: 3.0,
    completion: 71,
    trend: "+2%",
    trendUp: true,
    sessionsTotal: 14,
    sessionsCompleted: 10,
    pendingSubmissions: 3,
    lastActive: "Yesterday",
    nextSession: "Tomorrow, 9:00 AM",
    gradient: "from-emerald-500/20 via-emerald-900/10 to-zinc-900",
    accentBorder: "border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    category: "Advanced",
    color: "#34d399",
  },
  {
    id: "hci",
    name: "Human-Computer Interaction",
    code: "HCI-220",
    students: 21,
    maxStudents: 25,
    avgGrade: "A-",
    avgGradePoint: 3.7,
    completion: 68,
    trend: "+6%",
    trendUp: true,
    sessionsTotal: 12,
    sessionsCompleted: 8,
    pendingSubmissions: 5,
    lastActive: "3 hours ago",
    nextSession: "Wed, 11:00 AM",
    gradient: "from-violet-500/20 via-violet-900/10 to-zinc-900",
    accentBorder: "border-violet-500/20",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    category: "Intermediate",
    color: "#a78bfa",
  },
  {
    id: "ml-foundations",
    name: "Machine Learning Foundations",
    code: "ML-501",
    students: 32,
    maxStudents: 40,
    avgGrade: "B+",
    avgGradePoint: 3.4,
    completion: 55,
    trend: "+8%",
    trendUp: true,
    sessionsTotal: 20,
    sessionsCompleted: 11,
    pendingSubmissions: 8,
    lastActive: "1 day ago",
    nextSession: "Thu, 3:00 PM",
    gradient: "from-rose-500/20 via-rose-900/10 to-zinc-900",
    accentBorder: "border-rose-500/20",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    category: "Advanced",
    color: "#fb7185",
  },
];

const summaryStats = [
  {
    label: "Total Classes",
    value: "4",
    sublabel: "Active this semester",
    icon: BookOpen,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    label: "Total Students",
    value: "105",
    sublabel: "+14 this month",
    icon: Users,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    label: "Avg Completion",
    value: "69%",
    sublabel: "Across all classes",
    icon: TrendingUp,
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
  {
    label: "Pending Reviews",
    value: "22",
    sublabel: "14 urgent",
    icon: Clock,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
];

export default function TeacherMyClasses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showClassStudents, setShowClassStudents] = useState(false);
  const [showClassAnalytics, setShowClassAnalytics] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{ name: string; code: string; students: number; completion: number; avgGrade: string }>({ name: "", code: "", students: 0, completion: 0, avgGrade: "" });

  const filteredClasses = classesData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
            My Classes
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your courses, track student progress, and review submissions.
          </p>
        </div>
        <button
          onClick={() => setShowCreateClass(true)}
          className="flex items-center gap-2 bg-accent-dark hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-dark/20 active:scale-95 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Class
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search classes by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-accent-dark/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all"
        />
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredClasses.map((cls, i) => {
          const seatPercent = Math.round(
            (cls.students / cls.maxStudents) * 100,
          );

          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              onMouseEnter={() => setHoveredCard(cls.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border ${cls.accentBorder} group cursor-pointer ${
                hoveredCard === cls.id ? "scale-[1.015]" : "scale-100"
              }`}
            >
              {/* Card Header Gradient */}
              <div
                className={`bg-gradient-to-r ${cls.gradient} px-6 py-5 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.06),transparent_60%)]" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-md">
                        {cls.code}
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${cls.color}15`,
                          color: cls.color,
                        }}
                      >
                        {cls.category}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-zinc-100 leading-tight group-hover:text-white transition-colors">
                      {cls.name}
                    </h3>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${cls.iconBg} ${cls.iconColor} flex items-center justify-center shrink-0`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-5 space-y-5">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Students
                    </p>
                    <p className="text-lg font-extrabold text-zinc-100 mt-0.5">
                      {cls.students}
                    </p>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${seatPercent}%`,
                          backgroundColor: cls.color,
                        }}
                      />
                    </div>
                    <p className="text-[9px] text-zinc-500 font-mono mt-1">
                      {cls.students}/{cls.maxStudents} seats
                    </p>
                  </div>
                  <div className="text-center border-x border-zinc-800">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Avg Grade
                    </p>
                    <p className="text-lg font-extrabold text-zinc-100 mt-0.5">
                      {cls.avgGrade}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-mono mt-1">
                      GPA {cls.avgGradePoint.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Completion
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <p className="text-lg font-extrabold text-zinc-100">
                        {cls.completion}%
                      </p>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {cls.trend}
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-500 font-mono mt-1">
                      {cls.sessionsCompleted}/{cls.sessionsTotal} sessions
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                    <span>Course Progress</span>
                    <span className="text-zinc-300 font-bold">
                      {cls.completion}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cls.completion}%`,
                        backgroundColor: cls.color,
                      }}
                    />
                  </div>
                </div>

                {/* Info Row */}
                <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{cls.nextSession}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Active {cls.lastActive}</span>
                  </div>
                  {cls.pendingSubmissions > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      <FileText className="w-3 h-3" />
                      <span>{cls.pendingSubmissions} to grade</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedClass({ name: cls.name, code: cls.code, students: cls.students, completion: cls.completion, avgGrade: cls.avgGrade });
                      setShowClassStudents(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Students
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClass({ name: cls.name, code: cls.code, students: cls.students, completion: cls.completion, avgGrade: cls.avgGrade });
                      setShowClassAnalytics(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Analytics
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center">
          <GraduationCap className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-400">
            No classes match your search
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Try a different name or course code
          </p>
        </div>
      )}

      <CreateClassModal
        isOpen={showCreateClass}
        onClose={() => setShowCreateClass(false)}
      />
      <ClassStudentsModal
        isOpen={showClassStudents}
        onClose={() => setShowClassStudents(false)}
        className={selectedClass.name}
        classCode={selectedClass.code}
      />
      <ClassAnalyticsModal
        isOpen={showClassAnalytics}
        onClose={() => setShowClassAnalytics(false)}
        className={selectedClass.name}
        classCode={selectedClass.code}
        students={selectedClass.students}
        completion={selectedClass.completion}
        avgGrade={selectedClass.avgGrade}
      />
    </div>
  );
}
