"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [loginMode, setLoginMode] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Account created successfully! Check your email if confirmation is required."
    );

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Login successful! 🎉");
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gray-800">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center text-2xl font-bold">
              BM
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            Bharat Material Grid
          </h1>

          <p className="text-gray-400 text-lg mt-4">
            National Material Intelligence Command Center
          </p>

          <p className="text-gray-500 mt-6 leading-relaxed">
            Access material intelligence, information and AI-powered
            capabilities through a secure centralized platform.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12">

          {/* LOGIN / REGISTER SWITCH */}
          <div className="flex bg-gray-800 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => {
                setLoginMode(true);
                setMessage("");
              }}
              className={`w-1/2 py-3 rounded-lg font-semibold transition ${
                loginMode
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode(false);
                setMessage("");
              }}
              className={`w-1/2 py-3 rounded-lg font-semibold transition ${
                !loginMode
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* LOGIN */}
          {loginMode ? (
            <form onSubmit={handleLogin} className="space-y-5">

              <div>
                <h2 className="text-3xl font-bold text-white">
                  Welcome Back
                </h2>

                <p className="text-gray-400 mt-2">
                  Sign in to continue to Bharat Material Grid.
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-white"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-gray-500 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode(false);
                    setMessage("");
                  }}
                  className="text-white hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          ) : (

            /* REGISTER */
            <form onSubmit={handleRegister} className="space-y-5">

              <div>
                <h2 className="text-3xl font-bold text-white">
                  Create Account
                </h2>

                <p className="text-gray-400 mt-2">
                  Create your Bharat Material Grid account.
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-gray-500 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode(true);
                    setMessage("");
                  }}
                  className="text-white hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* MESSAGE */}
          {message && (
            <div className="mt-6 p-3 rounded-lg bg-gray-800 border border-gray-700 text-center text-sm text-gray-300">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}