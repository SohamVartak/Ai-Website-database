import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  AshokaEmblem,
  BMGNationalSeal,
  DigitalIndiaLogo,
  MakeInIndiaLogo,
  CPSEBrandBadge
} from '../common/GovernmentLogos';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Home,
  UserCheck,
  Phone,
  Sparkles,
  KeyRound,
  Fingerprint
} from 'lucide-react';
import { AnimatedButton } from '../ui/AnimatedButton';

export const LoginView: React.FC = () => {
  const { setCurrentTab, setCurrentUserRole, addToast } = useApp();

  const [loginTab, setLoginTab] = useState<'cpse' | 'procurement' | 'admin' | 'demo'>('demo');
  const [loginId, setLoginId] = useState('officer@iocl.co.in');
  const [password, setPassword] = useState('Password@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('7B8Y9K');
  const [captchaInput, setCaptchaInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCaptchaSpinning, setIsCaptchaSpinning] = useState(false);

  // Generate a random 6-character alphanumeric captcha with animation
  const generateNewCaptcha = () => {
    setIsCaptchaSpinning(true);
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTimeout(() => {
      setCaptchaCode(code);
      setCaptchaInput('');
      setIsCaptchaSpinning(false);
    }, 250);
  };

  const handleRolePreset = (
    role: string,
    email: string,
    tabName: 'cpse' | 'procurement' | 'admin' | 'demo'
  ) => {
    setLoginTab(tabName);
    setLoginId(email);
    setPassword('••••••••••••');
    setCaptchaInput(captchaCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginId.trim() || !password.trim()) {
      setErrorMessage('Please enter your Official Login ID and Password.');
      return;
    }

    if (loginTab !== 'demo' && captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Invalid Captcha code entered. Please re-enter the characters shown in the box.');
      generateNewCaptcha();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Set role according to credentials/tab
      if (loginId.includes('iocl')) {
        setCurrentUserRole('CPSE Administrator (IOCL)');
      } else if (loginId.includes('ongc')) {
        setCurrentUserRole('CPSE Administrator (ONGC)');
      } else if (loginTab === 'procurement') {
        setCurrentUserRole('Procurement Officer');
      } else {
        setCurrentUserRole('National Administrator');
      }

      addToast({
        title: 'Authentication Successful',
        message: 'Welcome to Bharat Material Grid Sovereign Portal',
        type: 'success'
      });

      setTimeout(() => {
        window.history.pushState({}, '', '/');
        setCurrentTab('dashboard');
      }, 700);
    }, 900);
  };

  // Instant 1-Click Login for Demo Evaluators
  const handleQuickDemoLogin = (role: string, email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setCurrentUserRole(role as any);
      addToast({
        title: 'Instant Authentication Granted',
        message: `Logged in as ${role}`,
        type: 'success'
      });
      setTimeout(() => {
        setCurrentTab('dashboard');
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-radial from-slate-900 via-[#001730] to-[#000d1a] flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Dynamic Animated Ambient Background Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP INDIAN TRICOLOR ACCENT */}
      <div className="h-1.5 w-full flex z-10">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-[#FFFFFF] border-y border-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* 2. GOVERNMENT UTILITY HEADER */}
      <header className="bg-[#001f3f]/80 backdrop-blur-md text-white py-2.5 px-4 sm:px-8 border-b border-slate-700/50 flex items-center justify-between text-xs select-none z-10">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-sm">🇮🇳</span>
          <span className="font-bold tracking-wide">भारत सरकार | Government of India</span>
          <span className="hidden sm:inline text-slate-400">• भारी उद्योग मंत्रालय (Ministry of Heavy Industries)</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-xs">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 px-3 py-1 rounded-md text-amber-300 border border-slate-600 transition-all cursor-pointer font-bold shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Public Portal</span>
          </motion.button>
        </div>
      </header>

      {/* 3. MAIN LOGIN CONTAINER WITH COOL MOTION ANIMATIONS */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-5xl bg-white border border-slate-300/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* LEFT COLUMN: Sovereign Branding, Animated Seal & Quick Access (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#002244] via-[#001a38] to-[#0a1128] text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
            {/* Ambient Radial Accent */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Sovereign State Emblem with Gentle Hover Pulse */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.06, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="relative p-1 rounded-full bg-gradient-to-br from-amber-400/30 via-transparent to-emerald-400/20 shadow-md"
                >
                  <AshokaEmblem size={56} color="#ffffff" goldTone={true} className="drop-shadow-lg shrink-0" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white font-display">
                    भारत मटेरियल ग्रिड
                  </h1>
                  <div className="text-[10px] font-black text-amber-400 font-mono tracking-wider uppercase">
                    BHARAT MATERIAL GRID (BMG)
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">
                    National Parichay SSO Sovereign Gateway
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 border-t border-slate-700/80 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  <span>Verified CPSE Access</span>
                </div>
                <h2 className="text-base font-bold text-white leading-snug">
                  National CPSE Material Harmonization & Rate Contract Pooling
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authorized cryptographic gateway for Maharatna and Navratna enterprises: IndianOil, ONGC, SAIL, NTPC, BHEL, GAIL, and Ministry Officers.
                </p>
              </div>

              {/* 1-Click Demo Evaluation Quick Access with Cool Motion Cards */}
              <div className="p-4 bg-gradient-to-b from-amber-500/15 to-transparent border border-amber-400/30 rounded-2xl space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold font-mono">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>EVALUATION 1-CLICK QUICK ACCESS</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Instant one-click authentication for review and evaluation:
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin(
                        'National Administrator',
                        'admin.national@bmg.gov.in'
                      )
                    }
                    className="w-full bg-[#002f5e]/90 hover:bg-amber-400 hover:text-[#001730] text-white border border-slate-600/80 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer shadow-xs group"
                  >
                    <span className="flex items-center gap-2">
                      <span>🏛️</span>
                      <span>National Administrator (Ministry)</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin(
                        'CPSE Administrator (IOCL)',
                        'r.sharma@iocl.co.in'
                      )
                    }
                    className="w-full bg-[#002f5e]/90 hover:bg-amber-400 hover:text-[#001730] text-white border border-slate-600/80 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer shadow-xs group"
                  >
                    <span className="flex items-center gap-2">
                      <span>🛢️</span>
                      <span>IndianOil Nodal Officer (IOCL)</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin(
                        'Procurement Officer',
                        'procurement@ongc.co.in'
                      )
                    }
                    className="w-full bg-[#002f5e]/90 hover:bg-amber-400 hover:text-[#001730] text-white border border-slate-600/80 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-between cursor-pointer shadow-xs group"
                  >
                    <span className="flex items-center gap-2">
                      <span>💰</span>
                      <span>Joint Tender & Procurement Officer</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bottom Security Info with Pulsing Shield */}
            <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>HSM RSA-4096 Sovereign Cloud Verified</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Designed & Hosted by NIC. Governed under DPDP Act 2023.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Official Login Form (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
            <div className="max-w-md mx-auto w-full space-y-5">
              {/* Header Title & Parichay Badge */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
                  <Lock className="w-3 h-3 text-amber-800" />
                  <span>Parichay / Jan Parichay SSO</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#002244] font-display">
                  Sovereign Officer Sign In
                </h2>
                <p className="text-xs text-slate-600">
                  Enter your registered official CPSE email credentials and security captcha.
                </p>
              </div>

              {/* Login Role Preset Tabs with Spring Animation */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() =>
                    handleRolePreset(
                      'CPSE Administrator (IOCL)',
                      'r.sharma@iocl.co.in',
                      'cpse'
                    )
                  }
                  className={`flex-1 py-2 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                    loginTab === 'cpse'
                      ? 'bg-[#002244] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CPSE Nodal
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() =>
                    handleRolePreset(
                      'Procurement Officer',
                      'procurement@cpse.gov.in',
                      'procurement'
                    )
                  }
                  className={`flex-1 py-2 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                    loginTab === 'procurement'
                      ? 'bg-[#002244] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Procurement
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() =>
                    handleRolePreset(
                      'National Administrator',
                      'admin.national@bmg.gov.in',
                      'admin'
                    )
                  }
                  className={`flex-1 py-2 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                    loginTab === 'admin'
                      ? 'bg-[#002244] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ministry
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setLoginTab('demo')}
                  className={`flex-1 py-2 px-2 rounded-lg font-bold text-center transition-all cursor-pointer ${
                    loginTab === 'demo'
                      ? 'bg-amber-500 text-[#001730] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ Quick
                </motion.button>
              </div>

              {/* Error Message with AnimatePresence */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="font-semibold">{errorMessage}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Official Login ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Official Email / Login ID</span>
                    <span className="text-[10px] text-slate-500 font-mono">@iocl / @ongc / @gov.in</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={e => setLoginId(e.target.value)}
                      placeholder="nodal.officer@cpse.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Password</label>
                    <button
                      type="button"
                      onClick={() =>
                        addToast({
                          title: 'Password Reset Notification',
                          message: 'OTP sent to registered CPSE mobile number.',
                          type: 'info'
                        })
                      }
                      className="text-[11px] font-semibold text-blue-800 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-mono font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* AUTHENTIC GOVERNMENT CAPTCHA BOX WITH ANIMATED SPIN */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Security Captcha</span>
                    <span className="text-[10px] text-slate-500 font-mono">Case Sensitive</span>
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Visual Captcha Canvas Badge */}
                    <div className="flex-1 bg-gradient-to-r from-amber-100/80 via-emerald-100/60 to-blue-100/80 border border-slate-300 rounded-xl py-2 px-4 flex items-center justify-between select-none shadow-inner">
                      <span className="font-mono text-base sm:text-lg font-black tracking-widest text-[#002244] italic line-through decoration-amber-600 select-none">
                        {captchaCode}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        type="button"
                        onClick={generateNewCaptcha}
                        className="p-1 text-slate-600 hover:text-[#002244] transition-colors rounded cursor-pointer"
                        title="Generate fresh captcha code"
                      >
                        <RefreshCw className={`w-4 h-4 ${isCaptchaSpinning ? 'animate-spin' : ''}`} />
                      </motion.button>
                    </div>

                    {/* Captcha Input */}
                    <input
                      type="text"
                      required={loginTab !== 'demo'}
                      value={captchaInput}
                      onChange={e => setCaptchaInput(e.target.value.toUpperCase())}
                      placeholder="Enter Captcha"
                      maxLength={6}
                      className="w-36 py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#002244] border-slate-300 rounded focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">Remember my CPSE session</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    2FA Verified
                  </span>
                </div>

                {/* SIGN IN SUBMIT BUTTON WITH FLUID MOTION HOVER */}
                <div className="pt-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <AnimatedButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isLoading}
                      loadingText="Verifying Sovereign Credentials..."
                      isSuccess={isSuccess}
                      successText="Access Granted • Loading Command Center..."
                      className="w-full text-xs sm:text-sm font-black py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-400 shadow-md cursor-pointer"
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      Sign In to Officer Portal
                    </AnimatedButton>
                  </motion.div>
                </div>
              </form>

              {/* Help & Toll-Free Phone */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Nodal Helpline: 1800-11-2026
                </span>
                <button
                  type="button"
                  onClick={() =>
                    addToast({
                      title: 'CPSE Support Ticket Dispatched',
                      message: 'NIC Helpline executive will connect within 15 minutes.',
                      type: 'info'
                    })
                  }
                  className="font-bold text-blue-900 hover:underline cursor-pointer"
                >
                  Contact Desk
                </button>
              </div>
            </div>

            {/* LEGAL NOTICE FOOTER */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-500 text-center space-y-1">
              <p>
                Unauthorized access is strictly prohibited under Information Technology Act 2000. All logins and queries are cryptographically logged.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => addToast({ title: 'Privacy Policy', message: 'DPDP Act 2023 protected.', type: 'info' })}
                  className="hover:text-slate-800 cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  onClick={() => addToast({ title: 'Terms of Service', message: 'CPSE Data Sharing Framework applied.', type: 'info' })}
                  className="hover:text-slate-800 cursor-pointer"
                >
                  Terms of Use
                </button>
                <span>•</span>
                <button
                  onClick={() => addToast({ title: 'Help Manual', message: 'BMG User Manual v3.4 available.', type: 'info' })}
                  className="hover:text-slate-800 cursor-pointer"
                >
                  Help Manual
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 4. GOVERNMENT FOOTER STRIP */}
      <footer className="bg-[#001730] text-slate-400 py-3 px-4 text-center text-xs border-t border-slate-800 font-mono z-10">
        NIC Sovereign Cloud Hosting • Ministry of Heavy Industries • Government of India
      </footer>
    </div>
  );
};
