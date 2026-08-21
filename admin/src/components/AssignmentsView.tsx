import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function AssignmentsView() {
  const assignments = [
    {
      id: '1',
      course: 'Foundations of UX Design',
      title: 'Module 4: Wireframing Project',
      status: 'pending',
      dueDate: 'Tomorrow, 11:59 PM',
      type: 'Project',
    },
    {
      id: '2',
      course: 'Advanced Web Architecture',
      title: 'System Design Diagram',
      status: 'submitted',
      dueDate: 'Oct 24, 2024',
      type: 'Diagram',
      grade: 'Pending Review',
    },
    {
      id: '3',
      course: 'Foundations of UX Design',
      title: 'User Persona Case Study',
      status: 'graded',
      dueDate: 'Oct 15, 2024',
      type: 'Case Study',
      grade: '95/100',
    },
    {
      id: '4',
      course: 'Data Structures & Algorithms',
      title: 'Homework 3: Graph Traversal',
      status: 'missing',
      dueDate: 'Oct 10, 2024',
      type: 'Homework',
      grade: '0/100',
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
          Assignments
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Review, submit, and track all your course assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">To Do</p>
          <p className="text-2xl font-extrabold text-zinc-100">1</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Submitted</p>
          <p className="text-2xl font-extrabold text-zinc-100">1</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Graded</p>
          <p className="text-2xl font-extrabold text-zinc-100">1</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Missing</p>
          <p className="text-2xl font-extrabold text-zinc-100">1</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
              <th className="font-bold py-4 px-6">Assignment</th>
              <th className="font-bold py-4 px-6">Course</th>
              <th className="font-bold py-4 px-6">Due Date</th>
              <th className="font-bold py-4 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-zinc-800/20 transition-colors group">
                <td className="py-4 px-6">
                  <p className="font-bold text-zinc-200">{assignment.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{assignment.type}</p>
                </td>
                <td className="py-4 px-6 text-zinc-300">{assignment.course}</td>
                <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{assignment.dueDate}</td>
                <td className="py-4 px-6 text-right">
                  {assignment.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      To Do
                    </span>
                  )}
                  {assignment.status === 'submitted' && (
                    <span className="inline-flex items-center gap-1.5 bg-accent-dark/10 text-accent px-3 py-1 rounded-full text-xs font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      Submitted
                    </span>
                  )}
                  {assignment.status === 'graded' && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {assignment.grade}
                    </span>
                  )}
                  {assignment.status === 'missing' && (
                    <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Missing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
