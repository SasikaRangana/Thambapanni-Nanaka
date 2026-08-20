"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ShieldCheck, Eye, EyeOff, Lock, AlertCircle, Loader2 } from "lucide-react";

const SESSION_KEY = "tn_admin_session";
const LOCKOUT_KEY = "tn_admin_lockout";
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isSessionValid(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const { expires } = JSON.parse(raw);
    return Date.now() < expires;
  } catch {
    return false;
  }
}

function saveSession() {
  // Session valid for 8 hours within the same browser tab
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expires }));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

interface AdminLoginGateProps {
  children: React.ReactNode;
}

export default function AdminLoginGate({ children }: AdminLoginGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check session on mount
  useEffect(() => {
    if (isSessionValid()) {
      setAuthenticated(true);
    }
    // Restore lockout state
    try {
      const raw = localStorage.getItem(LOCKOUT_KEY);
      if (raw) {
        const { until, count } = JSON.parse(raw);
        if (Date.now() < until) {
          setLockoutUntil(until);
          setAttempts(count);
        } else {
          localStorage.removeItem(LOCKOUT_KEY);
        }
      }
    } catch {}
    setChecking(false);
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutUntil === 0) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutRemaining(0);
        setLockoutUntil(0);
        setAttempts(0);
        localStorage.removeItem(LOCKOUT_KEY);
        clearInterval(interval);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        setLockoutRemaining(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil > Date.now()) return;
    if (!password.trim()) {
      setError("Please enter your admin password.");
      return;
    }

    setLoading(true);
    setError("");

    // Small artificial delay to prevent timing attacks
    await new Promise((r) => setTimeout(r, 400));

    const inputHash = await sha256(password.trim());
    const expectedHash =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH || "";

    if (inputHash === expectedHash) {
      saveSession();
      setAuthenticated(true);
      setAttempts(0);
      localStorage.removeItem(LOCKOUT_KEY);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword("");

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutUntil(until);
        setLockoutRemaining(LOCKOUT_SECONDS);
        localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until, count: newAttempts }));
        setError(`Too many attempts. Locked for ${LOCKOUT_SECONDS} seconds.`);
      } else {
        setError(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? "" : "s"} remaining.`);
      }
    }

    setLoading(false);
  };

  const handleLogout = () => {
    clearSession();
    setAuthenticated(false);
    setPassword("");
    setAttempts(0);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0c0a08] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  if (authenticated) {
    return (
      <>
        {/* Floating logout button rendered on top of children */}
        <div className="fixed top-4 right-4 z-[999]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/80 border border-rose-600/40 text-rose-300 text-xs font-mono font-semibold hover:bg-rose-900 transition-colors shadow-xl backdrop-blur-md"
            title="Logout from Admin"
          >
            <Lock className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
        {children}
      </>
    );
  }

  // ── Login Screen ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0c0a08] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#d4af37]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 guilloche-bg opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#1b150f] to-[#120f0b] border border-[#d4af37]/30 shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Gold top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#8b6914] via-[#d4af37] to-[#8b6914]" />

          <div className="p-8 sm:p-10 space-y-8">
            {/* Brand header */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/20">
                <Image
                  src="/images/logo.jpg"
                  alt="Thambapanni Nanaka"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="font-serif text-2xl font-bold text-[#f8f6f0]">
                  Admin Vault
                </h1>
                <p className="text-xs font-mono text-[#a69d8d] mt-1 tracking-wider uppercase">
                  Thambapanni Nanaka · Restricted Access
                </p>
              </div>
            </div>

            {/* Shield icon */}
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-[#1c1610] border border-[#d4af37]/20">
                <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
              </div>
            </div>

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-[#b8af9e] mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error && !lockoutUntil) setError("");
                    }}
                    placeholder="Enter admin password"
                    disabled={loading || lockoutUntil > Date.now()}
                    autoFocus
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#0e0c0a] border border-[#d4af37]/30 text-sm text-[#f8f6f0] placeholder-[#6b6255] focus:outline-none focus:border-[#d4af37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b6255] hover:text-[#d4af37] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error / Lockout message */}
              {(error || lockoutRemaining > 0) && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-300 text-xs font-mono animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>
                    {lockoutRemaining > 0
                      ? `Account locked — try again in ${lockoutRemaining}s`
                      : error}
                  </span>
                </div>
              )}

              {/* Attempt dots */}
              {attempts > 0 && lockoutUntil === 0 && (
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < attempts ? "bg-rose-500" : "bg-[#2a2017]"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-[#6b6255] ml-1">
                    Failed attempts
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || lockoutUntil > Date.now() || !password.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#c59e2b] text-[#0c0a08] font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#d4af37]/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : lockoutUntil > Date.now() ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Locked ({lockoutRemaining}s)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Admin Vault</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer note */}
            <p className="text-center text-[10px] font-mono text-[#4a4035] leading-relaxed">
              Session expires on tab close &bull; Max {MAX_ATTEMPTS} attempts before {LOCKOUT_SECONDS}s lockout
              <br />
              Unauthorized access is prohibited
            </p>
          </div>
        </div>

        {/* Back to store link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-mono text-[#6b6255] hover:text-[#d4af37] transition-colors"
          >
            ← Back to Thambapanni Nanaka Store
          </a>
        </div>
      </div>
    </div>
  );
}
