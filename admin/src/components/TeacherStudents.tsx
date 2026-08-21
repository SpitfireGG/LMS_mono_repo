import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Users,
  TrendingUp,
  AlertTriangle,
  Award,
  Mail,
  Eye,
  Flag,
  GraduationCap,
  ChevronDown,
  BarChart3,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import StudentProfileModal from "./StudentProfileModal";
import MessageStudentModal from "./MessageStudentModal";

const studentsData = [
  {
    id: "s1",
    name: "Aria Chen",
    email: "aria.chen@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuArAou6iI9lCdu2f4jqV8A1B6fJ1kxd3rCFvxYA_q0ONX0TiF4pVxUKb13jEyIUrPbYeD9lzsnGKJRAz-_UbAFbhtOo7FDcQrnC_3rKqYgWEehvjSyPGzSTpXse_-fCoVzHicTXuZJBiEkkVyAX7uE8jBPBIQZrT3WRfBGOCONJArYFLv5ej7tN8zmcaUPfTNNJu8FW7abqhYCUbTllxZr0xO8ySVdLQZ4oQQO9XDM-JzE2haJsoV1H2UISH4M6wrpvzVNX86LiK9QP",
    class: "UXD-301",
    className: "Foundations of UX Design",
    grade: "A",
    gradePoint: 4.0,
    attendance: 96,
    completion: 91,
    trend: "up" as const,
    trendChange: "+3%",
    lastActive: "1 hour ago",
    status: "top",
    submissions: 14,
    flagged: false,
  },
  {
    id: "s2",
    name: "Marcus Webb",
    email: "m.webb@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wiUMgAcDJ5c0atnSB9RPDTqO1CXLCAqQRd3VvrjWenTBXQC_fHQjF3IvOvJRLJ2QP8_DtX31K_CTIB77fjbdA8ngNhTIX5lVzX5lsyxM2wC3xPAXrz79MI6tI-JSrFtoTn6S6vXqUUweDvoWsRPLVapMkOtcSznkbTJfBpN7LBf2PKd3Sj8M3DsNDKLUy_wr-HMmuWeVQAvd_k_cDZF0b3tQxIdv4mtB23Fmz1hQ40AdbaIVIRoryHi4UrliyoWGahflP8q3scAy",
    class: "CSE-410",
    className: "Advanced Data Structures",
    grade: "B+",
    gradePoint: 3.3,
    attendance: 88,
    completion: 78,
    trend: "up" as const,
    trendChange: "+5%",
    lastActive: "3 hours ago",
    status: "good",
    submissions: 10,
    flagged: false,
  },
  {
    id: "s3",
    name: "Zara Patel",
    email: "zara.p@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2Qynzb_neWgAeaqMrgFJql_TZNKvXwkFhTx1hiC1RFuuU-wJMY9NHuH6iUprKT01gzn5-2u_A0MQJTUWpKJcvc8Fvi0yrhs8Irf-lsW8nyTAcBLl5MYVdnZNSF2VU1yswkOqdyc-EQ_IFELEN854ZcYRRKr1p94ucJjqfkmJp4npzI5k9cMfAlEjleCpPyJ_PQNlxSGJKOMkU16fyo6gIoA1XVV57DAB_8wdt_QH6JJfFmC9dwEcAdgtjR55k66H_XOqLPQVoIeq8",
    class: "HCI-220",
    className: "Human-Computer Interaction",
    grade: "A-",
    gradePoint: 3.7,
    attendance: 92,
    completion: 85,
    trend: "up" as const,
    trendChange: "+2%",
    lastActive: "5 hours ago",
    status: "top",
    submissions: 12,
    flagged: false,
  },
  {
    id: "s4",
    name: "Jake Morrison",
    email: "j.morrison@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfOIhq8gsjqeXnKONXxJQf0uqdpDnR-7RQk7Se4TyLRBRCkRLH-LuG-dEmDkiI59_FCytg6g1jMN0Xfrm8sWW_Snd7XCQ5stPc_QFAdHvag_K0WfekEkOmtGIohiDUh-AddThdO0ndM8_TdzYbOZklrJlfMZYAzYmeLtKy4RZddyQQqIIb8F90U0zncxWEeZseFGAp09YOgyyrnH8mWCFN8mwsaMX80drlP-8Uqqmmke9afabympzSFkBPltGjpBQJ91rjL6yhQacA",
    class: "UXD-301",
    className: "Foundations of UX Design",
    grade: "C+",
    gradePoint: 2.3,
    attendance: 68,
    completion: 52,
    trend: "down" as const,
    trendChange: "-4%",
    lastActive: "2 days ago",
    status: "at-risk",
    submissions: 8,
    flagged: true,
  },
  {
    id: "s5",
    name: "Lily Tanaka",
    email: "lily.t@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUiBGc3Ye2QZqcfzgSUoAFn_3RNi8bTEAq5HTUGLbcRfdiHAKNWppXE0AW_L_98ZRwglrMkwC41an4CKThqr7D9MzpFzpb9OD7hDNa44mt3Tzlng4RBHHzoTNiSbFR8wb644UU68zqrmBG3pzBKV9DxMfHFLtPU4s7-KsGCkKRrVve_zPL8PdhjYefCXxH_yQ85G5Cq5-vAJeYq5ImfkV88cwM_pQGLrsxeZSFDN_CPPTaZpToUuot1jIk3Qqaieo9kIHrUMbBrCLl",
    class: "ML-501",
    className: "Machine Learning Foundations",
    grade: "B",
    gradePoint: 3.0,
    attendance: 85,
    completion: 70,
    trend: "up" as const,
    trendChange: "+7%",
    lastActive: "12 hours ago",
    status: "good",
    submissions: 11,
    flagged: false,
  },
  {
    id: "s6",
    name: "Omar Hassan",
    email: "omar.h@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBekJBSw02_p-Jtdl0AolcUNZ2R2ogtcR4ZUMFuQo4ddz9JQllhotQF_hTyVujIba0H5QUAuMwXpQvd4tdYDIsQRukY9h3CSZjASKDmNfE26Y34FLxpGJXbWEAv4LgPqTnLBI0MetRfRydnc0VqlavazHGcAEl5hnBXfXcK_a_r3dwJbSsLhgJhrwp0D1NA913Nf1fKPqCwMHVsujvGpSw_IR-pyq5rzRw8FxorqleyayYGk8CwhvbSgRiLvOYCdCd82ktUYaEKynf8",
    class: "CSE-410",
    className: "Advanced Data Structures",
    grade: "A",
    gradePoint: 4.0,
    attendance: 98,
    completion: 95,
    trend: "up" as const,
    trendChange: "+1%",
    lastActive: "30 min ago",
    status: "top",
    submissions: 14,
    flagged: false,
  },
  {
    id: "s7",
    name: "Nina Volkov",
    email: "nina.v@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuArAou6iI9lCdu2f4jqV8A1B6fJ1kxd3rCFvxYA_q0ONX0TiF4pVxUKb13jEyIUrPbYeD9lzsnGKJRAz-_UbAFbhtOo7FDcQrnC_3rKqYgWEehvjSyPGzSTpXse_-fCoVzHicTXuZJBiEkkVyAX7uE8jBPBIQZrT3WRfBGOCONJArYFLv5ej7tN8zmcaUPfTNNJu8FW7abqhYCUbTllxZr0xO8ySVdLQZ4oQQO9XDM-JzE2haJsoV1H2UISH4M6wrpvzVNX86LiK9QP",
    class: "HCI-220",
    className: "Human-Computer Interaction",
    grade: "B-",
    gradePoint: 2.7,
    attendance: 74,
    completion: 60,
    trend: "down" as const,
    trendChange: "-2%",
    lastActive: "1 day ago",
    status: "at-risk",
    submissions: 9,
    flagged: true,
  },
  {
    id: "s8",
    name: "Ethan Park",
    email: "ethan.p@naati.edu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wiUMgAcDJ5c0atnSB9RPDTqO1CXLCAqQRd3VvrjWenTBXQC_fHQjF3IvOvJRLJ2QP8_DtX31K_CTIB77fjbdA8ngNhTIX5lVzX5lsyxM2wC3xPAXrz79MI6tI-JSrFtoTn6S6vXqUUweDvoWsRPLVapMkOtcSznkbTJfBpN7LBf2PKd3Sj8M3DsNDKLUy_wr-HMmuWeVQAvd_k_cDZF0b3tQxIdv4mtB23Fmz1hQ40AdbaIVIRoryHi4UrliyoWGahflP8q3scAy",
    class: "ML-501",
    className: "Machine Learning Foundations",
    grade: "A-",
    gradePoint: 3.7,
    attendance: 94,
    completion: 88,
    trend: "up" as const,
    trendChange: "+4%",
    lastActive: "2 hours ago",
    status: "top",
    submissions: 13,
    flagged: false,
  },
];

