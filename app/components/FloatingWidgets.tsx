"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Non-critical overlays — code-split and loaded on browser idle so they never
// compete with the initial page render or hydration.
const NoticeBoard = dynamic(() => import("./NoticeBoard"), { ssr: false });
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export default function FloatingWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;

  return (
    <>
      <NoticeBoard />
      <ChatWidget />
    </>
  );
}
