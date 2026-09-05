"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        if (data.user) {
          setMessage(
            "Registration successful. Please check your email if confirmation is required."
          );

          setIsRegister(false);
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        // Login successful → open Bharat Material Grid
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Government tricolor */}
      <div className="gov-tricolor-accent" />

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <img
              src="/ashoka-emblem.png"
              alt="Government of India Emblem"
              className="h-16 w-16 object-contain"
            />

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Government of India
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Bharat Material Grid
              </h1>

              <p className="text-sm text-slate-500">
                National Material Intelligence &amp; Procurement Platform
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Secure Access
            </p>

            <p className="text-sm font-medium text-slate-700">
              Government Enterprise Portal
            </p>
          </div>
        </div>
      </header>

      {/* Main login section */}
      <section className="relative flex min-h-[calc(100vh-110px)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
        <div className="absolute inset-0 bg-grid-pattern-light opacity-50" />

        <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
          {/* Left panel */}
          <div className="hidden bg-slate-900 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-8 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200">
                Bharat Material Grid
              </div>

              <h2 className="text-4xl font-bold leading-tight">
                Intelligent Material
                <br />
                Management
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                A unified platform for material discovery, data quality,
                procurement intelligence, company management and
                cross-organisation material comparison.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">01</p>
                <p className="mt-1 text-xs text-slate-300">Centralised Data</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">02</p>
                <p className="mt-1 text-xs text-slate-300">Smart Search</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">03</p>
                <p className="mt-1 text-xs text-slate-300">AI Insights</p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="p-7 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold text-orange-600">
                {isRegister ? "Create Account" : "Secure Sign In"}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {isRegister ? "Register" : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {isRegister
                  ? "Create your Bharat Material Grid account."
                  : "Sign in to access the Bharat Material Grid portal."}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {isRegister && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {message && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : isRegister
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
              className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "New user? Create an Account"}
            </button>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to the applicable terms and policies
              governing access to the Bharat Material Grid.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}