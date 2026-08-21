import { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Send, Users, Pin, Paperclip,
  X, Image, Code, BarChart3, Megaphone, ArrowLeft, Copy, MessageSquare,
  Crown, Shield
} from 'lucide-react';

type UserRole = 'teacher' | 'ta' | 'student';

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  online: boolean;
}

interface ChatMessage {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'announcement' | 'code' | 'file' | 'poll';
  pinned: boolean;
  reactions?: { emoji: string; count: number }[];
  replyTo?: string;
  fileName?: string;
  codeLang?: string;
  pollOptions?: { label: string; votes: number }[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'class' | 'group';
  description: string;
  members: string[];
  unread: number;
  lastMessage: string;
  lastTime: string;
  icon: string;
  createdBy: string;
}

const CURRENT_USER: Member = {
  id: 'u-self',
  name: 'Robert Dorwart',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArAou6iI9lCdu2f4jqV8A1B6fJ1kxd3rCFvxYA_q0ONX0TiF4pVxUKb13jEyIUrPbYeD9lzsnGKJRAz-_UbAFbhtOo7FDcQrnC_3rKqYgWEehvjSyPGzSTpXse_-fCoVzHicTXuZJBiEkkVyAX7uE8jBPBIQZrT3WRfBGOCONJArYFLv5ej7tN8zmcaUPfTNNJu8FW7abqhYCUbTllxZr0xO8ySVdLQZ4oQQO9XDM-JzE2haJsoV1H2UISH4M6wrpvzVNX86LiK9QP',
  role: 'student',
  online: true,
};

const ALL_MEMBERS: Member[] = [
  CURRENT_USER,
  { id: 'u1', name: 'Prof. Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', role: 'teacher', online: true },
  { id: 'u2', name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150', role: 'ta', online: true },
  { id: 'u3', name: 'Emma Collins', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150', role: 'teacher', online: false },
  { id: 'u4', name: 'Dr. Alan Turing', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150', role: 'teacher', online: true },
  { id: 'u5', name: 'Aisha Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150', role: 'student', online: true },
  { id: 'u6', name: 'Marcus Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150', role: 'student', online: false },
  { id: 'u7', name: 'Lena Kowalski', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150', role: 'student', online: true },
  { id: 'u8', name: 'Tom Nguyen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', role: 'student', online: false },
  { id: 'u9', name: 'Sofia Rossi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150', role: 'student', online: true },
];

const INITIAL_ROOMS: ChatRoom[] = [
  { id: 'r1', name: 'UX Design — Section A', type: 'class', description: 'Foundations of UX Design. Prof. Sarah Jenkins', members: ['u-self', 'u1', 'u2', 'u5', 'u7', 'u9'], unread: 3, lastMessage: 'Don\'t forget: wireframe due Friday!', lastTime: '2m ago', icon: '🎨', createdBy: 'u1' },
  { id: 'r2', name: 'Data Structures & Algorithms', type: 'class', description: 'Advanced topics in CS. Dr. Alan Turing', members: ['u-self', 'u4', 'u5', 'u6', 'u8'], unread: 0, lastMessage: 'Graph traversal homework posted', lastTime: '1h ago', icon: '🧮', createdBy: 'u4' },
  { id: 'r3', name: 'Web Architecture', type: 'class', description: 'Advanced Web Architecture. Emma Collins', members: ['u-self', 'u3', 'u2', 'u7'], unread: 1, lastMessage: 'New resource: System design diagram', lastTime: '3h ago', icon: '🌐', createdBy: 'u3' },
  { id: 'r4', name: 'UX Study Group', type: 'group', description: 'Student-led study group for UX course', members: ['u-self', 'u5', 'u7', 'u9'], unread: 5, lastMessage: 'Who\'s free for a session tomorrow?', lastTime: '10m ago', icon: '📚', createdBy: 'u-self' },
  { id: 'r5', name: 'Algorithm Peers', type: 'group', description: 'Peer study group for algorithms', members: ['u-self', 'u6', 'u8', 'u5'], unread: 0, lastMessage: 'Thanks for the explanation!', lastTime: '2d ago', icon: '🤝', createdBy: 'u6' },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'r1': [
    { id: 'm1', authorId: 'u1', text: '📢 Welcome to Module 4: Wireframing & Prototyping! Please review chapters 3 and 4 before our live session on Thursday.', timestamp: 'Mon 9:00 AM', type: 'announcement', pinned: true, reactions: [{ emoji: '👍', count: 8 }, { emoji: '🎯', count: 3 }] },
    { id: 'm2', authorId: 'u2', text: 'I\'ve uploaded the Figma template for the wireframe project. Check the materials section.', timestamp: 'Mon 10:30 AM', type: 'text', pinned: false, reactions: [{ emoji: '🙏', count: 5 }] },
    { id: 'm3', authorId: 'u5', text: 'Is the wireframe submission individual or group-based?', timestamp: 'Mon 11:15 AM', type: 'text', pinned: false },
    { id: 'm4', authorId: 'u1', text: 'Individual submission, but you can discuss approaches in your study groups!', timestamp: 'Mon 11:20 AM', type: 'text', pinned: false, reactions: [{ emoji: '✅', count: 4 }] },
    { id: 'm5', authorId: 'u9', text: 'Here\'s a useful resource on wireframe best practices:', timestamp: 'Tue 2:00 PM', type: 'file', pinned: false, fileName: 'wireframe-best-practices.pdf' },
    { id: 'm6', authorId: 'u7', text: 'Can someone share their approach to the navigation flow?', timestamp: 'Wed 4:30 PM', type: 'text', pinned: false },
    { id: 'm7', authorId: 'u2', text: '📊 Quick poll: Which prototyping tool do you prefer?', timestamp: 'Thu 10:00 AM', type: 'poll', pinned: true, pollOptions: [{ label: 'Figma', votes: 6 }, { label: 'Adobe XD', votes: 2 }, { label: 'Sketch', votes: 1 }, { label: 'InVision', votes: 3 }] },
    { id: 'm8', authorId: 'u1', text: '⚡ Reminder: Wireframe draft is due this Friday at 11:59 PM. Submit via the assignments portal.', timestamp: 'Fri 8:00 AM', type: 'announcement', pinned: true },
  ],
  'r2': [
    { id: 'm10', authorId: 'u4', text: '📢 This week we\'re covering Graph Traversal algorithms — BFS and DFS. Make sure you\'ve completed the prerequisite reading.', timestamp: 'Mon 8:00 AM', type: 'announcement', pinned: true },
    { id: 'm11', authorId: 'u4', text: 'Here\'s the BFS implementation in TypeScript:', timestamp: 'Mon 10:00 AM', type: 'code', pinned: false, codeLang: 'typescript' },
    { id: 'm12', authorId: 'u6', text: 'Can we get an extra example for DFS with weighted graphs?', timestamp: 'Tue 1:00 PM', type: 'text', pinned: false },
    { id: 'm13', authorId: 'u4', text: 'Homework 3: Graph Traversal has been posted. Due Oct 10.', timestamp: 'Wed 9:00 AM', type: 'announcement', pinned: true },
  ],
  'r3': [
    { id: 'm20', authorId: 'u3', text: '📢 Welcome to Advanced Web Architecture. This module covers microservices patterns.', timestamp: 'Mon 9:00 AM', type: 'announcement', pinned: true },
    { id: 'm21', authorId: 'u2', text: 'I\'ve shared the system design diagram template in the materials.', timestamp: 'Tue 3:00 PM', type: 'text', pinned: false },
  ],
  'r4': [
    { id: 'm30', authorId: 'u5', text: 'Hey everyone! Shall we meet tomorrow at 3 PM for a UX review session?', timestamp: 'Thu 1:00 PM', type: 'text', pinned: false, reactions: [{ emoji: '👍', count: 3 }] },
    { id: 'm31', authorId: 'u9', text: 'I\'m in! I\'ll prepare some wireframe examples to discuss.', timestamp: 'Thu 1:15 PM', type: 'text', pinned: false },
    { id: 'm32', authorId: 'u7', text: 'Perfect. Let\'s also review the color theory notes.', timestamp: 'Thu 1:30 PM', type: 'text', pinned: false },
    { id: 'm33', authorId: 'u-self', text: 'Count me in! I have some questions about the interaction patterns.', timestamp: 'Thu 2:00 PM', type: 'text', pinned: false },
    { id: 'm34', authorId: 'u5', text: 'Great! Here\'s the agenda I put together:', timestamp: 'Thu 2:30 PM', type: 'file', pinned: true, fileName: 'study-session-agenda.md' },
  ],
  'r5': [
    { id: 'm40', authorId: 'u6', text: 'Just figured out a clean way to explain Dijkstra\'s algorithm. Want me to share?', timestamp: 'Tue 8:00 PM', type: 'text', pinned: false },
    { id: 'm41', authorId: 'u8', text: 'Yes please! That would be super helpful.', timestamp: 'Tue 8:05 PM', type: 'text', pinned: false },
    { id: 'm42', authorId: 'u6', text: 'Thanks for the explanation! It finally clicked.', timestamp: 'Wed 10:00 AM', type: 'text', pinned: false, reactions: [{ emoji: '🎉', count: 2 }] },
  ],
};

function getMember(id: string): Member {
  return ALL_MEMBERS.find(m => m.id === id) || ALL_MEMBERS[0];
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === 'teacher') return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 flex items-center gap-0.5"><Crown className="w-2.5 h-2.5" /> Teacher</span>;
  if (role === 'ta') return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 flex items-center gap-0.5"><Shield className="w-2.5 h-2.5" /> TA</span>;
  return null;
}

export default function MessagesView() {
  const [activeRoomId, setActiveRoomId] = useState<string | null>('r1');
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMembers, setShowMembers] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomType, setNewRoomType] = useState<'class' | 'group'>('group');
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const activeMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const activeMembers = activeRoom ? activeRoom.members.map(getMember) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  // Simulate typing indicator
  useEffect(() => {
    if (!activeRoomId) return;
    const interval = setInterval(() => {
      const room = rooms.find(r => r.id === activeRoomId);
      if (!room) return;
      const others = room.members.filter(id => id !== 'u-self');
      if (Math.random() > 0.7 && others.length > 0) {
        const typer = others[Math.floor(Math.random() * others.length)];
        setTypingUsers([typer]);
        setTimeout(() => setTypingUsers([]), 2500);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [activeRoomId, rooms]);

  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = () => {
    if (!inputText.trim() || !activeRoomId) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      authorId: 'u-self',
      text: inputText,
      timestamp: 'Just now',
      type: 'text',
      pinned: false,
    };
    setMessages(prev => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg],
    }));
    setRooms(prev => prev.map(r =>
      r.id === activeRoomId ? { ...r, lastMessage: inputText, lastTime: 'Just now' } : r
    ));
    setInputText('');
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom: ChatRoom = {
      id: `r-${Date.now()}`,
      name: newRoomName,
      type: newRoomType,
      description: newRoomDesc || `Created by ${CURRENT_USER.name}`,
      members: ['u-self'],
      unread: 0,
      lastMessage: 'Room created',
      lastTime: 'Just now',
      icon: newRoomType === 'class' ? '📖' : '💬',
      createdBy: 'u-self',
    };
    setRooms(prev => [newRoom, ...prev]);
    setMessages(prev => ({ ...prev, [newRoom.id]: [] }));
    setActiveRoomId(newRoom.id);
    setShowCreateModal(false);
    setNewRoomName('');
    setNewRoomDesc('');
  };

  const togglePin = (msgId: string) => {
    if (!activeRoomId) return;
    setMessages(prev => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map(m =>
        m.id === msgId ? { ...m, pinned: !m.pinned } : m
      ),
    }));
  };

