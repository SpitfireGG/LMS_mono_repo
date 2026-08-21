import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckSquare, Square, Plus } from 'lucide-react';
import { EventItem } from '../types';

interface CalendarWidgetProps {
  events: EventItem[];
  toggleEventCompletion: (id: string) => void;
  addEvent: (dateString: string, title: string, type: 'session' | 'assignment') => void;
}

export default function CalendarWidget({ events, toggleEventCompletion, addEvent }: CalendarWidgetProps) {
  // Setup standard state starting in April 2024 as in the design
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2024, 3, 5)); // April 5, 2024
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 3, 24)); // Highlight 24 by default
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'session' | 'assignment'>('session');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0, Monday=1, etc.
  // Shift index so Monday is 0
  const startDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysGrid: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Previous month padding
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    daysGrid.push({
      day: prevDay,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevDay)
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d)
    });
  }

  // Next month padding to fill out 42 grids (6 weeks)
  const remainingCells = 42 - daysGrid.length;
  for (let n = 1; n <= remainingCells; n++) {
    daysGrid.push({
      day: n,
      isCurrentMonth: false,
      date: new Date(year, month + 1, n)
    });
  }

  const formatDateStr = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const selectedDateStr = formatDateStr(selectedDate);
  const selectedDayEvents = events.filter(e => e.date === selectedDateStr);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    addEvent(selectedDateStr, newEventTitle, newEventType);
    setNewEventTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 shadow-xl">
      {/* Header control */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-zinc-950 text-zinc-400 hover:text-zinc-100 transition-colors shadow-inner cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-semibold text-sm flex items-center gap-2 text-zinc-150">
          <Calendar className="w-4 h-4 text-accent" />
          {monthNames[month]} {year}
        </span>

        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-zinc-950 text-zinc-400 hover:text-zinc-100 transition-colors shadow-inner cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekdays names */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
        <span>Su</span>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysGrid.map((cell, idx) => {
          const dateStr = formatDateStr(cell.date);
          const hasEvents = events.some(e => e.date === dateStr);
          const isSelected = selectedDate.getDate() === cell.date.getDate() &&
                             selectedDate.getMonth() === cell.date.getMonth() &&
                             selectedDate.getFullYear() === cell.date.getFullYear();
          
          let dayClasses = "h-9 w-9 mx-auto rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer text-xs ";
          
          if (!cell.isCurrentMonth) {
            dayClasses += "text-zinc-700 ";
          } else if (isSelected) {
            dayClasses += "bg-accent-dark text-white font-bold shadow-lg shadow-accent-darker/20 scale-105 ";
          } else if (cell.date.getDate() === 5 && cell.date.getMonth() === 3 && cell.date.getFullYear() === 2024) {
            // Highlights current mockup "Friday, April 5" in subtle way if not selected
            dayClasses += "bg-accent-dark/10 text-accent font-bold ";
          } else {
            dayClasses += "text-zinc-350 hover:bg-zinc-950 hover:text-white ";
          }

          // Gather dots for events
          const dayEvents = events.filter(e => e.date === dateStr);
          const incomplete = dayEvents.some(e => !e.completed);

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(cell.date)}
              className={dayClasses}
            >
              <span>{cell.day}</span>
              {hasEvents && !isSelected && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${incomplete ? 'bg-accent' : 'bg-emerald-500'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Agenda Drawer */}
      <div className="mt-5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Agenda: {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
          </h4>
          <button
            onClick={() => setShowAddModal(prev => !prev)}
            className="flex items-center gap-1 text-[11px] text-accent font-bold hover:text-accent-light font-mono transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add Event
          </button>
        </div>

        {/* Quick Add Form nested */}
        {showAddModal && (
          <form onSubmit={handleCreateEvent} className="bg-zinc-950 p-3 rounded-xl mb-3 space-y-2">
            <input
              type="text"
              placeholder="Title (e.g. Code Review)"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-md bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent-dark text-zinc-100 placeholder-zinc-650"
              required
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setNewEventType('session')}
                  className={`text-[11px] px-2 py-0.5 rounded cursor-pointer ${
                    newEventType === 'session' 
                      ? 'bg-accent-darker text-white font-bold' 
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Session
                </button>
                <button
                  type="button"
                  onClick={() => setNewEventType('assignment')}
                  className={`text-[11px] px-2 py-0.5 rounded cursor-pointer ${
                    newEventType === 'assignment' 
                      ? 'bg-accent-darker text-white font-bold' 
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Deadline
                </button>
              </div>
              <button
                type="submit"
                className="bg-accent-dark hover:bg-accent-dark text-white px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {selectedDayEvents.length === 0 ? (
          <p className="text-xs text-zinc-500 italic text-center py-2">No learning events scheduled for this day.</p>
        ) : (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                  event.completed
                    ? 'bg-emerald-950/20 text-emerald-500/80 line-through'
                    : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-200 cursor-pointer'
                }`}
                onClick={() => toggleEventCompletion(event.id)}
              >
                <div className="flex items-center gap-2 max-w-[80%]">
                  {event.completed ? (
                    <span className="text-emerald-400 font-bold font-mono">✓</span>
                  ) : (
                    <span className="w-1.5 h-1.5 bg-accent-dark rounded-full shrink-0" />
                  )}
                  <span className={`font-semibold truncate text-[11px] ${event.completed ? 'opacity-40' : 'text-zinc-200'}`}>
                    {event.title}
                  </span>
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md font-mono ${
                  event.type === 'session' 
                    ? 'bg-accent-dark/10 text-accent' 
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
