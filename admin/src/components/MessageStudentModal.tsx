import { useState } from "react";
import {
  Send,
  Paperclip,
  AtSign,
  Smile,
  Image,
} from "lucide-react";
import Modal from "./Modal";
import { FormField, TextareaInput } from "./FormField";

interface MessageStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentEmail: string;
}

const quickReplies = [
  "Great work on your recent submission!",
  "Please see me during office hours.",
  "Your grade has been updated.",
  "Don't forget the upcoming deadline.",
  "Keep up the good work!",
];

export default function MessageStudentModal({
  isOpen,
  onClose,
  studentName,
  studentEmail,
}: MessageStudentModalProps) {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("normal");
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onClose();
      setMessage("");
      setSubject("");
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Message ${studentName}`}
      subtitle={studentEmail}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* To Field */}
        <div className="flex items-center gap-3 bg-zinc-950 rounded-xl px-4 py-3 border border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-accent">
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-200">{studentName}</p>
            <p className="text-[10px] text-zinc-500 font-mono">{studentEmail}</p>
          </div>
        </div>

        {/* Subject */}
        <FormField label="Subject" htmlFor="msgSubject">
          <input
            id="msgSubject"
            type="text"
            placeholder="e.g. Grade Feedback — User Research Report"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-accent-dark/50 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all"
          />
        </FormField>

        {/* Priority */}
        <FormField label="Priority" htmlFor="msgPriority">
          <div className="flex gap-2">
            {["low", "normal", "high"].map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  priority === p
                    ? p === "high"
                      ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
                      : p === "normal"
                        ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                        : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"
                    : "bg-zinc-800 text-zinc-500 hover:bg-zinc-750 hover:text-zinc-300"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </FormField>

        {/* Quick Replies */}
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Quick Replies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => setMessage(qr)}
                className="text-[10px] font-bold text-zinc-500 bg-zinc-800 hover:bg-zinc-750 hover:text-zinc-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                {qr.length > 35 ? qr.slice(0, 35) + "..." : qr}
              </button>
            ))}
          </div>
        </div>

        {/* Message Body */}
        <FormField label="Message" htmlFor="msgBody">
          <TextareaInput
            id="msgBody"
            placeholder="Type your message here..."
            value={message}
            onChange={setMessage}
            rows={5}
          />
        </FormField>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer" title="Attach File">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer" title="Insert Image">
              <Image className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer" title="Mention">
              <AtSign className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer" title="Emoji">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-accent-dark hover:bg-accent-dark text-white transition-all shadow-lg shadow-accent-dark/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