  const addReaction = (msgId: string, emoji: string) => {
    if (!activeRoomId) return;
    setMessages(prev => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map(m => {
        if (m.id !== msgId) return m;
        const existing = m.reactions?.find(r => r.emoji === emoji);
        if (existing) {
          return { ...m, reactions: m.reactions!.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) };
        }
        return { ...m, reactions: [...(m.reactions || []), { emoji, count: 1 }] };
      }),
    }));
  };

  const votePoll = (msgId: string, optionIdx: number) => {
    if (!activeRoomId) return;
    setMessages(prev => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map(m => {
        if (m.id !== msgId || !m.pollOptions) return m;
        return { ...m, pollOptions: m.pollOptions.map((o, i) => i === optionIdx ? { ...o, votes: o.votes + 1 } : o) };
      }),
    }));
  };

  const pinnedMessages = activeMessages.filter(m => m.pinned);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 text-left rounded-2xl overflow-hidden border border-zinc-800">

      {/* ── Left: Room List ── */}
      <div className={`${showMobileSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-[340px] flex-col bg-zinc-900 border-r border-zinc-800 shrink-0`}>
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-base text-zinc-100">Chats</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-8 h-8 rounded-lg bg-accent-dark/15 text-accent flex items-center justify-center hover:bg-accent-dark/25 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-dark/30 text-zinc-200 placeholder-zinc-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredRooms.map((room) => {
            const lastMsgAuthor = room.lastMessage ? getMember(room.members[1] || 'u1') : null;
            return (
              <button
                key={room.id}
                onClick={() => { setActiveRoomId(room.id); setShowMobileSidebar(false); setShowRoomInfo(false); }}
                className={`w-full p-3.5 flex items-start gap-3 transition-colors cursor-pointer border-b border-zinc-800/40 ${
                  activeRoomId === room.id ? 'bg-accent-dark/10 border-l-2 border-l-accent-dark' : 'hover:bg-zinc-800/40 border-l-2 border-l-transparent'
                }`}
              >
                <span className="text-xl mt-0.5 shrink-0">{room.icon}</span>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-bold truncate ${room.unread > 0 ? 'text-zinc-100' : 'text-zinc-300'}`}>
                      {room.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">{room.lastTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 font-bold uppercase">{room.type === 'class' ? 'class' : 'group'}</span>
                    <span className="text-xs text-zinc-500 truncate">{room.lastMessage}</span>
                  </div>
                </div>
                {room.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent-dark text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {room.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Middle: Chat Area ── */}
      {activeRoom ? (
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
          {/* Chat Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setShowMobileSidebar(true)} className="md:hidden text-zinc-400 hover:text-zinc-200 cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-lg">{activeRoom.icon}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">{activeRoom.name}</h3>
                <p className="text-[10px] text-zinc-500 truncate">{activeRoom.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {pinnedMessages.length > 0 && (
                <button className="relative p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
                  <Pin className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-dark text-white text-[8px] font-bold flex items-center justify-center">
                    {pinnedMessages.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => { setShowRoomInfo(!showRoomInfo); setShowMembers(!showMembers); }}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${showMembers ? 'bg-accent-dark/15 text-accent' : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pinned Banner */}
          {pinnedMessages.length > 0 && showRoomInfo && (
            <div className="px-4 py-3 bg-accent-dark/5 border-b border-zinc-800 space-y-2">
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned Messages</p>
              {pinnedMessages.map(pm => {
                const author = getMember(pm.authorId);
                return (
                  <div key={pm.id} className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/60">
                    <img src={author.avatar} alt={author.name} className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-zinc-300">{author.name}</p>
                      <p className="text-xs text-zinc-400 line-clamp-1">{pm.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {activeMessages.map((msg, idx) => {
              const author = getMember(msg.authorId);
              const isSelf = msg.authorId === 'u-self';
              const isTeacher = author.role === 'teacher' || author.role === 'ta';
              const showAvatar = idx === 0 || activeMessages[idx - 1].authorId !== msg.authorId;

              if (msg.type === 'announcement') {
                return (
                  <div key={msg.id} className="my-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                    <div className="flex items-center gap-2 mb-2">
                      <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Announcement</span>
                      {msg.pinned && <Pin className="w-3 h-3 text-accent" />}
                      <span className="text-[10px] text-zinc-500 ml-auto font-mono">{msg.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <img src={author.avatar} alt={author.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-xs font-bold text-zinc-200">{author.name}</span>
                      <RoleBadge role={author.role} />
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed">{msg.text.replace(/📢 /g, '').replace(/⚡ /g, '')}</p>
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {msg.reactions.map((r, i) => (
                          <button key={i} onClick={() => addReaction(msg.id, r.emoji)} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs cursor-pointer transition-colors">
                            <span>{r.emoji}</span>
                            <span className="text-[10px] font-bold text-zinc-400">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (msg.type === 'code') {
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isSelf ? 'flex-row-reverse' : ''} ${!showAvatar ? (isSelf ? 'mr-9' : 'ml-9') : 'mt-4'}`}>
                    {showAvatar && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />}
                    <div className={`max-w-[75%] min-w-0 ${isSelf ? 'items-end' : ''}`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-1.5 mb-1 ${isSelf ? 'justify-end' : ''}`}>
                          <span className="text-xs font-bold text-zinc-300">{author.name}</span>
                          <RoleBadge role={author.role} />
                          <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>
                        </div>
                      )}
                      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <div className="px-3 py-1.5 bg-zinc-800 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">{msg.codeLang || 'code'}</span>
                          <button className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer flex items-center gap-0.5"><Copy className="w-3 h-3" /> Copy</button>
                        </div>
                        <pre className="p-3 text-xs text-zinc-300 font-mono overflow-x-auto">
                          <code>{`// BFS Implementation
function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'file') {
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isSelf ? 'flex-row-reverse' : ''} ${!showAvatar ? (isSelf ? 'mr-9' : 'ml-9') : 'mt-4'}`}>
                    {showAvatar && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />}
                    <div className={`max-w-[75%] min-w-0 ${isSelf ? 'items-end' : ''}`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-1.5 mb-1 ${isSelf ? 'justify-end' : ''}`}>
                          <span className="text-xs font-bold text-zinc-300">{author.name}</span>
                          <RoleBadge role={author.role} />
                          <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>
                        </div>
                      )}
                      {msg.text && <p className={`text-sm text-zinc-300 mb-1.5 ${isSelf ? 'text-right' : ''}`}>{msg.text}</p>}
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                        <Paperclip className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-xs font-semibold text-zinc-300 truncate">{msg.fileName}</span>
                        <button className="ml-auto text-[10px] font-bold text-accent hover:text-accent-light cursor-pointer shrink-0">Download</button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'poll') {
                const totalVotes = msg.pollOptions?.reduce((sum, o) => sum + o.votes, 0) || 0;
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isSelf ? 'flex-row-reverse' : ''} ${!showAvatar ? (isSelf ? 'mr-9' : 'ml-9') : 'mt-4'}`}>
                    {showAvatar && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />}
                    <div className={`max-w-[75%] min-w-0 ${isSelf ? 'items-end' : ''}`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-1.5 mb-1 ${isSelf ? 'justify-end' : ''}`}>
                          <span className="text-xs font-bold text-zinc-300">{author.name}</span>
                          <RoleBadge role={author.role} />
                          <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>
                        </div>
                      )}
                      {msg.text && <p className={`text-sm text-zinc-300 mb-1.5`}>{msg.text.replace('📊 Quick poll: ', '')}</p>}
                      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 space-y-2">
                        <div className="flex items-center gap-1.5 mb-2">
                          <BarChart3 className="w-3.5 h-3.5 text-accent" />
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">{totalVotes} votes</span>
                        </div>
                        {msg.pollOptions?.map((opt, i) => {
                          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          return (
                            <button key={i} onClick={() => votePoll(msg.id, i)} className="w-full relative rounded-lg overflow-hidden cursor-pointer group">
                              <div className="absolute inset-0 bg-accent-dark/20 transition-all" style={{ width: `${pct}%` }} />
                              <div className="relative flex items-center justify-between px-3 py-2">
                                <span className="text-xs font-semibold text-zinc-200">{opt.label}</span>
                                <span className="text-[10px] font-bold text-zinc-400">{opt.votes} ({pct}%)</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Regular text message
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isSelf ? 'flex-row-reverse' : ''} ${!showAvatar ? (isSelf ? 'mr-9' : 'ml-9') : 'mt-4'}`}>
                  {showAvatar && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />}
                  <div className={`max-w-[75%] min-w-0 ${isSelf ? 'text-right' : ''}`}>
                    {showAvatar && (
                      <div className={`flex items-center gap-1.5 mb-1 ${isSelf ? 'justify-end' : ''}`}>
                        <span className="text-xs font-bold text-zinc-300">{author.name}</span>
                        <RoleBadge role={author.role} />
                        <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>
                      </div>
                    )}
                    <div className={`group relative inline-block px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                      isSelf
                        ? 'bg-accent-dark text-white rounded-br-md'
                        : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-md'
                    }`}>
                      {msg.text}
                      <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ${isSelf ? '-left-20' : '-right-20'}`}>
                        <button onClick={() => addReaction(msg.id, '👍')} className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-[10px] cursor-pointer">👍</button>
                        <button onClick={() => togglePin(msg.id)} className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer">
                          <Pin className={`w-2.5 h-2.5 ${msg.pinned ? 'text-accent' : 'text-zinc-400'}`} />
                        </button>
                      </div>
                    </div>
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={`flex gap-1 mt-1 ${isSelf ? 'justify-end' : ''}`}>
                        {msg.reactions.map((r, i) => (
                          <button key={i} onClick={() => addReaction(msg.id, r.emoji)} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-[10px] cursor-pointer transition-colors">
                            <span>{r.emoji}</span>
                            <span className="font-bold text-zinc-400">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 mt-2 ml-10">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] text-zinc-500">{getMember(typingUsers[0]).name} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 backdrop-blur-md">
            <div className="flex items-end gap-2 bg-zinc-950 border border-zinc-800 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-accent-dark/30 focus-within:border-accent-dark/50 transition-all">
              <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0 mb-0.5">
                <Plus className="w-4 h-4" />
              </button>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Message ${activeRoom.name}...`}
                rows={1}
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none resize-none py-1 max-h-24 min-h-[28px]"
              />
              <div className="flex items-center gap-0.5 shrink-0 mb-0.5">
                <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  <Code className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={`p-2 rounded-xl transition-all cursor-pointer ml-1 ${
                    inputText.trim()
                      ? 'bg-accent-dark text-white shadow-lg shadow-accent-dark/20 hover:bg-accent-darker'
                      : 'bg-zinc-800 text-zinc-600'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-950">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-zinc-700" />
          </div>
          <h3 className="text-lg font-bold text-zinc-300">Select a chat</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-xs">Choose a class or group from the sidebar to start messaging.</p>
        </div>
      )}

      {/* ── Right: Members Panel ── */}
      {showMembers && activeRoom && (
        <div className="hidden lg:flex w-60 flex-col bg-zinc-900 border-l border-zinc-800 shrink-0">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Members — {activeMembers.length}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
            {/* Online */}
            {activeMembers.filter(m => m.online).length > 0 && (
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 py-2">
                Online — {activeMembers.filter(m => m.online).length}
              </p>
            )}
            {activeMembers.filter(m => m.online).map((member) => (
              <div key={member.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <div className="relative shrink-0">
                  <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{member.name}</p>
                  <RoleBadge role={member.role} />
                </div>
              </div>
            ))}
            {/* Offline */}
            {activeMembers.filter(m => !m.online).length > 0 && (
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 py-2 mt-2">
                Offline — {activeMembers.filter(m => !m.online).length}
              </p>
            )}
            {activeMembers.filter(m => !m.online).map((member) => (
              <div key={member.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors opacity-50">
                <div className="relative shrink-0">
                  <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-zinc-600 border-2 border-zinc-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-zinc-400 truncate">{member.name}</p>
                  <RoleBadge role={member.role} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create Room Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-base text-zinc-100">Create New Chat</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setNewRoomType('class')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    newRoomType === 'class' ? 'bg-accent-dark/15 text-accent border border-accent-dark/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  📖 Class Chat
                </button>
                <button
                  onClick={() => setNewRoomType('group')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    newRoomType === 'group' ? 'bg-accent-dark/15 text-accent border border-accent-dark/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  💬 Study Group
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder={newRoomType === 'class' ? 'e.g. UX Design — Section B' : 'e.g. Weekend Study Crew'}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Description (optional)</label>
                <input
                  type="text"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="What is this chat about?"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/30 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-all cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName.trim()}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    newRoomName.trim() ? 'bg-accent-dark text-white shadow-lg shadow-accent-dark/20 hover:bg-accent-darker' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  Create Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
