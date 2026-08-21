import { motion } from "motion/react";
import {
  Users,
  TrendingUp,
  Clock,
  BookOpen,
  ArrowUpRight,
  BarChart3,
  Calendar,
  FileText,
  ChevronRight,
  Crown,
  Plus,
  Target,
  Award,
  MessageSquare,
} from "lucide-react";

const metricCards = [
  {
    label: "Total Students",
    value: "73",
    change: "+8 this week",
    icon: Users,
    color: "from-accent to-accent-dark",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    trend: "up" as const,
  },
  {
    label: "Avg Completion",
    value: "74%",
    change: "+3.2% vs last month",
    icon: Target,
    color: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    trend: "up" as const,
  },
  {
    label: "Pending Reviews",
    value: "14",
    change: "6 urgent",
    icon: Clock,
    color: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    trend: "down" as const,
  },
  {
    label: "Active Courses",
    value: "3",
    change: "1 new this semester",
    icon: BookOpen,
    color: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    trend: "up" as const,
  },
];

const classes = [
  {
    name: "Foundations of UX Design",
    students: 28,
    avgGrade: "B+",
    completion: 82,
    trend: "+4%",
    gradient: "from-accent/20 via-accent-darker/10 to-zinc-900",
    accentBorder: "border-accent/20",
  },
  {
    name: "Advanced Data Structures",
    students: 24,
    avgGrade: "B",
    completion: 71,
    trend: "+2%",
    gradient: "from-emerald-500/20 via-emerald-900/10 to-zinc-900",
    accentBorder: "border-emerald-500/20",
  },
  {
    name: "Human-Computer Interaction",
    students: 21,
    avgGrade: "A-",
    completion: 68,
    trend: "+6%",
    gradient: "from-violet-500/20 via-violet-900/10 to-zinc-900",
    accentBorder: "border-violet-500/20",
  },
];

const gradeDistribution = [
  { grade: "A", percent: 42, color: "bg-emerald-500" },
  { grade: "B", percent: 36, color: "bg-accent" },
  { grade: "C", percent: 15, color: "bg-amber-500" },
  { grade: "D/F", percent: 7, color: "bg-rose-500" },
];

const weeklyEngagement = [
  { day: "Mon", submissions: 18 },
  { day: "Tue", submissions: 24 },
  { day: "Wed", submissions: 15 },
  { day: "Thu", submissions: 30 },
  { day: "Fri", submissions: 22 },
  { day: "Sat", submissions: 8 },
  { day: "Sun", submissions: 5 },
];

const recentActivity = [
  {
    avatar: "AJ",
    name: "Alex Johnson",
    action: "Submitted Assignment 3",
    course: "UX Design",
    time: "12 min ago",
    color: "bg-accent/20 text-accent",
  },
  {
    avatar: "MR",
    name: "Maria Rodriguez",
    action: "Scored 94% on Quiz 5",
    course: "Data Structures",
    time: "28 min ago",
    color: "bg-emerald-500/20 text-emerald-400",
  },
  {
    avatar: "DK",
    name: "David Kim",
    action: "Posted in Discussion Forum",
    course: "HCI",
    time: "1 hr ago",
    color: "bg-violet-500/20 text-violet-400",
  },
  {
    avatar: "SP",
    name: "Sarah Park",
    action: "Requested grade review",
    course: "UX Design",
    time: "2 hrs ago",
    color: "bg-amber-500/20 text-amber-400",
  },
  {
    avatar: "JL",
    name: "James Lee",
    action: "Completed Module 4 quiz",
    course: "Data Structures",
    time: "3 hrs ago",
    color: "bg-rose-500/20 text-rose-400",
  },
];

const upcomingSessions = [
  {
    title: "UX Design — Live Critique",
    time: "Today, 2:00 PM",
    duration: "90 min",
    live: true,
    students: 28,
  },
  {
    title: "Data Structures — Lab Session",
    time: "Tomorrow, 10:00 AM",
    duration: "60 min",
    live: false,
    students: 24,
  },
  {
    title: "HCI — Guest Lecture",
    time: "Wed, 3:30 PM",
    duration: "120 min",
    live: false,
    students: 21,
  },
];

const maxSubmissions = Math.max(...weeklyEngagement.map((d) => d.submissions));

