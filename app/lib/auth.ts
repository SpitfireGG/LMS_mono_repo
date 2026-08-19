"use client";

import { useSyncExternalStore } from "react";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
  isEmailVerified?: boolean;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

const STORAGE_KEY = "nea.session";

let cached: Session | null | undefined;
const listeners = new Set<() => void>();

function read(): Session | null {
  if (typeof window === "undefined") return null;
  if (cached !== undefined) return cached;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    cached = null;
  }
  return cached;
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getSession(): Session | null {
  return read();
}

export function getAccessToken(): string | null {
  return read()?.accessToken ?? null;
}

export function setSession(session: Session): void {
  cached = session;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Private-mode browsers: the session simply stays in memory for this tab.
  }
  emit();
}

/** Swaps in freshly-rotated tokens without touching the cached user. */
export function updateTokens(accessToken: string, refreshToken: string): void {
  const current = read();
  if (!current) return;
  setSession({ ...current, accessToken, refreshToken });
}

export function clearSession(): void {
  cached = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Keep tabs in sync when one of them logs in or out.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cached = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Reactive view of the stored session. `undefined` while hydrating. */
export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession, () => null);
}

export function useIsAuthenticated(): boolean {
  return !!useSession();
}
