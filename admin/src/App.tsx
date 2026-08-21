import { useState, useEffect } from "react";
import {
  Bell,
  HelpCircle,
  Search,
  GraduationCap,
  LayoutGrid,
  Sparkles,
  BookOpen,
  Clock,
  Award,
  Star,
  ListFilter,
  Sliders,
  Calendar as CalendarIcon,
  FileText,
  Compass,
  MessageSquare,
  LineChart,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Shared Subcomponents
import Sidebar from "./components/Sidebar";
import CourseCard from "./components/CourseCard";
import CalendarWidget from "./components/CalendarWidget";
import ProductivityChart from "./components/ProductivityChart";
import MyCoursesSection from "./components/MyCoursesSection";
import ScheduleView from "./components/ScheduleView";
import AssignmentsView from "./components/AssignmentsView";
import ProgressView from "./components/ProgressView";
import MessagesView from "./components/MessagesView";
import DiscoverView from "./components/DiscoverView";
import SettingsView from "./components/SettingsView";
import InfoView from "./components/InfoView";
import TeacherHome from "./components/TeacherHome";
import TeacherMyClasses from "./components/TeacherMyClasses";
import TeacherStudents from "./components/TeacherStudents";
import TeacherAssignments from "./components/TeacherAssignments";
import TeacherSchedule from "./components/TeacherSchedule";
import MockTestView from "./components/MockTestView";

// Mock Data & Models
import {
  INITIAL_COURSES,
  INITIAL_ACTIVITIES,
  INITIAL_METRICS,
  INITIAL_EVENTS,
  getSeededEventsForMonth,
} from "./data";
import { Course, ActivityItem, Metrics, EventItem, ActiveTab, UserRole } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");

  // Sidebar interactive states
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("skillzone_sidebar_collapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [homeSubTab, setHomeSubTab] = useState<
    "overview" | "live-network" | "todo"
  >("overview");
  const [calendarGlow, setCalendarGlow] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "skillzone_sidebar_collapsed",
      JSON.stringify(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  const triggerCalendarFocus = () => {
    setCalendarGlow(true);
    const el = document.getElementById("calendar-widget-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setCalendarGlow(false);
    }, 2500);
  };

  // Persistence States
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("skillzone_courses");
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem("skillzone_activities");
    if (saved) {
      // Re-hydrate dates
      const parsed = JSON.parse(saved) as any[];
      return parsed.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));
    }
    return INITIAL_ACTIVITIES;
  });

  const [metrics, setMetrics] = useState<Metrics>(() => {
    const saved = localStorage.getItem("skillzone_metrics");
    return saved ? JSON.parse(saved) : INITIAL_METRICS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem("skillzone_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Keep localStorage synched
  useEffect(() => {
    localStorage.setItem("skillzone_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("skillzone_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("skillzone_metrics", JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem("skillzone_events", JSON.stringify(events));
  }, [events]);

  // Event handlers
  const handleToggleBookmark = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, isBookmarked: !c.isBookmarked };
        }
        return c;
      }),
    );
  };

  const handleEnrollCourse = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            progress: 0,
            sessionsCompleted: 0,
            sessionsTotal:
              c.id === "ai-vr" ? 12 : c.id === "photography" ? 24 : 10,
          };
        }
        return c;
      }),
    );

    // Add activity record
    const target = courses.find((c) => c.id === id);
    const activityName = target
      ? `Enrolled in '${target.title.substring(0, 30)}...'`
      : "Enrolled in new module";

    appendActivity(activityName, "start");

    // Update metrics
    setMetrics((m) => ({
      ...m,
      totalStudents: m.totalStudents + 1,
      score: m.score + 50, // Registration bonus points!
    }));
  };

  const handleUnenrollCourse = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          // Stripe out enrollment statistics
          const { progress, sessionsCompleted, sessionsTotal, ...unrested } = c;
          return unrested as Course;
        }
        return c;
      }),
    );

    const target = courses.find((c) => c.id === id);
    const activityName = target
      ? `Withdrew from '${target.title.substring(0, 30)}...'`
      : "Unenrolled module";
    appendActivity(activityName, "comment");

    setMetrics((m) => ({
      ...m,
      totalStudents: Math.max(0, m.totalStudents - 1),
    }));
  };

  const handleCompleteSession = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const currentCompleted = c.sessionsCompleted || 0;
          const total = c.sessionsTotal || 10;
          if (currentCompleted < total) {
            const updatedCompleted = currentCompleted + 1;
            const progressPercent = Math.round(
              (updatedCompleted / total) * 100,
            );
            return {
              ...c,
              sessionsCompleted: updatedCompleted,
              progress: progressPercent,
            };
          }
        }
        return c;
      }),
    );

    const target = courses.find((c) => c.id === courseId);
    if (target) {
      const currentCompleted = target.sessionsCompleted || 0;
      const logName = `Finished Session ${currentCompleted + 1} of '${target.title.substring(0, 32)}...'`;
      appendActivity(logName, "completion");
    }

    // Update statistics
    setMetrics((m) => {
      const newScore = m.score + 15;
      const newHours = m.hoursLearned + 1;
      const newWeeklyProgress = +Math.min(10, m.weeklyProgress + 0.8).toFixed(
        1,
      );
      return {
        ...m,
        score: newScore,
        hoursLearned: newHours,
        weeklyProgress: newWeeklyProgress,
      };
    });
  };

  const handleToggleEventCompletion = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const targetState = !e.completed;

          // Append activity feedback
          appendActivity(
            `${targetState ? "Finished" : "Reopened"} agenda task: ${e.title}`,
            "completion",
          );

          if (targetState) {
            setMetrics((m) => ({
              ...m,
              score: m.score + 10,
              hoursLearned: m.hoursLearned + 0.5,
            }));
          }

          return { ...e, completed: targetState };
        }
        return e;
      }),
    );
  };

  const handleAddEvent = (
    dateString: string,
    title: string,
    type: "session" | "assignment",
  ) => {
    const newEvent: EventItem = {
      id: `ev-user-${Date.now()}`,
      date: dateString,
      title,
      type,
      completed: false,
    };

    setEvents((prev) => [...prev, newEvent]);
    appendActivity(`Scheduled custom agenda item: ${title}`, "comment");
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    appendActivity(
      `Provisioned and launched course: ${newCourse.title.substring(0, 35)}...`,
      "start",
    );
  };

  const appendActivity = (
    title: string,
    type: "achievement" | "completion" | "comment" | "start",
  ) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      title,
      timestamp: new Date(),
      type,
      relativeTime: "Just now",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const isEnrolled = (courseId: string): boolean => {
    const found = courses.find((c) => c.id === courseId);
    return found !== undefined && found.progress !== undefined;
  };

  // Derived arrays
  const enrolledCourses = courses.filter((c) => c.progress !== undefined);
  const expelledCourses = courses.filter((c) => c.progress === undefined);

  // Filter courses by search/category
  const filteredExpelled = expelledCourses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate unread activities or events for notifier bubble
  const pendingAgendaCount = events.filter((e) => !e.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans antialiased text-zinc-100">
      {/* Side Navigation panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // clear modal safely
          setShowAddModuleModal(false);
        }}
        onAddModuleClick={() => {
          setShowAddModuleModal(true);
        }}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        homeSubTab={homeSubTab}
        setHomeSubTab={setHomeSubTab}
        triggerCalendarFocus={triggerCalendarFocus}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Top Navigation Bar */}
      <header
        className={`h-16 fixed top-0 right-0 z-40 bg-zinc-950/60 backdrop-blur-md flex justify-between items-center px-6 shadow-sm transition-all duration-300 ${
          sidebarCollapsed
            ? "w-[calc(100%-72px)] ml-[72px]"
            : "w-[calc(100%-256px)] ml-64"
        }`}
      >
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative group">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search courses, assignments, messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 group-focus-within:border-accent-dark/50 rounded-2xl pl-11 pr-20 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
              <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono font-bold text-zinc-400">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono font-bold text-zinc-400">
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* User Info & Quick Notifications */}
        <div className="flex items-center gap-4 relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4 stroke-[2px]" />
              {pendingAgendaCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 bg-zinc-900 rounded-2xl shadow-2xl w-72 p-4 z-50 text-left"
                >
                  <div className="flex justify-between items-center pb-2 mb-2">
                    <span className="text-xs font-extrabold text-zinc-100 uppercase tracking-wider">
                      Unfinished Tasks
                    </span>
                    <span className="text-xs bg-accent-dark/10 text-accent font-bold px-1.5 py-0.5 rounded-full">
                      {pendingAgendaCount} remaining
                    </span>
                  </div>
                  {pendingAgendaCount === 0 ? (
                    <p className="text-xs italic text-zinc-500 text-center py-4">
                      All core targets finished today!
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {events
                        .filter((e) => !e.completed)
                        .map((e) => (
                          <div
                            key={e.id}
                            className="p-2 bg-zinc-950 hover:bg-zinc-900 rounded-lg text-[11px] transition-colors"
                          >
                            <p className="font-semibold text-zinc-200">
                              {e.title}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Due: {e.date}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() =>
                alert(
                  `Academic help desk: raambasnet.kit@gmail.com linked. Tutors are active Eastern Time.`,
                )
              }
              className="p-2.5 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 stroke-[2px]" />
            </button>
          </div>

          <div className="h-6 w-px bg-zinc-800" />

          {/* User Profile display */}
          <button
            onClick={() =>
              alert(
                `Active Session User:\nName: Robert Dorwart\nTier: Enterprise Administrator\nEmail: raambasnet.kit@gmail.com`,
              )
            }
            className="flex items-center gap-3 hover:bg-zinc-900/50 p-1 pr-3 rounded-full transition-all cursor-pointer"
          >
            <img
              alt="Robert Dorwart"
              className="w-8 h-8 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArAou6iI9lCdu2f4jqV8A1B6fJ1kxd3rCFvxYA_q0ONX0TiF4pVxUKb13jEyIUrPbYeD9lzsnGKJRAz-_UbAFbhtOo7FDcQrnC_3rKqYgWEehvjSyPGzSTpXse_-fCoVzHicTXuZJBiEkkVyAX7uE8jBPBIQZrT3WRfBGOCONJArYFLv5ej7tN8zmcaUPfTNNJu8FW7abqhYCUbTllxZr0xO8ySVdLQZ4oQQO9XDM-JzE2haJsoV1H2UISH4M6wrpvzVNX86LiK9QP"
            />
            <div className="hidden sm:block text-left text-xs leading-none">
              <span className="font-bold text-zinc-200 block mb-0.5">
                Robert Dorwart
              </span>
              <span className="text-xs text-zinc-500 block font-semibold uppercase">
                raambasnet.kit
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Container Content */}
      <main
        className={`pt-24 px-6 pb-12 min-h-screen text-left transition-all duration-300 ${
          sidebarCollapsed
            ? "ml-[72px] w-[calc(100%-72px)]"
            : "ml-64 w-[calc(100%-256px)]"
        }`}
      >
        {/* Navigation router of our tabs */}
        <AnimatePresence mode="wait">
          {activeTab === "home" && userRole === "student" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-6"
            >
              {/* Left Column (Main study board) */}
              <div className="xl:col-span-8 flex flex-col gap-8">
                {/* Up Next / Hero section */}
                <section className="bg-zinc-900 rounded-2xl p-8 text-zinc-100 relative overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-darker/40 via-zinc-950/80 to-zinc-950 opacity-90 animate-gradient" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,var(--color-accent-dark),0.15),transparent_60%)]" />

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="max-w-md text-left">
                      <span className="text-emerald-400 text-xs uppercase font-mono tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded font-bold">
                        Live in 14:32
                      </span>
                      <h1 className="text-2xl font-extrabold tracking-tight mt-4 text-zinc-100 leading-tight">
                        Foundations of UX Design
                      </h1>
                      <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed font-normal">
                        Module 4: Wireframing & Prototyping. Hosted by Prof.
                        Sarah Jenkins.
                      </p>
                      <button className="mt-6 flex items-center gap-2 bg-accent-dark hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-dark/20 active:scale-95 text-sm">
                        <Video className="w-4 h-4" />
                        Join on Teams
                      </button>
                    </div>

                    {/* Progress Slider capsule */}
                    <div className="bg-zinc-950/60 backdrop-blur-md p-5 rounded-xl flex flex-col min-w-[220px] text-left">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Weekly Study Progress
                      </span>
                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="text-3xl font-extrabold tracking-tight text-white">
                          {metrics.weeklyProgress}
                        </span>
                        <span className="text-xs text-zinc-500">
                          / {metrics.weeklyGoal} hours
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden mb-4">
                        <div
                          className="bg-accent-dark h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (metrics.weeklyProgress / metrics.weeklyGoal) * 100)}%`,
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setMetrics((m) => {
                            const prog = +Math.min(
                              12,
                              m.weeklyProgress + 0.8,
                            ).toFixed(1);
                            const h = m.hoursLearned + 1;
                            const newScore = m.score + 25;
                            return {
                              ...m,
                              weeklyProgress: prog,
                              hoursLearned: h,
                              score: newScore,
                            };
                          });
                          appendActivity(
                            "Studied custom workspace materials for +1 hour.",
                            "completion",
                          );
                        }}
                        className="bg-accent-dark hover:bg-accent-dark text-white text-xs font-bold py-2 rounded-lg transition-all block text-center cursor-pointer shadow-lg shadow-accent-dark/20"
                      >
                        ⚡ Log 1 hr study today
                      </button>
                    </div>
                  </div>
                </section>

                {/* My active enrolled courses list */}
                <MyCoursesSection
                  enrolledCourses={enrolledCourses}
                  completedSession={handleCompleteSession}
                  onViewAllClick={() => setSelectedCategory("All")}
                />
              </div>

              {/* Right Column (Sidebar metrics, calendars & charts) */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                {/* Today's Agenda Header */}
                <div className="text-left mt-2 relative">
                  <h2 className="font-extrabold text-xl text-zinc-100 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-accent" />
                    Today's Agenda & Due Soon
                  </h2>
                  <p className="text-xs text-zinc-400 font-semibold tracking-wide uppercase mt-1">
                    April 5, 2024
                  </p>
                </div>

                {/* Calendar Widget */}
                <div
                  id="calendar-widget-section"
                  className={`transition-all duration-500 rounded-2xl ${
                    calendarGlow
                      ? "ring-[3px] ring-accent-dark bg-accent-dark/5 shadow-xl shadow-accent-dark/10 scale-[1.01]"
                      : ""
                  }`}
                >
                  <CalendarWidget
                    events={events}
                    toggleEventCompletion={handleToggleEventCompletion}
                    addEvent={handleAddEvent}
                  />
                </div>

                {/* Personal Analytics */}
                <section>
                  <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-3">
                    Personal Analytics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900 rounded-2xl p-4 flex flex-col gap-1 shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02]">
                      <div className="w-8 h-8 rounded-full bg-accent-dark/10 text-accent flex items-center justify-center mb-1">
                        <LineChart className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                        Attendance Rate
                      </span>
                      <div className="flex items-end justify-between mt-1">
                        <span className="font-extrabold text-lg leading-none text-zinc-100">
                          85%
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          ▲ +2%
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4 flex flex-col gap-1 shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02]">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                        Completion Velocity
                      </span>
                      <div className="flex items-end justify-between mt-1">
                        <span className="font-extrabold text-lg leading-none text-zinc-100">
                          12/15
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          On track
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4 flex flex-col gap-1 shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02]">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1">
                        <Star className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                        Grade Trend
                      </span>
                      <div className="flex items-end justify-between mt-1">
                        <span className="font-extrabold text-lg leading-none text-zinc-100">
                          A-
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          Stable
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-4 flex flex-col gap-1 shadow-md hover:shadow-lg transition-all scale-100 hover:scale-[1.02]">
                      <div className="w-8 h-8 rounded-full bg-accent-dark/10 text-accent flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                        Total Hours
                      </span>
                      <div className="flex items-end justify-between mt-1">
                        <span className="font-extrabold text-lg leading-none text-zinc-100">
                          {metrics.hoursLearned}h
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          ▲ +12h
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Productivity Chart widget */}
                <ProductivityChart
                  completedCount={
                    activities.filter((a) => a.type === "completion").length
                  }
                />

                {/* Recent Activity feed log */}
                <section className="bg-zinc-900 rounded-2xl p-5 shadow-xl">
                  <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-5 font-mono text-[11px] text-accent">
                    Recent Activity
                  </h3>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {activities.map((act) => {
                      let colorClasses = "bg-accent-dark/15 text-accent";
                      if (act.type === "achievement")
                        colorClasses = "bg-amber-500/15 text-amber-400";
                      if (act.type === "comment")
                        colorClasses = "bg-emerald-500/15 text-emerald-400";
                      if (act.type === "start")
                        colorClasses = "bg-accent-dark/15 text-accent";

                      return (
                        <div key={act.id} className="flex gap-3 text-left">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${colorClasses}`}
                          >
                            {act.type === "completion"
                              ? "✓"
                              : act.type === "achievement"
                                ? "★"
                                : act.type === "comment"
                                  ? "💬"
                                  : "🚀"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-200 leading-tight mt-0.5">
                              {act.title}
                            </p>
                            <span className="text-[11px] text-zinc-500 font-bold tracking-wide mt-1 block font-mono">
                              {act.relativeTime}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === "home" && userRole === "teacher" && (
            <motion.div
              key="teacher-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <TeacherHome />
            </motion.div>
          )}

          {activeTab === "my-courses" && userRole === "student" && (
            <motion.div
              key="my-courses"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-6 text-left">
                <div>
                  <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
                    My Courses
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Your active enrollments and learning tracks.
                  </p>
                </div>
                <MyCoursesSection
                  enrolledCourses={courses.filter((c) => isEnrolled(c.id))}
                  completedSession={handleCompleteSession}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "my-courses" && userRole === "teacher" && (
            <motion.div
              key="teacher-my-classes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <TeacherMyClasses />
            </motion.div>
          )}

          {activeTab === "schedule" && userRole === "student" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ScheduleView />
            </motion.div>
          )}

          {activeTab === "schedule" && userRole === "teacher" && (
            <motion.div
              key="teacher-schedule"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <TeacherSchedule />
            </motion.div>
          )}

          {activeTab === "assignments" && userRole === "student" && (
            <motion.div
              key="assignments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <AssignmentsView />
            </motion.div>
          )}

          {activeTab === "assignments" && userRole === "teacher" && (
            <motion.div
              key="teacher-assignments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <TeacherAssignments />
            </motion.div>
          )}

          {activeTab === "students" && userRole === "teacher" && (
            <motion.div
              key="teacher-students"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <TeacherStudents />
            </motion.div>
          )}

          {activeTab === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ProgressView />
            </motion.div>
          )}

          {activeTab === "mock-test" && (
            <motion.div
              key="mock-test"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <MockTestView />
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <MessagesView />
            </motion.div>
          )}

          {activeTab === "discover" && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <DiscoverView
                courses={courses}
                enrolledCourseIds={courses
                  .filter((c) => isEnrolled(c.id))
                  .map((c) => c.id)}
                onToggleBookmark={handleToggleBookmark}
                onEnroll={handleEnrollCourse}
                onUnenroll={handleUnenrollCourse}
              />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsView />
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <InfoView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Module creation dialog overlay was removed */}
    </div>
  );
}
