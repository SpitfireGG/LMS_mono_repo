export interface Course {
  id: string;
  title: string;
  description?: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced';
  studentsCount: number;
  rating: number;
  duration: string;
  instructorName: string;
  instructorAvatar: string;
  instructorRole?: string;
  isBookmarked?: boolean;
  progress?: number; // 0 - 100
  sessionsCompleted?: number;
  sessionsTotal?: number;
  imageUrl: string;
  syllabus?: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: Date;
  type: 'achievement' | 'completion' | 'comment' | 'start';
  relativeTime: string;
}

export interface Metrics {
  score: number;
  totalStudents: number;
  avgGrade: string;
  hoursLearned: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface EventItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'session' | 'assignment' | 'exam' | 'badge';
  completed: boolean;
  courseId?: string;
}

export type ActiveTab = 'home' | 'my-courses' | 'schedule' | 'assignments' | 'progress' | 'messages' | 'discover' | 'settings' | 'info' | 'students' | 'mock-test';

export type UserRole = 'student' | 'teacher';
