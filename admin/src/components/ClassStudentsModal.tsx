import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Eye,
  Flag,
  Download,
  Users,
} from "lucide-react";
import Modal from "./Modal";

interface ClassStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  classCode: string;
}

const mockStudents: Record<
  string,
  Array<{
    id: string;
    name: string;
    email: string;
    grade: string;
    gpa: number;
    attendance: number;
    completion: number;
    trend: "up" | "down";
    trendChange: string;
    lastActive: string;
    flagged: boolean;
  }>
> = {
  "UXD-301": [
    { id: "s1", name: "Aria Chen", email: "aria.chen@naati.edu", grade: "A", gpa: 4.0, attendance: 96, completion: 91, trend: "up", trendChange: "+3%", lastActive: "1h ago", flagged: false },
    { id: "s2", name: "Jake Morrison", email: "j.morrison@naati.edu", grade: "C+", gpa: 2.3, attendance: 68, completion: 52, trend: "down", trendChange: "-4%", lastActive: "2d ago", flagged: true },
    { id: "s9", name: "Sophie Laurent", email: "sophie.l@naati.edu", grade: "B+", gpa: 3.3, attendance: 89, completion: 78, trend: "up", trendChange: "+5%", lastActive: "3h ago", flagged: false },
    { id: "s10", name: "David Kim", email: "david.k@naati.edu", grade: "A-", gpa: 3.7, attendance: 94, completion: 88, trend: "up", trendChange: "+2%", lastActive: "30m ago", flagged: false },
  ],
  "CSE-410": [
    { id: "s2", name: "Marcus Webb", email: "m.webb@naati.edu", grade: "B+", gpa: 3.3, attendance: 88, completion: 78, trend: "up", trendChange: "+5%", lastActive: "3h ago", flagged: false },
    { id: "s6", name: "Omar Hassan", email: "omar.h@naati.edu", grade: "A", gpa: 4.0, attendance: 98, completion: 95, trend: "up", trendChange: "+1%", lastActive: "30m ago", flagged: false },
  ],
  "HCI-220": [
    { id: "s3", name: "Zara Patel", email: "zara.p@naati.edu", grade: "A-", gpa: 3.7, attendance: 92, completion: 85, trend: "up", trendChange: "+2%", lastActive: "5h ago", flagged: false },
    { id: "s7", name: "Nina Volkov", email: "nina.v@naati.edu", grade: "B-", gpa: 2.7, attendance: 74, completion: 60, trend: "down", trendChange: "-2%", lastActive: "1d ago", flagged: true },
  ],
  "ML-501": [
    { id: "s5", name: "Lily Tanaka", email: "lily.t@naati.edu", grade: "B", gpa: 3.0, attendance: 85, completion: 70, trend: "up", trendChange: "+7%", lastActive: "12h ago", flagged: false },
    { id: "s8", name: "Ethan Park", email: "ethan.p@naati.edu", grade: "A-", gpa: 3.7, attendance: 94, completion: 88, trend: "up", trendChange: "+4%", lastActive: "2h ago", flagged: false },
  ],
};

export default function ClassStudentsModal({
  isOpen,
  onClose,
  className,
  classCode,
}: ClassStudentsModalProps) {
  const [search, setSearch] = useState("");
  const students = (mockStudents[classCode] || []).filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const avgGrade =
    students.length > 0
      ? (students.reduce((a, s) => a + s.gpa, 0) / students.length).toFixed(1)
      : "—";
  const avgAttendance =
    students.length > 0
      ? Math.round(
          students.reduce((a, s) => a + s.attendance, 0) / students.length,
        )
      : 0;
  const atRisk = students.filter((s) => s.flagged).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${classCode} — Students`}
      subtitle={className}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Summary Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-950 rounded-xl p-3 text-center border border-zinc-800">
            <p className="text-lg font-extrabold text-zinc-100">
              {students.length}
            </p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              Enrolled
            </p>
          </div>
          <div className="bg-zinc-950 rounded-xl p-3 text-center border border-zinc-800">
            <p className="text-lg font-extrabold text-zinc-100">
              {avgGrade}
            </p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              Avg GPA
            </p>
          </div>
          <div className="bg-zinc-950 rounded-xl p-3 text-center border border-zinc-800">
            <p className="text-lg font-extrabold text-zinc-100">
              {avgAttendance}%
            </p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              Attendance
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-dark/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all"
          />
        </div>

        {/* Student List */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {students.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 bg-zinc-950 hover:bg-zinc-800/50 rounded-xl p-3 transition-colors border border-zinc-800/50"
            >
              <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent">
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-zinc-200 truncate">
                    {s.name}
                  </p>
                  {s.flagged && (
                    <Flag className="w-3 h-3 text-rose-400 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono truncate">
                  {s.email}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center min-w-[40px]">
                  <p className="text-xs font-extrabold text-zinc-100">
                    {s.grade}
                  </p>
                  <p className="text-[9px] text-zinc-500">Grade</p>
                </div>
                <div className="text-center min-w-[45px]">
                  <p className="text-xs font-extrabold text-zinc-100">
                    {s.attendance}%
                  </p>
                  <p className="text-[9px] text-zinc-500">Attend</p>
                </div>
                <div className="text-center min-w-[45px]">
                  <div className="flex items-center justify-center gap-0.5">
                    <p className="text-xs font-extrabold text-zinc-100">
                      {s.completion}%
                    </p>
                    {s.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-rose-400" />
                    )}
                  </div>
                  <p
                    className={`text-[9px] font-bold ${s.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {s.trendChange}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer"
                  title="Message"
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer"
                  title="View Profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <p className="text-xs text-zinc-500 text-center py-6">
              No students found
            </p>
          )}
        </div>

        {/* Export */}
        <div className="flex justify-end pt-2 border-t border-zinc-800">
          <button className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Export List
          </button>
        </div>
      </div>
    </Modal>
  );
}
