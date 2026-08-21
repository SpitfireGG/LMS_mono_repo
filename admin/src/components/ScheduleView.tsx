import { Calendar, Video, Clock } from 'lucide-react';

export default function ScheduleView() {
  const upcomingMeetings = [
    {
      id: '1',
      title: 'Module 4: Wireframing & Prototyping',
      course: 'Foundations of UX Design',
      instructor: 'Prof. Sarah Jenkins',
      time: '14:00 - 15:30',
      date: 'Today',
      isLive: true,
    },
    {
      id: '2',
      title: 'Workshop: Intro to Advanced Data Structures',
      course: 'Data Structures & Algorithms',
      instructor: 'Dr. Alan Turing',
      time: '10:00 - 11:00',
      date: 'Tomorrow',
      isLive: false,
    },
    {
      id: '3',
      title: 'Weekly 1:1 Review',
      course: 'Advanced Web Architecture',
      instructor: 'Emma Collins',
      time: '15:00 - 15:30',
      date: 'Tomorrow',
      isLive: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
          Schedule
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your upcoming live sessions and calendar events.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Upcoming Sessions</h3>
        
        <div className="space-y-4">
          {upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-dark/10 text-accent flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-200">{meeting.title}</h4>
                  <p className="text-sm text-zinc-400">{meeting.course} • {meeting.instructor}</p>
                  <div className="flex items-center gap-4 mt-2 font-mono text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {meeting.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.time}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${meeting.isLive ? 'bg-accent-dark hover:bg-accent-dark text-white shadow-accent-dark/20' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
              >
                <Video className="w-4 h-4" />
                {meeting.isLive ? 'Join on Teams' : 'Waiting for host'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* We could embed the full calendar widget here if we want, or a larger version */}
      <div className="p-10 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 flex flex-col items-center justify-center">
        <Calendar className="w-10 h-10 mb-2 opacity-50" />
        <p className="font-medium">Full Outlook Calendar sync configuration goes here.</p>
        <p className="text-xs mt-1">Integrated directly with Microsoft Graph API.</p>
      </div>
    </div>
  );
}
