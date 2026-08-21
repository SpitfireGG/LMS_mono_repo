import { useState } from 'react';
import {
  User, Shield, Bell, Palette, GraduationCap, Plug,
  Camera, Mail, Lock, Download, Trash2, LogOut
} from 'lucide-react';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
        enabled ? 'bg-accent-dark shadow-lg shadow-accent-dark/20' : 'bg-zinc-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 rounded-xl bg-accent-dark/10 text-accent flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-extrabold text-base text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/60 hover:bg-zinc-950 transition-colors">
      <div className="flex-1 mr-4">
        <p className="text-sm font-semibold text-zinc-200">{label}</p>
        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState('profile');

  const [profile, setProfile] = useState({
    firstName: 'Robert',
    lastName: 'Dorwart',
    email: 'raambasnet.kit@gmail.com',
    bio: 'Full-stack developer & UX enthusiast. Currently tracking 4 courses.',
    role: 'Student',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    assignmentReminders: true,
    weeklyDigest: false,
    courseUpdates: true,
    gradeAlerts: true,
  });

  const [appearance, setAppearance] = useState({
    compactMode: false,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    sidebarBehavior: 'sticky' as 'sticky' | 'overlay',
    AnimationsEnabled: true,
  });

  const [academic, setAcademic] = useState({
    weeklyGoal: 10,
    timezone: 'Eastern Time (UTC-5)',
    language: 'English',
    showGradesOnDashboard: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    showOnlineStatus: true,
    sessionCount: 3,
  });

  const sections = [
    { id: 'profile', label: 'Profile & Account', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'academic', label: 'Academic', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'security', label: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Plug className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-left min-h-[calc(100vh-8rem)]">
      {/* Left Sidebar Navigation */}
      <div className="lg:w-64 shrink-0">
        <div className="bg-zinc-900 rounded-2xl p-3 shadow-xl sticky top-24">
          <h2 className="font-extrabold text-base text-zinc-100 px-3 mb-4">Settings</h2>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === section.id
                    ? 'bg-accent-dark/15 text-accent'
                    : 'text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200'
                }`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0">

        {/* ── Profile & Account ── */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <SectionHeader
              icon={<User className="w-5 h-5" />}
              title="Profile & Account"
              subtitle="Manage your personal information and account settings."
            />

            {/* Avatar */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArAou6iI9lCdu2f4jqV8A1B6fJ1kxd3rCFvxYA_q0ONX0TiF4pVxUKb13jEyIUrPbYeD9lzsnGKJRAz-_UbAFbhtOo7FDcQrnC_3rKqYgWEehvjSyPGzSTpXse_-fCoVzHicTXuZJBiEkkVyAX7uE8jBPBIQZrT3WRfBGOCONJArYFLv5ej7tN8zmcaUPfTNNJu8FW7abqhYCUbTllxZr0xO8ySVdLQZ4oQQO9XDM-JzE2haJsoV1H2UISH4M6wrpvzVNX86LiK9QP"
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-zinc-800"
                  />
                  <button className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-zinc-100">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{profile.role} · {profile.email}</p>
                  <button className="mt-2 text-xs font-bold text-accent hover:text-accent-light transition-colors cursor-pointer">
                    Change avatar
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Personal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 focus:border-accent-dark/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 focus:border-accent-dark/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 focus:border-accent-dark/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 focus:border-accent-dark/50 transition-all resize-none"
                />
              </div>
              <button className="bg-accent-dark hover:bg-accent-darker text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-accent-dark/20 cursor-pointer">
                Save Changes
              </button>
            </div>

            {/* Password */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Change Password</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Current Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 focus:border-accent-dark/50 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 focus:border-accent-dark/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 focus:border-accent-dark/50 transition-all"
                    />
                  </div>
                </div>
              </div>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                Update Password
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl border border-rose-500/10">
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2">Danger Zone</h4>
              <p className="text-xs text-zinc-500 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
              <div className="flex gap-3">
                <button className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Account
                </button>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out All Devices
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Appearance ── */}
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <SectionHeader
              icon={<Palette className="w-5 h-5" />}
              title="Appearance"
              subtitle="Customize how the dashboard looks and feels."
            />

            {/* Accent Color Picker */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Accent Color</h4>
              <p className="text-xs text-zinc-500 mb-4">Choose a primary color that will be used across the entire dashboard.</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Amber', colors: ['#fbbf24', '#f59e0b', '#d97706'] },
                  { name: 'Teal', colors: ['#5eead4', '#14b8a6', '#0d9488'] },
                  { name: 'Emerald', colors: ['#34d399', '#10b981', '#059669'] },
                  { name: 'Violet', colors: ['#a78bfa', '#7c3aed', '#6d28d9'] },
                  { name: 'Rose', colors: ['#fb7185', '#f43f5e', '#e11d48'] },
                  { name: 'Sky', colors: ['#38bdf8', '#0ea5e9', '#0284c7'] },
                ].map((color) => (
                  <button
                    key={color.name}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
                  >
                    <div className="flex gap-1">
                      {color.colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Display</h4>
              <SettingRow label="Compact Mode" description="Reduce padding and spacing for a denser layout.">
                <Toggle enabled={appearance.compactMode} onToggle={() => setAppearance(a => ({ ...a, compactMode: !a.compactMode }))} />
              </SettingRow>
              <SettingRow label="Animations" description="Enable smooth transitions and motion effects.">
                <Toggle enabled={appearance.AnimationsEnabled} onToggle={() => setAppearance(a => ({ ...a, AnimationsEnabled: !a.AnimationsEnabled }))} />
              </SettingRow>
              <SettingRow label="Sidebar Behavior" description="Sticky keeps sidebar visible. Overlay slides on top of content.">
                <select
                  value={appearance.sidebarBehavior}
                  onChange={(e) => setAppearance(a => ({ ...a, sidebarBehavior: e.target.value as 'sticky' | 'overlay' }))}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-dark cursor-pointer"
                >
                  <option value="sticky">Sticky</option>
                  <option value="overlay">Overlay</option>
                </select>
              </SettingRow>
            </div>

            {/* Font Size */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Font Size</h4>
              <div className="flex gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setAppearance(a => ({ ...a, fontSize: size }))}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      appearance.fontSize === size
                        ? 'bg-accent-dark/15 text-accent border border-accent-dark/30'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-200">Reset Appearance</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Restore all appearance settings to defaults.</p>
              </div>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer">
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications ── */}
        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <SectionHeader
              icon={<Bell className="w-5 h-5" />}
              title="Notifications"
              subtitle="Control when and how you receive alerts and updates."
            />

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Channels</h4>
              <SettingRow label="Email Alerts" description="Receive important notifications via email.">
                <Toggle enabled={notifications.emailAlerts} onToggle={() => setNotifications(n => ({ ...n, emailAlerts: !n.emailAlerts }))} />
              </SettingRow>
              <SettingRow label="Push Notifications" description="Browser push alerts for real-time updates.">
                <Toggle enabled={notifications.pushNotifications} onToggle={() => setNotifications(n => ({ ...n, pushNotifications: !n.pushNotifications }))} />
              </SettingRow>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Alert Types</h4>
              <SettingRow label="Assignment Reminders" description="Get notified before assignment deadlines (24h, 1h).">
                <Toggle enabled={notifications.assignmentReminders} onToggle={() => setNotifications(n => ({ ...n, assignmentReminders: !n.assignmentReminders }))} />
              </SettingRow>
              <SettingRow label="Course Updates" description="New materials, session changes, or instructor posts.">
                <Toggle enabled={notifications.courseUpdates} onToggle={() => setNotifications(n => ({ ...n, courseUpdates: !n.courseUpdates }))} />
              </SettingRow>
              <SettingRow label="Grade Alerts" description="Instant notification when grades are posted.">
                <Toggle enabled={notifications.gradeAlerts} onToggle={() => setNotifications(n => ({ ...n, gradeAlerts: !n.gradeAlerts }))} />
              </SettingRow>
              <SettingRow label="Weekly Digest" description="Summary of your progress, upcoming tasks, and activity.">
                <Toggle enabled={notifications.weeklyDigest} onToggle={() => setNotifications(n => ({ ...n, weeklyDigest: !n.weeklyDigest }))} />
              </SettingRow>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Quiet Hours</h4>
              <p className="text-xs text-zinc-500 mb-4">Suppress all notifications during specified hours.</p>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">From</label>
                  <input type="time" defaultValue="22:00" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 transition-all" />
                </div>
                <span className="text-zinc-600 mt-5">→</span>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">To</label>
                  <input type="time" defaultValue="07:00" className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 transition-all" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Academic ── */}
        {activeSection === 'academic' && (
          <div className="space-y-6">
            <SectionHeader
              icon={<GraduationCap className="w-5 h-5" />}
              title="Academic Preferences"
              subtitle="Configure your learning goals, timezone, and course display settings."
            />

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Study Goals</h4>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Weekly Study Goal (hours)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={academic.weeklyGoal}
                    onChange={(e) => setAcademic(a => ({ ...a, weeklyGoal: +e.target.value }))}
                    className="flex-1 accent-[var(--color-accent-dark)] h-2"
                  />
                  <span className="text-lg font-extrabold text-accent min-w-[3ch] text-right">{academic.weeklyGoal}h</span>
                </div>
              </div>
              <SettingRow label="Show Grades on Dashboard" description="Display your current grades on the home overview.">
                <Toggle enabled={academic.showGradesOnDashboard} onToggle={() => setAcademic(a => ({ ...a, showGradesOnDashboard: !a.showGradesOnDashboard }))} />
              </SettingRow>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Localization</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Timezone</label>
                  <select
                    value={academic.timezone}
                    onChange={(e) => setAcademic(a => ({ ...a, timezone: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 transition-all cursor-pointer"
                  >
                    <option>Eastern Time (UTC-5)</option>
                    <option>Central Time (UTC-6)</option>
                    <option>Mountain Time (UTC-7)</option>
                    <option>Pacific Time (UTC-8)</option>
                    <option>UTC</option>
                    <option>Central European Time (UTC+1)</option>
                    <option>India Standard Time (UTC+5:30)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Language</label>
                  <select
                    value={academic.language}
                    onChange={(e) => setAcademic(a => ({ ...a, language: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 transition-all cursor-pointer"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Privacy & Security ── */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <SectionHeader
              icon={<Shield className="w-5 h-5" />}
              title="Privacy & Security"
              subtitle="Protect your account and manage your data."
            />

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Authentication</h4>
              <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security with 2FA via authenticator app.">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${security.twoFactorEnabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Toggle enabled={security.twoFactorEnabled} onToggle={() => setSecurity(s => ({ ...s, twoFactorEnabled: !s.twoFactorEnabled }))} />
                </div>
              </SettingRow>
              <SettingRow label="Active Sessions" description={`${security.sessionCount} devices currently signed in to your account.`}>
                <button className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer flex items-center gap-1">
                  <LogOut className="w-3 h-3" />
                  Revoke All
                </button>
              </SettingRow>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Privacy</h4>
              <SettingRow label="Online Status" description="Show when you are active to instructors and peers.">
                <Toggle enabled={security.showOnlineStatus} onToggle={() => setSecurity(s => ({ ...s, showOnlineStatus: !s.showOnlineStatus }))} />
              </SettingRow>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Data Management</h4>
              <div className="flex flex-wrap gap-3">
                <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" />
                  Export All Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Reset all data to initial defaults? This cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Local Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Integrations ── */}
        {activeSection === 'integrations' && (
          <div className="space-y-6">
            <SectionHeader
              icon={<Plug className="w-5 h-5" />}
              title="Integrations"
              subtitle="Connect third-party services to enhance your learning experience."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Microsoft Teams',
                  description: 'Join live sessions and collaborate with classmates directly.',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M19.86 5.96c-.7-.38-1.47-.64-2.28-.76a6.47 6.47 0 0 0-3.58.55c-.18.08-.35.18-.5.28-.55.4-.96.98-1.2 1.66a4.36 4.36 0 0 0 1.87 5.05c.38.22.8.37 1.24.46a6.2 6.2 0 0 0 1.6.21c.5 0 .99-.08 1.46-.23.23-.08.45-.17.66-.28.27-.14.5-.32.71-.52.44-.42.76-.95.95-1.54a5.05 5.05 0 0 0 .1-2.62c-.18-.6-.52-1.14-.98-1.57l-.05-.04v-.01l.12.35zm-2.72-1.28a4.9 4.9 0 0 1 2.14.97l.08.06a3.8 3.8 0 0 1 .74.94 3.8 3.8 0 0 1 .34 1.08c.04.22.06.44.05.67a3.8 3.8 0 0 1-.38 1.67 3.8 3.8 0 0 1-.98 1.12 3.8 3.8 0 0 1-1.28.68 3.8 3.8 0 0 1-.74.14c-.56 0-1.09-.15-1.56-.42a3.8 3.8 0 0 1-1.14-.99 3.8 3.8 0 0 1-.6-1.28 3.8 3.8 0 0 1-.12-.7c0-.24.03-.47.08-.7a3.8 3.8 0 0 1 .66-1.35 3.8 3.8 0 0 1 1.08-.87c.42-.22.88-.34 1.36-.35.17 0 .34.02.5.05l.16.05v-.04zM8.93 3a2.47 2.47 0 0 0-2.47 2.47v10.06A2.47 2.47 0 0 0 8.93 18h5.14a2.47 2.47 0 0 0 2.47-2.47V5.47A2.47 2.47 0 0 0 14.07 3H8.93zm4.22 3.67a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM6.46 9.15a2.47 2.47 0 0 0-1.99 2.42v.52a1 1 0 0 0 1 1h2.65a2.47 2.47 0 0 1-2.47-2.47v-.47h.81zm0-2.2a1 1 0 0 0-1-1H4.68v-.52A1.8 1.8 0 0 1 6.47 3.63h.01a1.8 1.8 0 0 1 1.79 1.79v.53H6.46zm7.61 5.87H8.93a2.47 2.47 0 0 0-2.47 2.47v.1h3.84a1 1 0 0 1 1 1v.63h3.34v-.53a2.47 2.47 0 0 0-2.47-2.47h-.19z"/>
                    </svg>
                  ),
                  connected: true,
                  color: 'bg-blue-500/10 text-blue-400',
                },
                {
                  name: 'Google Calendar',
                  description: 'Sync assignments and sessions with your calendar.',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                    </svg>
                  ),
                  connected: true,
                  color: 'bg-blue-500/10 text-blue-400',
                },
                {
                  name: 'GitHub',
                  description: 'Submit code assignments and link repositories.',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  ),
                  connected: false,
                  color: 'bg-zinc-500/10 text-zinc-400',
                },
                {
                  name: 'Slack',
                  description: 'Get notified in your team channels for course updates.',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                    </svg>
                  ),
                  connected: false,
                  color: 'bg-amber-500/10 text-amber-400',
                },
              ].map((integration) => (
                <div key={integration.name} className="bg-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${integration.color} flex items-center justify-center shrink-0`}>
                      {integration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-200">{integration.name}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{integration.description}</p>
                    </div>
                  </div>
                  <button
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      integration.connected
                        ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                        : 'bg-accent-dark/15 text-accent hover:bg-accent-dark/25'
                    }`}
                  >
                    {integration.connected ? 'Connected · Manage' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
