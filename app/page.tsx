"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

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

    setMessage("Account created! Check your email.");
  }

  async function handleLogin(e) {
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
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-black text-2xl font-bold mb-4">
            AI
          </div>

          <h1 className="text-3xl font-bold text-white">
            AI Website
          </h1>

          <p className="text-gray-400 mt-2">
            Your intelligent platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

          {/* Login / Register tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-7">

            <button
              onClick={() => {
                setShowLogin(true);
                setMessage("");
              }}
              className={`w-1/2 py-2 rounded-md font-medium ${
                showLogin
                  ? "bg-white text-black"
                  : "text-gray-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => {
                setShowLogin(false);
                setMessage("");
              }}
              className={`w-1/2 py-2 rounded-md font-medium ${
                !showLogin
                  ? "bg-white text-black"
                  : "text-gray-400"
              }`}
            >
              Register
            </button>

          </div>

          {/* LOGIN */}
          {showLogin ? (

            <form onSubmit={handleLogin} className="space-y-4">

              <h2 className="text-2xl font-semibold text-white">
                Welcome back
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Login to your account.
              </p>

              <div>
                <label className="text-sm text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
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
                  placeholder="••••••••"
                  required
                  className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

          ) : (

            /* REGISTER */
            <form onSubmit={handleRegister} className="space-y-4">

              <h2 className="text-2xl font-semibold text-white">
                Create an account
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Create your account to get started.
              </p>

              <div>
                <label className="text-sm text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
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
                  className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-lg font-semibold"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

            </form>
          )}

          {/* Message */}
          {message && (
            <p className="mt-5 text-center text-sm text-gray-300">
              {message}
            </p>
          )}

        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Your account is securely handled by Supabase.
        </p>

      </div>
    </main>
  );
}