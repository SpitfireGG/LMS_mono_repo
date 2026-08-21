import { motion } from "motion/react";
import {
  BookOpen,
  GraduationCap,
  Shield,
  Zap,
  Globe,
  Code2,
  Palette,
  MessageSquare,
  Keyboard,
  Mail,
  ExternalLink,
  Heart,
  Sparkles,
  Monitor,
  Cpu,
  Database,
  Layers,
  Lock,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Course Management",
    desc: "Full-featured course creation, enrollment, and progress tracking with real-time analytics.",
    color: "#fbbf24",
  },
  {
    icon: GraduationCap,
    title: "Student Analytics",
    desc: "Track attendance, grades, completion rates, and identify at-risk students early.",
    color: "#34d399",
  },
  {
    icon: MessageSquare,
    title: "Real-time Messaging",
    desc: "Class rooms, group chats, rich messages with code blocks, polls, and file sharing.",
    color: "#a78bfa",
  },
  {
    icon: BarChart3,
    title: "Grade Distribution",
    desc: "Visual grade analytics with distribution charts and per-class performance breakdowns.",
    color: "#fb7185",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Separate student and teacher experiences with dedicated dashboards and permissions.",
    color: "#fbbf24",
  },
  {
    icon: Zap,
    title: "Live Sessions",
    desc: "Integrated video call scheduling, office hours, and real-time class management.",
    color: "#34d399",
  },
];

const techStack = [
  { label: "Framework", value: "React 19 + TypeScript", icon: Code2 },
  { label: "Build Tool", value: "Vite 6", icon: Zap },
  { label: "Styling", value: "Tailwind CSS v4", icon: Palette },
  { label: "Animation", value: "Motion (Framer)", icon: Sparkles },
  { label: "Icons", value: "Lucide React", icon: Layers },
  { label: "State", value: "React Hooks + localStorage", icon: Database },
  { label: "Runtime", value: "TypeScript ESNext", icon: Cpu },
  { label: "Platform", value: "Web SPA", icon: Globe },
];

const keyboardShortcuts = [
  { keys: ["⌘", "K"], action: "Focus search bar" },
  { keys: ["⌘", "B"], action: "Toggle sidebar" },
  { keys: ["Esc"], action: "Close modals / popovers" },
  { keys: ["Tab"], action: "Navigate between inputs" },
];

const team = [
  { name: "NAATI Excellence", role: "Platform Design & Development", url: "#" },
];

export default function InfoView() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-darker/30 via-zinc-950/80 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,var(--color-accent-dark),0.12),transparent_60%)]" />
        <div className="relative z-10 px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 backdrop-blur flex items-center justify-center shadow-xl overflow-hidden shrink-0">
              <img
                src="/assets/naatiLogo.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
                  NAATI Excellence
                </h1>
                <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  v1.0.4
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                An enterprise-grade Learning Management System built for modern
                education. Designed to empower both students and teachers with
                real-time analytics, rich collaboration tools, and a premium
                interface.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  All systems operational
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Last updated: April 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest mb-4"
        >
          Platform Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
              className="bg-zinc-900 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-zinc-800 hover:border-zinc-700 group hover:scale-[1.01]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${feat.color}15` }}
              >
                <feat.icon
                  className="w-5 h-5"
                  style={{ color: feat.color }}
                />
              </div>
              <h3 className="font-bold text-sm text-zinc-100 mb-1">
                {feat.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Stack + Keyboard Shortcuts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-zinc-900 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent" />
            Tech Stack
          </h3>
          <div className="space-y-3">
            {techStack.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Keyboard Shortcuts + System Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="space-y-6"
        >
          {/* Keyboard Shortcuts */}
          <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-accent" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-3">
              {keyboardShortcuts.map((shortcut) => (
                <div
                  key={shortcut.action}
                  className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                >
                  <span className="text-xs font-semibold text-zinc-300">
                    {shortcut.action}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[11px] font-mono font-bold text-zinc-400 min-w-[28px] text-center"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-accent" />
              System Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs font-semibold text-zinc-300">
                  Design Token Version
                </span>
                <span className="text-xs font-mono text-accent font-bold">
                  1.0.4 — Premium
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs font-semibold text-zinc-300">
                  Accent System
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  CSS Custom Properties
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs font-semibold text-zinc-300">
                  Persistence
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  localStorage
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-semibold text-zinc-300">
                  Rendering
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  Client-side SPA
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer / Credits */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="bg-zinc-900 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Built with Purpose
            </h3>
            <p className="text-xs text-zinc-500 mt-2 max-w-md leading-relaxed">
              Designed and developed as a premium learning management dashboard.
              Every component is crafted with attention to detail, accessibility,
              and performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact Support
            </a>
            <a
              href="#"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Documentation
            </a>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[11px] text-zinc-600 font-mono">
            © 2024 NAATI Excellence. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-zinc-600">
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">
              Changelog
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
