import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CourseCard from './CourseCard';
import { Course } from '../types';

interface DiscoverViewProps {
  courses: Course[];
  enrolledCourseIds: string[];
  onToggleBookmark: (id: string) => void;
  onEnroll: (id: string) => void;
  onUnenroll: (id: string) => void;
}

export default function DiscoverView({ 
  courses, 
  enrolledCourseIds, 
  onToggleBookmark, 
  onEnroll, 
  onUnenroll 
}: DiscoverViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Avoid showing enrolled courses strictly in Discover or maybe show them as enrolled
  // Let's just filter by search and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const isEnrolled = enrolledCourseIds.includes(course.id);
    return matchesSearch && matchesCategory && !isEnrolled; // Only show unenrolled courses in discover
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
            Discover Courses
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Explore our catalog and start a new learning track.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search programs..."
              className="pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-accent-dark text-zinc-100 placeholder-zinc-500 w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold focus:outline-none focus:ring-1 focus:ring-accent-dark cursor-pointer"
          >
            <option value="All">All Tiers</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onToggleBookmark={onToggleBookmark}
            onEnroll={onEnroll}
            onUnenroll={onUnenroll}
            isEnrolled={enrolledCourseIds.includes(course.id)}
          />
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
            <p className="font-medium text-sm">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