export default function TeacherHome() {
  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Hero Section */}
      <section className="bg-zinc-900 rounded-2xl p-8 text-zinc-100 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-darker/50 via-zinc-950/80 to-zinc-950 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--color-accent-dark),0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,var(--color-accent-darker),0.12),transparent_50%)]" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-lg text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[10px] font-bold uppercase tracking-widest">
                <Crown className="w-3 h-3" />
                Instructor Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 leading-tight">
              Welcome back, Prof. Sarah Jenkins
            </h1>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed font-normal">
              You have{" "}
              <span className="text-amber-400 font-bold">14 assignments</span>{" "}
              awaiting review and{" "}
              <span className="text-emerald-400 font-bold">
                2 live sessions
              </span>{" "}
              scheduled this week.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button className="flex items-center gap-2 bg-accent-dark hover:bg-accent text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-dark/25 active:scale-95 text-sm cursor-pointer">
                <Plus className="w-4 h-4" />
                New Assignment
              </button>
              <button className="flex items-center gap-2 bg-zinc-950/60 backdrop-blur-md border border-zinc-700/50 hover:border-accent/40 text-zinc-200 px-5 py-2.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-accent-dark/10 active:scale-95 text-sm cursor-pointer">
                <Calendar className="w-4 h-4" />
                Schedule Session
              </button>
            </div>
          </div>

          <div className="bg-zinc-950/60 backdrop-blur-md p-5 rounded-xl flex flex-col min-w-[200px] text-left border border-zinc-800/50">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
              This Week
            </span>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-semibold">
                  Sessions
                </span>
                <span className="text-sm font-extrabold text-zinc-100">
                  4 / 5
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-semibold">
                  Graded
                </span>
                <span className="text-sm font-extrabold text-zinc-100">
                  59 / 73
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "80.8%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-zinc-900 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-zinc-800/50 cursor-default group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}
              >
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span
                className={`flex items-center gap-1 text-[11px] font-bold ${
                  card.trend === "up" ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                <ArrowUpRight
                  className={`w-3 h-3 ${
                    card.trend === "down" ? "rotate-90" : ""
                  }`}
                />
                {card.change}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-3xl font-extrabold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
              {card.value}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Class Cards */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-extrabold text-lg text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Active Classes
          </h2>
          <button className="text-xs font-bold text-accent hover:text-accent-light transition-colors flex items-center gap-1 cursor-pointer">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.3 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.02, y: -3 }}
              className={`bg-gradient-to-br ${cls.gradient} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border ${cls.accentBorder} cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-extrabold text-base text-zinc-100 leading-snug group-hover:text-white transition-colors">
                    {cls.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-400">
                      <Users className="w-3 h-3" />
                      {cls.students} students
                    </span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      {cls.trend}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-zinc-950/60 backdrop-blur flex items-center justify-center">
                  <Award className="w-5 h-5 text-zinc-400 group-hover:text-accent transition-colors" />
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      Avg Grade
                    </span>
                    <span className="text-sm font-extrabold text-zinc-100">
                      {cls.avgGrade}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      Completion
                    </span>
                    <span className="text-sm font-extrabold text-zinc-100">
                      {cls.completion}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-950/60 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cls.completion}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.5 + i * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="bg-accent h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/50"
        >
          <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            Grade Distribution
          </h3>
          <div className="space-y-4">
            {gradeDistribution.map((item, i) => (
              <div key={item.grade} className="flex items-center gap-4">
                <span className="text-sm font-extrabold text-zinc-300 w-8 text-right font-mono">
                  {item.grade}
                </span>
                <div className="flex-1 bg-zinc-950/60 h-8 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.6 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`${item.color} h-full rounded-lg flex items-center justify-end pr-3`}
                  >
                    <span className="text-[11px] font-bold text-white/90">
                      {item.percent}%
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-bold">
              Based on 73 graded submissions
            </span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />+5% from last semester
            </span>
          </div>
        </motion.div>

        {/* Weekly Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/50"
        >
          <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            Weekly Engagement
          </h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyEngagement.map((day, i) => {
              const heightPct = (day.submissions / maxSubmissions) * 100;
              return (
                <div
                  key={day.day}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <span className="text-[10px] font-bold text-zinc-400 font-mono">
                    {day.submissions}
                  </span>
                  <div className="w-full h-36 bg-zinc-950/60 rounded-lg overflow-hidden flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.7 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`w-full rounded-lg ${
                        day.day === "Thu"
                          ? "bg-accent"
                          : day.day === "Sun" || day.day === "Sat"
                            ? "bg-zinc-700"
                            : "bg-accent-dark"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-500">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-bold">
              Total: 122 submissions this week
            </span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +18% vs last week
            </span>
          </div>
        </motion.div>
      </div>

      {/* Activity & Sessions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="lg:col-span-3 bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              Recent Student Activity
            </h3>
            <button className="text-[11px] font-bold text-accent hover:text-accent-light transition-colors flex items-center gap-1 cursor-pointer">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <motion.div
                key={item.name + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.06 }}
                className="flex items-center gap-3 group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-[11px] font-extrabold shrink-0`}
                >
                  {item.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-200 leading-tight truncate group-hover:text-white transition-colors">
                    {item.name}{" "}
                    <span className="text-zinc-500 font-normal">
                      {item.action}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-zinc-600">
                      {item.course}
                    </span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-[10px] font-bold text-zinc-600 font-mono">
                      {item.time}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-accent transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-2 bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800/50"
        >
          <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Upcoming Sessions
          </h3>

          <div className="space-y-4">
            {upcomingSessions.map((session, i) => (
              <motion.div
                key={session.title + i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.08 }}
                className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800/40 hover:border-accent/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xs font-bold text-zinc-200 leading-snug group-hover:text-white transition-colors pr-2">
                    {session.title}
                  </h4>
                  {session.live && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold uppercase tracking-wider shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {session.time}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-[11px] font-bold text-zinc-500">
                    {session.duration}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Users className="w-3 h-3 text-zinc-600" />
                  <span className="text-[10px] font-bold text-zinc-600">
                    {session.students} enrolled
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 flex items-center justify-center gap-2 bg-zinc-950/40 border border-zinc-800/40 hover:border-accent/30 text-zinc-400 hover:text-accent py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer">
            <FileText className="w-3.5 h-3.5" />
            View Full Schedule
          </button>
        </motion.div>
      </div>
    </div>
  );
}
