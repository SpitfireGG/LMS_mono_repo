"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { authApi } from "@/app/lib/api/client";

type Mode = "login" | "signup";

function GoogleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.06H2.18a11 11 0 000 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a4a29" aria-hidden>
      <path d="M16.37 12.6c-.03-2.62 2.14-3.88 2.24-3.94-1.22-1.79-3.12-2.03-3.8-2.06-1.62-.16-3.16.95-3.98.95-.82 0-2.09-.93-3.44-.9-1.77.02-3.4 1.03-4.31 2.61-1.84 3.19-.47 7.9 1.32 10.49.87 1.27 1.91 2.69 3.27 2.64 1.31-.05 1.81-.85 3.4-.85 1.58 0 2.03.85 3.42.82 1.41-.02 2.31-1.29 3.17-2.56.99-1.46 1.4-2.88 1.42-2.95-.03-.01-2.72-1.04-2.75-4.14M13.9 4.9c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.05-1.45" />
    </svg>
  );
}
function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon,
  value,
  onChange,
  right,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  right?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-[7px] block text-[13.5px] font-medium text-[#0a4a29]">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#8a988e]">{icon}</span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-[13px] border border-[#dbe6dd] bg-white py-[13px] pl-[44px] text-[15px] text-[#0a4a29] placeholder:text-[#8a988e]",
            "focus:border-[#50bc7e] focus:outline-none focus:ring-2 focus:ring-[#50bc7e]/30 transition-colors",
            right ? "pr-[46px]" : "pr-[15px]"
          )}
        />
        {right && <span className="absolute right-[8px] top-1/2 -translate-y-1/2">{right}</span>}
      </div>
    </div>
  );
}

const MailIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2.5" /><path d="M3 6l9 7 9-7" /></svg>
);
const LockIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
);
const UserIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" /></svg>
);

function strengthOf(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}
const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["#c0603e", "#c0603e", "#e0a52e", "#50bc7e", "#056839"];

export default function AuthForm({ mode }: { mode: Mode }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => strengthOf(password), [password]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (!isLogin) {
      if (!name.trim()) return setError("Please enter your name.");
      if (password !== confirm) return setError("Passwords don't match.");
      if (!agree) return setError("Please accept the terms to continue.");
    }
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await authApi.login(email, password);
      } else {
        await authApi.signup(name, email, password);
      }
      router.push("/courses");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-[30px] max-sm:text-[26px] font-medium tracking-[-0.02em] text-[#0a4a29]">
        {isLogin ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-[8px] text-[15px] text-[#566b5d]">
        {isLogin ? (
          <>
            New to NAATI Excellence?{" "}
            <Link href="/signup" className="font-medium text-[#056839] hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#056839] hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>

      {/* Social */}
      <div className="mt-[26px] grid grid-cols-2 gap-[12px]">
        <button type="button" className="flex items-center justify-center gap-[9px] rounded-[13px] border border-[#dbe6dd] bg-white py-[12px] text-[14.5px] font-medium text-[#0a4a29] transition-colors hover:bg-[#f2f8f4] cursor-pointer">
          <GoogleIcon /> Google
        </button>
        <button type="button" className="flex items-center justify-center gap-[9px] rounded-[13px] border border-[#dbe6dd] bg-white py-[12px] text-[14.5px] font-medium text-[#0a4a29] transition-colors hover:bg-[#f2f8f4] cursor-pointer">
          <AppleIcon /> Apple
        </button>
      </div>

      <div className="my-[22px] flex items-center gap-[14px]">
        <span className="h-px flex-1 bg-[#e2ede6]" />
        <span className="text-[13px] text-[#8a988e]">or continue with email</span>
        <span className="h-px flex-1 bg-[#e2ede6]" />
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-[16px]">
        {!isLogin && (
          <Field id="name" label="Full name" placeholder="Aashish Sharma" autoComplete="name" icon={UserIcon} value={name} onChange={setName} />
        )}
        <Field id="email" label="Email" type="email" placeholder="you@email.com" autoComplete="email" icon={MailIcon} value={email} onChange={setEmail} />
        <div>
          <Field
            id="password"
            label="Password"
            type={show ? "text" : "password"}
            placeholder={isLogin ? "Your password" : "At least 8 characters"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            icon={LockIcon}
            value={password}
            onChange={setPassword}
            right={
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="grid h-[32px] w-[32px] place-items-center rounded-[9px] text-[#8a988e] hover:bg-[#f2f8f4] hover:text-[#0a4a29] cursor-pointer"
              >
                {show ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            }
          />
          {/* Signup: strength meter */}
          {!isLogin && password.length > 0 && (
            <div className="mt-[10px]">
              <div className="flex gap-[5px]">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-[4px] flex-1 rounded-full transition-colors"
                    style={{ background: i < strength ? strengthColor[strength] : "#e2ede6" }}
                  />
                ))}
              </div>
              <p className="mt-[6px] text-[12.5px]" style={{ color: strengthColor[strength] }}>
                {strengthLabel[strength]}
              </p>
            </div>
          )}
        </div>

        {!isLogin && (
          <Field id="confirm" label="Confirm password" type={show ? "text" : "password"} placeholder="Re-enter your password" autoComplete="new-password" icon={LockIcon} value={confirm} onChange={setConfirm} />
        )}

        {isLogin ? (
          <div className="flex items-center justify-between">
            <button type="button" role="checkbox" aria-checked={remember} onClick={() => setRemember((v) => !v)} className="flex items-center gap-[9px] text-left cursor-pointer group">
              <span className={cn("grid h-[19px] w-[19px] place-items-center rounded-[6px] border transition-colors", remember ? "border-[#056839] bg-[#056839]" : "border-[#cfe3d6] bg-white group-hover:border-[#9ec7ac]")}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
              </span>
              <span className="text-[13.5px] text-[#566b5d]">Remember me</span>
            </button>
            <Link href="#" className="text-[13.5px] font-medium text-[#056839] hover:underline">
              Forgot password?
            </Link>
          </div>
        ) : (
          <button type="button" role="checkbox" aria-checked={agree} onClick={() => setAgree((v) => !v)} className="flex items-start gap-[10px] text-left cursor-pointer group">
            <span className={cn("mt-[1px] grid h-[19px] w-[19px] shrink-0 place-items-center rounded-[6px] border transition-colors", agree ? "border-[#056839] bg-[#056839]" : "border-[#cfe3d6] bg-white group-hover:border-[#9ec7ac]")}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
            </span>
            <span className="text-[13px]/[1.5] text-[#566b5d]">
              I agree to the <span className="font-medium text-[#056839]">Terms of Service</span> and{" "}
              <span className="font-medium text-[#056839]">Privacy Policy</span>.
            </span>
          </button>
        )}

        {error && (
          <p className="rounded-[10px] bg-[#fbeee9] px-[13px] py-[9px] text-[13.5px] text-[#c0603e]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-[2px] inline-flex items-center justify-center gap-[8px] rounded-[14px] bg-[#0a4a29] px-[24px] py-[15px] text-[16px] font-medium text-white shadow-[var(--shadow-e2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#056839] hover:shadow-[var(--shadow-lift)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              {isLogin ? "Logging in..." : "Creating account..."}
            </>
          ) : (
            <>
              {isLogin ? "Log in" : "Create free account"}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
