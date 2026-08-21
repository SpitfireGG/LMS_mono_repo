import { Course, ActivityItem, Metrics, EventItem } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'python-basics',
    title: 'Three-month Course to Learn the Basics of Python and Start Coding.',
    description: 'Learn the fundamentals of Python programming language. This comprehensive guide covers variables, data structures, OOP concepts, algorithms, and practical projects to build a solid foundations for backend development or data science.',
    category: 'Beginner',
    studentsCount: 118,
    rating: 5.0,
    duration: '3 months',
    instructorName: 'Alison Walsh',
    instructorRole: 'Senior Python Developer & Educator',
    instructorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9wiUMgAcDJ5c0atnSB9RPDTqO1CXLCAqQRd3VvrjWenTBXQC_fHQjF3IvOvJRLJ2QP8_DtX31K_CTIB77fjbdA8ngNhTIX5lVzX5lsyxM2wC3xPAXrz79MI6tI-JSrFtoTn6S6vXqUUweDvoWsRPLVapMkOtcSznkbTJfBpN7LBf2PKd3Sj8M3DsNDKLUy_wr-HMmuWeVQAvd_k_cDZF0b3tQxIdv4mtB23Fmz1hQ40AdbaIVIRoryHi4UrliyoWGahflP8q3scAy',
    isBookmarked: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBekJBSw02_p-Jtdl0AolcUNZ2R2ogtcR4ZUMFuQo4ddz9JQllhotQF_hTyVujIba0H5QUAuMwXpQvd4tdYDIsQRukY9h3CSZjASKDmNfE26Y34FLxpGJXbWEAv4LgPqTnLBI0MetRfRydnc0VqlavazHGcAEl5hnBXfXcK_a_r3dwJbSsLhgJhrwp0D1NA913Nf1fKPqCwMHVsujvGpSw_IR-pyq5rzRw8FxorqleyayYGk8CwhvbSgRiLvOYCdCd82ktUYaEKynf8',
    syllabus: [
      'Introduction to Python and Setup',
      'Variables, Numbers, and String Operations',
      'Control Flow: Loops and Conditional Statements',
      'Data Structures: Lists, Tuples, Dicts, and Sets',
      'Functions and Modular Coding',
      'Object-Oriented Programming (OOP) in Python',
      'Working with Web APIs and JSON Data',
      'Final Project: Build a fully functional task automation engine'
    ]
  },
  {
    id: 'business-analytics',
    title: "Beginner's Guide to Successful Company Management: Business Analytics",
    description: 'Master the principles of modern business architecture and strategic leadership. Develop actionable insights from data, learn financial model parsing, team delegation strategies, and agile workflows tailored for rapidly scaling startups.',
    category: 'Beginner',
    studentsCount: 234,
    rating: 4.8,
    duration: '2 months',
    instructorName: 'Patty Kutch',
    instructorRole: 'VP of Product Operations',
    instructorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Qynzb_neWgAeaqMrgFJql_TZNKvXwkFhTx1hiC1RFuuU-wJMY9NHuH6iUprKT01gzn5-2u_A0MQJTUWpKJcvc8Fvi0yrhs8Irf-lsW8nyTAcBLl5MYVdnZNSF2VU1yswkOqdyc-EQ_IFELEN854ZcYRRKr1p94ucJjqfkmJp4npzI5k9cMfAlEjleCpPyJ_PQNlxSGJKOMkU16fyo6gIoA1XVV57DAB_8wdt_QH6JJfFmC9dwEcAdgtjR55k66H_XOqLPQVoIeq8',
    isBookmarked: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJjs_XkfxdGy5lxDkJtR05Zrw55lVD_mJmW87TtRWcUm5WMBuO-jUdTeOOUGBWeTed5vAS822HLa2yZhwHvhuIeGILzCGdQopKaLmNfI1jZzpIb7LsDx1XyszHPocgANsYLvUp0rsPURd1qEMCH472CxpuY_asDgph6cOUDLD1Q_18ROOCtUdnjxTBKKP_DCUj4qZxf-xi-xYrB_prStt2WAXeHKhzPT2hmUBIQYuhn-zhoVN1AbrZkpWzo7lp3mRRevFuMWEaezj',
    syllabus: [
      'Foundations of Modern Management & Org Design',
      'Strategic Decision Making with Business Analytics',
      'Key Metric Design & KPI Frameworks',
      'Finance and Resource Budgeting Essentials',
      'People Operations: Hiring and Retaining A-Player Teams',
      'Agile Frameworks and Operational Speed Optimization',
      'Final Case Study: Designing a Turnaround Strategy for a Legacy Business'
    ]
  },
  {
    id: 'ai-vr',
    title: 'AI & Virtual Reality',
    description: 'Unlock the future of learning by combining deep machine learning algorithms with spatial computing and immersive stereoscopic 3D interactive design environments.',
    category: 'Intermediate',
    studentsCount: 412,
    rating: 4.9,
    duration: '4 months',
    instructorName: 'Marcus Vance',
    instructorRole: 'Lead Spatial Systems Architect',
    instructorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfOIhq8gsjqeXnKONXxJQf0uqdpDnR-7RQk7Se4TyLRBRCkRLH-LuG-dEmDkiI59_FCytg6g1jMN0Xfrm8sWW_Snd7XCQ5stPc_QFAdHvag_K0WfekEkOmtGIohiDUh-AddThdO0ndM8_TdzYbOZklrJlfMZYAzYmeLtKy4RZddyQQqIIb8F90U0zncxWEeZseFGAp09YOgyyrnH8mWCFN8mwsaMX80drlP-8Uqqmmke9afabympzSFkBPltGjpBQJ91rjL6yhQacA',
    isBookmarked: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0PEy-CZD2lBSvi1DGFW3vXtbNIxBeqDApHSnPvRvMH5unsO6sFCMDTw3tTuZKV24PPYFsy2pAkACPDDZfnTQDqww7sOKtfNzbhKoKk5ZS-SPC8JbPk2bu5ujQNfdXjbJdo2tVOgQFrv-W47-P1x7k6kXYASM8XC1Ume5ByS3zY0LQ_kp1sTyYV0jQFButsEWijrHLd6RBW1yKdDJRytEwx0ehPcBYjj5GM3abdccgoM5MDKJUxvpHzmYn3c5H8YD-DCCBjq6goXJG',
    progress: 75,
    sessionsCompleted: 9,
    sessionsTotal: 12,
    syllabus: [
      'Spatial Computing Basics and Coordinate Systems',
      'AI-driven Procedural Generation of 3D Landscapes',
      'Physics simulation and hand gestures tracking',
      'Neural Networks for Context Aware Spatial Interfaces',
      'Optimizing framerates for absolute spatial immersion'
    ]
  },
  {
    id: 'photography',
    title: 'Photography Masterclass',
    description: 'A comprehensive study of professional photography, exposure mathematics, studio lighting techniques, photojournalism narrative structuring, and complete Adobe Lightroom post-production pipelines.',
    category: 'Intermediate',
    studentsCount: 320,
    rating: 4.7,
    duration: '3 months',
    instructorName: 'Serena Vance',
    instructorRole: 'Pulitzer Prize Photojournalist',
    instructorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUiBGc3Ye2QZqcfzgSUoAFn_3RNi8bTEAq5HTUGLbcRfdiHAKNWppXE0AW_L_98ZRwglrMkwC41an4CKThqr7D9MzpFzpb9OD7hDNa44mt3Tzlng4RBHHzoTNiSbFR8wb644UU68zqrmBG3pzBKV9DxMfHFLtPU4s7-KsGCkKRrVve_zPL8PdhjYefCXxH_yQ85G5Cq5-vAJeYq5ImfkV88cwM_pQGLrsxeZSFDN_CPPTaZpToUuot1jIk3Qqaieo9kIHrUMbBrCLl',
    isBookmarked: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBzp6jVLUH21AIH00mbRwso29x_oPghPq-C1inYPeW6v7QgaQbh15M3rbQh25shtpg8ksafYpSaMQ7YXdCzFCogXq4GRb8AHr3qFwIUZb1s7pk1eZlooFcVKrGaxwH_fwH6QFhyq-Hi7c5v6kz60hCJrkZXVySXvui_andR5vwP8tai4xpy4dc21TPKzvTHAEbLqqwFWOZPf2QjhudbwMyPAyEBDcBuk-ize0ujENQactRn0cWAdajiK9oGaHv5qMvXZrLj97Cjfh-8',
    progress: 66,
    sessionsCompleted: 16,
    sessionsTotal: 24,
    syllabus: [
      'The Mechanical Eye: Shutter Speed, Aperture, and ISO',
      'Lighting Geometry: Three-point portrait configurations',
      'Street Photography: Framing spontaneous architecture',
      'Color grading and visual storytelling in digital post-production'
    ]
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Completed Lesson 4 in Python Basics',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    type: 'completion',
    relativeTime: '2 hours ago'
  },
  {
    id: 'act-2',
    title: 'Earned a Badge in UX Design',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // Yesterday
    type: 'achievement',
    relativeTime: 'Yesterday, 4:30 PM'
  },
  {
    id: 'act-3',
    title: 'Replied to a discussion in AI Ethics',
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
    type: 'comment',
    relativeTime: 'Apr 3, 2024'
  },
  {
    id: 'act-4',
    title: "Started 'Advanced Photography'",
    timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000),
    type: 'start',
    relativeTime: 'Apr 2, 2024'
  }
];