const statusConfig = {
  top: {
    label: "Top Performer",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  good: {
    label: "On Track",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  "at-risk": {
    label: "At Risk",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
};

const summaryStats = [
  {
    label: "Total Students",
    value: "105",
    sublabel: "Across 4 classes",
    icon: Users,
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    label: "Top Performers",
    value: "38",
    sublabel: "36% of total",
    icon: Award,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    label: "At Risk",
    value: "12",
    sublabel: "Need attention",
    icon: AlertTriangle,
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
  },
  {
    label: "Avg Attendance",
    value: "87%",
    sublabel: "+2% vs last month",
    icon: TrendingUp,
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
];

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showProfile, setShowProfile] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<(typeof studentsData)[number] | null>(null);

  const filtered = studentsData.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || s.class === filterClass;
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const uniqueClasses = [...new Set(studentsData.map((s) => s.class))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
            Students
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage students across all your classes.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-accent-dark hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-dark/20 active:scale-95 text-sm cursor-pointer">
          <Mail className="w-4 h-4" />
          Message All At-Risk
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
            placeholder="Search by name or email..."
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
            <option value="top">Top Performers</option>
            <option value="good">On Track</option>
            <option value="at-risk">At Risk</option>
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Student Roster */}
      <div className="space-y-3">
        {filtered.map((student, i) => {
          const st = statusConfig[student.status];
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={`bg-zinc-900 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border ${st.border} hover:scale-[1.005]`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Avatar + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-800"
                    />
                    {student.flagged && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                        <Flag className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-zinc-100 truncate">
                        {student.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}
                      >
                        {st.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate">
                      {student.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                        {student.class}
                      </span>
                      <span className="text-[10px] text-zinc-500 truncate">
                        {student.className}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 lg:gap-8">
                  {/* Grade */}
                  <div className="text-center min-w-[60px]">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Grade
                    </p>
                    <p className="text-xl font-extrabold text-zinc-100">
                      {student.grade}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-mono">
                      GPA {student.gradePoint.toFixed(1)}
                    </p>
                  </div>

                  {/* Attendance */}
                  <div className="text-center min-w-[60px]">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Attend
                    </p>
                    <p className="text-xl font-extrabold text-zinc-100">
                      {student.attendance}%
                    </p>
                  </div>

                  {/* Completion */}
                  <div className="text-center min-w-[70px]">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Progress
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-xl font-extrabold text-zinc-100">
                        {student.completion}%
                      </p>
                      {student.trend === "up" ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                    <p
                      className={`text-[10px] font-bold ${
                        student.trend === "up"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {student.trendChange}
                    </p>
                  </div>

                  {/* Last Active */}
                  <div className="text-center min-w-[80px] hidden md:block">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Last Active
                    </p>
                    <p className="text-xs text-zinc-400 font-semibold mt-1">
                      {student.lastActive}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-mono">
                      {student.submissions} submissions
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setSelectedStudent(student); setShowProfile(true); }}
                    className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setSelectedStudent(student); setShowMessage(true); }}
                    className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Send Message"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  {student.flagged && (
                    <button
                      className="w-9 h-9 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl transition-all cursor-pointer"
                      title="Review Flag"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center">
          <GraduationCap className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-400">
            No students match your filters
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {selectedStudent && (
        <>
          <StudentProfileModal
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            student={selectedStudent}
          />
          <MessageStudentModal
            isOpen={showMessage}
            onClose={() => setShowMessage(false)}
            studentName={selectedStudent.name}
            studentEmail={selectedStudent.email}
          />
        </>
      )}
    </div>
  );
}
