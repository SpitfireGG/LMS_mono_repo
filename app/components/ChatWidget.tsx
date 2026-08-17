"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

type Msg = { from: "bot" | "user"; text: string };

const quickReplies = [
  "Course info",
  "Pricing & discounts",
  "Book a consultation",
  "NAATI CCL help",
];

const cannedReply =
  "Thanks for reaching out! 🌱 A learning advisor will jump in shortly. Meanwhile, you can book a free consultation or browse our courses — anything specific I can point you to?";

function BotIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="4" y="7" width="16" height="12" rx="4" fill="currentColor" />
      <circle cx="9.5" cy="13" r="1.6" fill="#0a4a29" />
      <circle cx="14.5" cy="13" r="1.6" fill="#0a4a29" />
      <path d="M12 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="2.5" r="1.6" fill="currentColor" />
      <path d="M2.5 12v2M21.5 12v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hi there! 👋 I'm the NAATI Excellence assistant. How can I help you learn today?",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: "user", text: value }]);
    setInput("");
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: cannedReply }]);
    }, 650);
  };

  return (
    <>
      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Chat with NAATI Excellence"
        aria-hidden={!open}
        className={cn(
          "fixed right-[22px] bottom-[96px] z-[75] flex w-[370px] max-w-[calc(100vw-44px)] flex-col overflow-hidden",
          "rounded-[24px] border border-[#dbe6dd] bg-white shadow-[var(--shadow-lift)] origin-bottom-right",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-br from-[#0a4a29] to-[#056839] px-[18px] py-[16px]">
          <div className="flex items-center gap-[12px]">
            <span className="relative grid h-[42px] w-[42px] place-items-center rounded-full bg-white/15 text-white">
              <BotIcon className="h-[24px] w-[24px]" />
              <span className="absolute -right-[1px] -bottom-[1px] h-[12px] w-[12px] rounded-full bg-[#50bc7e] ring-2 ring-[#0a4a29]" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-white">NAATI Assistant</p>
              <p className="flex items-center gap-[5px] text-[12px] text-white/70">
                <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#50bc7e]" />
                Online · replies in a minute
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="grid h-[30px] w-[30px] place-items-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex max-h-[46vh] min-h-[190px] flex-col gap-[12px] overflow-y-auto bg-[#f7faf6] p-[16px]"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                m.from === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[82%] rounded-[16px] px-[14px] py-[10px] text-[14px]/[1.5]",
                  m.from === "user"
                    ? "rounded-br-[4px] bg-[#0a4a29] text-white"
                    : "rounded-bl-[4px] border border-[#e2ede6] bg-white text-[#3f4f45]"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-[7px] border-t border-[#e6efe8] px-[14px] pt-[12px]">
          {quickReplies.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-[#cfe3d6] bg-white px-[12px] py-[6px] text-[12.5px] font-medium text-[#056839] transition-colors hover:bg-[#e8f6ee] cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-[8px] p-[14px]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            aria-label="Message"
            className="flex-1 rounded-full border border-[#dbe6dd] bg-white px-[16px] py-[11px] text-[14px] text-[#0a4a29] placeholder:text-[#8a988e] focus:border-[#50bc7e] focus:outline-none focus:ring-2 focus:ring-[#50bc7e]/30"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#0a4a29] text-white transition-colors hover:bg-[#056839] cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className={cn(
          "group fixed right-[22px] bottom-[24px] z-[75] grid h-[60px] w-[60px] place-items-center rounded-full",
          "bg-gradient-to-br from-[#0a4a29] to-[#056839] text-white shadow-[var(--shadow-lift)]",
          "transition-transform duration-300 hover:scale-105 cursor-pointer"
        )}
      >
        {!open && (
          <span className="chat-pulse absolute inset-0 rounded-full bg-[#50bc7e]/40" />
        )}
        <span className="relative">
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v7a2.5 2.5 0 01-2.5 2.5H9l-4 3.5V15H6.5A2.5 2.5 0 014 12.5v-7Z"
                fill="currentColor"
              />
              <circle cx="9" cy="9" r="1.25" fill="#0a4a29" />
              <circle cx="12" cy="9" r="1.25" fill="#0a4a29" />
              <circle cx="15" cy="9" r="1.25" fill="#0a4a29" />
            </svg>
          )}
        </span>
        {!open && (
          <span className="absolute -right-[1px] -top-[1px] h-[15px] w-[15px] rounded-full bg-[#f5a623] ring-2 ring-white" />
        )}
      </button>
    </>
  );
}