export const INITIAL_METRICS: Metrics = {
  score: 210,
  totalStudents: 17,
  avgGrade: 'A-',
  hoursLearned: 124,
  weeklyGoal: 10,
  weeklyProgress: 7.2
};

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    date: '2024-04-24',
    title: 'Interactive Spatial Design Lab',
    type: 'session',
    completed: true,
    courseId: 'ai-vr'
  },
  {
    id: 'ev-2',
    date: '2024-04-25',
    title: 'Python Basics Weekly Sync',
    type: 'session',
    completed: false,
    courseId: 'python-basics'
  },
  {
    id: 'ev-3',
    date: '2024-04-28',
    title: 'Business Proposal Submission',
    type: 'assignment',
    completed: false,
    courseId: 'business-analytics'
  },
  {
    id: 'ev-4',
    date: '2024-04-28',
    title: 'Composition milestone exam',
    type: 'exam',
    completed: true,
    courseId: 'photography'
  }
];

// Seed other dates relative to current time for interactive capability
export function getSeededEventsForMonth(year: number, month: number): EventItem[] {
  const monthStr = String(month).padStart(2, '0');
  return [
    {
      id: 'se-1',
      date: `${year}-${monthStr}-12`,
      title: 'Python Control Flow Live Lab',
      type: 'session',
      completed: true,
      courseId: 'python-basics'
    },
    {
      id: 'se-2',
      date: `${year}-${monthStr}-15`,
      title: 'VR Spatial Integration Workshop',
      type: 'session',
      completed: false,
      courseId: 'ai-vr'
    },
    {
      id: 'se-3',
      date: `${year}-${monthStr}-20`,
      title: 'Business Analytics Strategy Review',
      type: 'assignment',
      completed: false,
      courseId: 'business-analytics'
    },
    {
      id: 'se-4',
      date: `${year}-${monthStr}-24`,
      title: 'Weekly Progress Review Session',
      type: 'session',
      completed: true
    },
    {
      id: 'se-5',
      date: `${year}-${monthStr}-28`,
      title: 'Photography Lens calibration Assignment',
      type: 'assignment',
      completed: false,
      courseId: 'photography'
    }
  ];
}
