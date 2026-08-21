import { Play, Check, Milestone, Plus, RefreshCw, Calendar as CalendarIcon, FileText, Download } from 'lucide-react';
import { Course } from '../types';

interface MyCoursesSectionProps {
  enrolledCourses: Course[];
  completedSession: (courseId: string) => void;
  onViewAllClick: () => void;
}

export default function MyCoursesSection({ enrolledCourses, completedSession, onViewAllClick }: MyCoursesSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-extrabold text-lg text-zinc-100">My Courses</h2>
        <button
          onClick={onViewAllClick}
          className="text-accent hover:text-accent-light font-mono text-[11px] font-bold cursor-pointer transition-colors"
        >
          View all
        </button>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl p-8 text-center shadow-lg">
          <p className="text-sm font-semibold text-zinc-300">You are not actively enrolled in any courses.</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto font-normal">Explore "Top courses you may like" below and click join to start studying and tracking metrics!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {enrolledCourses.map((course, idx) => {
            const completedCount = course.sessionsCompleted || 0;
            const totalCount = course.sessionsTotal || 10;
            const percentage = Math.round((completedCount / totalCount) * 100);
            
            // Mocked data for LMS requirements based on index to look varied
            const nextSessionDay = idx % 2 === 0 ? 'Today' : 'Tomorrow';
            const nextSessionTime = idx % 2 === 0 ? '14:00' : '09:00';
            const unsubmittedCount = (idx + 1) % 3;
            const materialsCount = 12 + idx * 3;

            return (
              <div
                key={course.id}
                className="bg-zinc-900 rounded-2xl p-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4 w-full xl:w-auto">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm relative group">
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-zinc-150 leading-tight truncate" title={course.title}>{course.title}</h4>
                    <div className="flex items-center gap-4 mt-2 font-mono text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <CalendarIcon className="w-3.5 h-3.5 text-accent" />
                        <span>{nextSessionDay}, {nextSessionTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{materialsCount} items</span>
                      </div>
                      {unsubmittedCount > 0 && (
                        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          <FileText className="w-3 h-3" />
                          <span>{unsubmittedCount} Due</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between xl:justify-end gap-6 w-full xl:w-auto pt-4 xl:pt-0">
                  {/* Progress Indicator */}
                  <div className="flex flex-col items-end gap-2 w-32 shrink-0">
                    <div className="flex justify-between w-full text-[11px] font-bold text-zinc-500 font-mono">
                      <span>Progress</span>
                      <span className="text-zinc-300">{percentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-accent-dark h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {percentage < 100 ? (
                      <button
                        onClick={() => completedSession(course.id)}
                        className="bg-accent-dark hover:bg-accent-dark text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[11px] font-bold group cursor-pointer shadow-lg shadow-accent-dark/20"
                        title="Open Course Workspace"
                      >
                        <Play className="w-3 h-3 shrink-0" />
                        <span>Resume</span>
                      </button>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
