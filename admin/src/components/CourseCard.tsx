import { useState } from 'react';
import { Bookmark, Star, Users, Clock, CheckCircle, BookOpen, ChevronRight, X } from 'lucide-react';
import { Course } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CourseCardProps {
  key?: string;
  course: Course;
  onToggleBookmark: (id: string) => void;
  onEnroll: (id: string) => void;
  onUnenroll?: (id: string) => void;
  isEnrolled: boolean;
}

export default function CourseCard({ course, onToggleBookmark, onEnroll, onUnenroll, isEnrolled }: CourseCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <div className="bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between">
        <div>
          {/* Header Image */}
          <div className="relative h-44 overflow-hidden group">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(course.id);
              }}
              className={`absolute top-3.5 right-3.5 backdrop-blur-md p-2 rounded-full transition-all duration-200 cursor-pointer ${
                course.isBookmarked
                  ? 'bg-accent-dark text-white scale-110 shadow-lg shadow-accent-dark/20'
                  : 'bg-black/45 hover:bg-black/60 text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${course.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="bg-accent-dark/10 text-accent font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide font-mono text-[10px]">
                {course.category}
              </span>
              <div className="flex items-center gap-3 font-semibold text-zinc-400">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span>{course.studentsCount}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{course.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <h3
              onClick={() => setShowDetailModal(true)}
              className="font-bold text-zinc-200 text-sm leading-snug line-clamp-2 hover:text-accent transition-colors duration-200 cursor-pointer mb-4 text-left"
            >
              {course.title}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2.5">
            <img
              src={course.instructorAvatar}
              alt={course.instructorName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-accent-dark"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-200 leading-none">{course.instructorName}</p>
              <p className="text-[10px] text-zinc-500 mt-1">Instructor</p>
            </div>
          </div>

          <button
            onClick={() => setShowDetailModal(true)}
            className="flex items-center gap-1 text-xs text-accent font-bold hover:text-accent-light transition-colors cursor-pointer"
          >
            Learn More
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Details Dialog */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="relative h-48">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 bg-zinc-955/50 hover:bg-zinc-950/80 text-zinc-100 rounded-full p-2 backdrop-blur-sm transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="bg-accent-dark px-3 py-1 text-[10px] text-white font-mono font-bold rounded-lg uppercase tracking-wider">
                    {course.category}
                  </span>
                  <h2 className="text-white text-base font-bold mt-2 leading-snug drop-shadow-sm">
                    {course.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-5 text-left">
                {/* Highlights */}
                <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-4 rounded-xl text-center shadow-inner">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Rating</span>
                    <p className="text-sm font-bold text-zinc-200 flex items-center justify-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      {course.rating.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Duration</span>
                    <p className="text-sm font-bold text-zinc-200 flex items-center justify-center gap-1 mt-0.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {course.duration}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Class Size</span>
                    <p className="text-sm font-bold text-zinc-200 flex items-center justify-center gap-1 mt-0.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-accent" />
                      {course.studentsCount} Active
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-2 font-mono">Course Overview</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {course.description || "No overview available. This module targets structural competence, modern workflows, and tactical hands-on implementation plans tailored for cross-organizational enterprise speed."}
                  </p>
                </div>

                {/* Syllabus */}
                {course.syllabus && course.syllabus.length > 0 && (
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-3 font-mono">Syllabus Breakdown</h4>
                    <div className="space-y-2">
                      {course.syllabus.map((lesson, idx) => (
                        <div key={idx} className="flex gap-3 text-xs text-zinc-400 bg-zinc-955 p-2.5 rounded-lg">
                          <span className="text-accent font-bold min-w-5 font-mono">0{idx + 1}</span>
                          <span className="font-medium text-zinc-250">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructor Block */}
                <div className="p-4 rounded-xl bg-zinc-950 flex gap-4 items-center shadow-inner">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructorName}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{course.instructorName}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{course.instructorRole || 'Course Director'}</p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="bg-zinc-950 p-5 flex justify-between gap-4 items-center shadow-inner pt-6 mt-2">
                <button
                  onClick={() => {
                    onToggleBookmark(course.id);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    course.isBookmarked
                      ? 'bg-accent-dark/10 text-accent'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${course.isBookmarked ? 'fill-current' : ''}`} />
                  {course.isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
                </button>

                {isEnrolled ? (
                  <div className="flex gap-2">
                    {onUnenroll && (
                      <button
                        onClick={() => {
                          onUnenroll(course.id);
                          setShowDetailModal(false);
                        }}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Leave Course
                      </button>
                    )}
                    <button
                      disabled
                      className="bg-emerald-500/10 text-emerald-450 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Enrolled
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onEnroll(course.id);
                      setShowDetailModal(false);
                    }}
                    className="bg-accent-dark hover:bg-accent-dark text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-accent-dark/20 hover:shadow-accent-dark/35 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Join Course Now
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
