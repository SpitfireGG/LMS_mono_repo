import { useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Coffee,
  CalendarDays,
  Bell,
} from "lucide-react";
import AddEventModal from "./AddEventModal";
import ScheduleOfficeHoursModal from "./ScheduleOfficeHoursModal";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const scheduleData: Record<
  string,
  Array<{
    id: string;
    time: string;
    endTime: string;
    title: string;
    code: string;
    type: "class" | "office" | "meeting";
    room: string;
    students: number;
    color: string;
  }>
> = {
  Mon: [
    {
      id: "m1",
      time: "09:00",
      endTime: "10:30",
      title: "Advanced Data Structures",
      code: "CSE-410",
      type: "class",
      room: "Room 304",
      students: 24,
      color: "#34d399",
    },
    {
      id: "m2",
      time: "14:00",
      endTime: "15:00",
      title: "Office Hours",
      code: "",
      type: "office",
      room: "Online",
      students: 0,
      color: "#a78bfa",
    },
  ],
  Tue: [
    {
      id: "t1",
      time: "11:00",
      endTime: "12:30",
      title: "Human-Computer Interaction",
      code: "HCI-220",
      type: "class",
      room: "Lab 201",
      students: 21,
      color: "#a78bfa",
    },
    {
      id: "t2",
      time: "16:00",
      endTime: "17:00",
      title: "Faculty Meeting",
      code: "",
      type: "meeting",
      room: "Conference Room A",
      students: 0,
      color: "#fbbf24",
    },
  ],
  Wed: [
    {
      id: "w1",
      time: "09:00",
      endTime: "10:30",
      title: "Advanced Data Structures",
      code: "CSE-410",
      type: "class",
      room: "Room 304",
      students: 24,
      color: "#34d399",
    },
    {
      id: "w2",
      time: "13:00",
      endTime: "14:30",
      title: "Foundations of UX Design",
      code: "UXD-301",
      type: "class",
      room: "Design Studio",
      students: 28,
      color: "#fbbf24",
    },
  ],
  Thu: [
    {
      id: "th1",
      time: "11:00",
      endTime: "12:30",
      title: "Human-Computer Interaction",
      code: "HCI-220",
      type: "class",
      room: "Lab 201",
      students: 21,
      color: "#a78bfa",
    },
    {
      id: "th2",
      time: "15:00",
      endTime: "16:00",
      title: "Office Hours",
      code: "",
      type: "office",
      room: "Online",
      students: 0,
      color: "#a78bfa",
    },
  ],
  Fri: [
    {
      id: "f1",
      time: "10:00",
      endTime: "12:00",
      title: "Machine Learning Foundations",
      code: "ML-501",
      type: "class",
      room: "Room 405",
      students: 32,
      color: "#fb7185",
    },
  ],
};

const upcomingEvents = [
  {
    id: "u1",
    title: "UX Design — User Research Report Due",
    time: "Today, 11:59 PM",
    type: "deadline",
    color: "#fbbf24",
  },
  {
    id: "u2",
    title: "Office Hours — Online",
    time: "Tomorrow, 2:00 PM",
    type: "office",
    color: "#a78bfa",
  },
  {
    id: "u3",
    title: "CSE-410 — Binary Tree Implementation Due",
    time: "Apr 22, 11:59 PM",
    type: "deadline",
    color: "#34d399",
  },
  {
    id: "u4",
    title: "Faculty Meeting",
    time: "Tue, 4:00 PM",
    type: "meeting",
    color: "#fbbf24",
  },
];

const eventTypeConfig = {
  class: { label: "Class", bg: "bg-zinc-800", icon: BookOpen },
  office: { label: "Office Hours", bg: "bg-violet-500/10", icon: Coffee },
  meeting: { label: "Meeting", bg: "bg-amber-500/10", icon: Users },
};

export default function TeacherSchedule() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showOfficeHours, setShowOfficeHours] = useState(false);
  const todayIndex = new Date().getDay();
  const mappedIndex = todayIndex === 0 || todayIndex === 6 ? 0 : todayIndex - 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
            Schedule
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Your weekly class schedule, office hours, and upcoming deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 bg-accent-dark hover:bg-accent-dark text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent-dark/20 active:scale-95 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2">
        {weekDays.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedDay === day
                ? "bg-accent-dark text-white shadow-lg shadow-accent-dark/20"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            } ${i === mappedIndex && selectedDay !== day ? "ring-1 ring-accent-dark/30" : ""}`}
          >
            {day}
            {i === mappedIndex && (
              <span className="ml-1.5 w-1.5 h-1.5 bg-accent rounded-full inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-base text-zinc-100">
                {selectedDay}'s Schedule
              </h2>
              <span className="text-xs text-zinc-500 font-mono">
                {scheduleData[selectedDay]?.length || 0} events
              </span>
            </div>

            <div className="space-y-4">
              {(scheduleData[selectedDay] || []).map((event, i) => {
                const config = eventTypeConfig[event.type];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="flex gap-4 group"
                  >
                    {/* Time Column */}
                    <div className="w-20 shrink-0 text-right pt-1">
                      <p className="text-sm font-mono font-bold text-zinc-300">
                        {event.time}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500">
                        {event.endTime}
                      </p>
                    </div>

                    {/* Timeline Dot + Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 mt-1.5 ring-4 ring-zinc-900"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="w-px flex-1 bg-zinc-800 mt-1" />
                    </div>

                    {/* Event Card */}
                    <div
                      className="flex-1 rounded-xl p-4 border transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.01]"
                      style={{
                        borderColor: `${event.color}20`,
                        backgroundColor: `${event.color}08`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: `${event.color}15`,
                                color: event.color,
                              }}
                            >
                              {config.label}
                            </span>
                            {event.code && (
                              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                                {event.code}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-zinc-100">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-zinc-500">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{event.room}</span>
                            </div>
                            {event.students > 0 && (
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" />
                                <span>{event.students} students</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.type === "class" && (
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Start Video Call"
                            >
                              <Video className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {(!scheduleData[selectedDay] ||
                scheduleData[selectedDay].length === 0) && (
                <div className="text-center py-12">
                  <CalendarDays className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-zinc-500">
                    No events scheduled
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Enjoy your free day or add a new event
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming + Quick Stats */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-xl">
            <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-4">
              Upcoming
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 hover:bg-zinc-800/50 transition-colors"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: evt.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-200 leading-tight truncate">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      {evt.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-xl">
            <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-4">
              This Week
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-semibold">
                  Total Classes
                </span>
                <span className="text-sm font-extrabold text-zinc-100">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-semibold">
                  Office Hours
                </span>
                <span className="text-sm font-extrabold text-zinc-100">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-semibold">
                  Meetings
                </span>
                <span className="text-sm font-extrabold text-zinc-100">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-semibold">
                  Total Hours
                </span>
                <span className="text-sm font-extrabold text-zinc-100">
                  12.5h
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-accent-dark h-full rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono text-center">
                65% of the week completed
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900 rounded-2xl p-5 shadow-xl">
            <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowOfficeHours(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all cursor-pointer text-left"
              >
                <Plus className="w-4 h-4" />
                Schedule Office Hours
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all cursor-pointer text-left">
                <Bell className="w-4 h-4" />
                Send Class Reminder
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all cursor-pointer text-left">
                <Calendar className="w-4 h-4" />
                View Full Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
      />
      <ScheduleOfficeHoursModal
        isOpen={showOfficeHours}
        onClose={() => setShowOfficeHours(false)}
      />
    </div>
  );
}
