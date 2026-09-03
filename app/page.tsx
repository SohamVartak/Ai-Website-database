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
    <main className="min-h-screen bg-white text-[#1f2937]">

      {/* ================= HEADER ================= */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            {/* LEFT BRANDING */}
            <div className="flex items-center gap-4">

              {/* Government-style logo */}
              <div className="w-14 h-14 rounded-full border-2 border-[#123e63] flex items-center justify-center">
                <div className="text-center leading-none">
                  <div className="text-[9px] font-bold text-[#123e63]">
                    INDIA
                  </div>
                  <div className="text-xl font-bold text-[#123e63]">
                    ★
                  </div>
                </div>
              </div>

              <div className="border-l border-gray-300 pl-4">
                <p className="text-[11px] uppercase tracking-[2px] text-gray-500">
                  Government of India
                </p>

                <h1 className="text-xl md:text-2xl font-bold text-[#123e63]">
                  Bharat Material Grid
                </h1>

                <p className="text-xs text-gray-500">
                  National Material Intelligence Platform
                </p>
              </div>
            </div>

            {/* RIGHT BRANDING */}
            <div className="hidden md:flex items-center gap-3">

              <div className="text-right">
                <p className="text-xs font-semibold text-gray-600">
                  MATERIAL INTELLIGENCE
                </p>

                <p className="text-[10px] text-gray-400">
                  Secure Digital Infrastructure
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-[#123e63] text-white flex items-center justify-center font-bold">
                BM
              </div>

            </div>

          </div>
        </div>
      </header>


      {/* ================= MAIN ================= */}
      <section className="min-h-[calc(100vh-89px)] bg-[#f7f9fb] flex items-center justify-center px-5 py-12">

        <div className="w-full max-w-5xl">

          {/* PAGE TITLE */}
          <div className="text-center mb-8">

            <h2 className="text-2xl md:text-3xl font-bold text-[#123e63]">
              Bharat Material Grid
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Secure access to the National Material Intelligence Platform
            </p>

          </div>


          {/* ================= LOGIN CARD ================= */}
          <div className="bg-white border border-gray-300 shadow-sm rounded-[18px] overflow-hidden">

            <div className="grid md:grid-cols-[1fr_80px_1fr]">

              {/* ================= SIGN IN ================= */}
              <div className="p-8 md:p-10">

                <div className="max-w-md mx-auto">

                  <h3 className="text-2xl font-bold text-[#123e63]">
                    Sign In
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 mb-7">
                    Sign in to access Bharat Material Grid services.
                  </p>


                  <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >

                    {/* EMAIL */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        required
                        className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white text-gray-800 outline-none transition focus:border-[#123e63] focus:ring-2 focus:ring-[#123e63]/10"
                      />

                    </div>


                    {/* PASSWORD */}
                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>

                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full h-12 px-4 rounded-md border border-gray-300 bg-white text-gray-800 outline-none transition focus:border-[#123e63] focus:ring-2 focus:ring-[#123e63]/10"
                      />

                    </div>


                    {/* REMEMBER */}
                    <div className="flex items-center justify-between">

                      <label className="flex items-center gap-2 text-sm text-gray-600">

                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-[#123e63]"
                        />

                        Remember me

                      </label>

                      <button
                        type="button"
                        className="text-sm text-[#125397] hover:underline"
                      >
                        Forgot Password?
                      </button>

                    </div>


                    {/* LOGIN BUTTON */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-md bg-[#123e63] text-white font-semibold transition hover:bg-[#0d3150] disabled:opacity-60"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </button>

                  </form>

                </div>

              </div>


              {/* ================= OR ================= */}
              <div className="flex md:flex-col items-center justify-center gap-4 py-5 md:py-0">

                <div className="hidden md:block w-px h-24 bg-gray-200"></div>

                <div className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-xs font-bold text-gray-500">
                  OR
                </div>

                <div className="hidden md:block w-px h-24 bg-gray-200"></div>

              </div>


              {/* ================= REGISTER ================= */}
              <div className="bg-[#f8fafc] border-t md:border-t-0 md:border-l border-gray-200 p-8 md:p-10">

                <div className="max-w-md mx-auto">

                  <h3 className="text-2xl font-bold text-[#123e63]">
                    New User?
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 mb-7">
                    Create an account to use Bharat Material Grid.
                  </p>


                  {!loginMode ? (

                    /* REGISTER FORM */
                    <form
                      onSubmit={handleRegister}
                      className="space-y-4"
                    >

                      {/* NAME */}
                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>

                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-800 outline-none focus:border-[#123e63]"
                        />

                      </div>


                      {/* EMAIL */}
                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-800 outline-none focus:border-[#123e63]"
                        />

                      </div>


                      {/* PASSWORD */}
                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>

                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                          minLength={6}
                          className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-800 outline-none focus:border-[#123e63]"
                        />

                      </div>


                      {/* CONFIRM PASSWORD */}
                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>

                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          placeholder="Confirm your password"
                          required
                          minLength={6}
                          className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white text-gray-800 outline-none focus:border-[#123e63]"
                        />

                      </div>


                      {/* REGISTER BUTTON */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-md bg-[#125397] text-white font-semibold transition hover:bg-[#0e4278] disabled:opacity-60"
                      >
                        {loading
                          ? "Creating Account..."
                          : "Register"}
                      </button>


                      <button
                        type="button"
                        onClick={() => {
                          setLoginMode(true);
                          setMessage("");
                        }}
                        className="w-full text-sm text-[#125397] hover:underline"
                      >
                        Already registered? Sign In
                      </button>

                    </form>

                  ) : (

                    /* REGISTER INTRO */
                    <div>

                      <div className="border border-gray-200 bg-white rounded-lg p-5 mb-6">

                        <div className="w-11 h-11 rounded-full bg-[#eaf1f7] text-[#123e63] flex items-center justify-center font-bold mb-4">
                          BM
                        </div>

                        <h4 className="font-bold text-gray-800 mb-2">
                          Create your account
                        </h4>

                        <p className="text-sm text-gray-500 leading-6">
                          Register to access material information,
                          technical resources, AI-powered material
                          intelligence and other Bharat Material Grid
                          services.
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={() => {
                          setLoginMode(false);
                          setMessage("");
                        }}
                        className="w-full h-12 rounded-md border-2 border-[#123e63] text-[#123e63] font-semibold transition hover:bg-[#123e63] hover:text-white"
                      >
                        Register Now
                      </button>

                    </div>

                  )}

                </div>

              </div>

            </div>


            {/* MESSAGE */}
            {message && (
              <div className="border-t border-gray-200 px-6 py-4">

                <div className="max-w-3xl mx-auto rounded-md bg-[#f3f6f8] border border-gray-200 px-4 py-3 text-center text-sm text-gray-700">
                  {message}
                </div>

              </div>
            )}

          </div>


          {/* ================= INFORMATION ================= */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">

            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <h4 className="font-bold text-[#123e63] text-sm mb-2">
                How to access?
              </h4>

              <p className="text-xs text-gray-500 leading-5">
                Use your registered Bharat Material Grid account
                credentials to sign in securely.
              </p>

            </div>


            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <h4 className="font-bold text-[#123e63] text-sm mb-2">
                Material Intelligence
              </h4>

              <p className="text-xs text-gray-500 leading-5">
                Access structured material information and
                AI-assisted material intelligence resources.
              </p>

            </div>


            <div className="bg-white border border-gray-200 rounded-lg p-5">

              <h4 className="font-bold text-[#123e63] text-sm mb-2">
                Need Help?
              </h4>

              <p className="text-xs text-gray-500 leading-5">
                For account or platform-related assistance,
                contact the Bharat Material Grid support team.
              </p>

            </div>

          </div>


          {/* FOOTER */}
          <div className="text-center mt-8">

            <p className="text-xs text-gray-400">
              © 2026 Bharat Material Grid. All rights reserved.
            </p>

            <p className="text-[11px] text-gray-400 mt-1">
              Secure • Reliable • Material Intelligence
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}