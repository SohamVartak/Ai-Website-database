import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Bot, MessageSquare } from 'lucide-react';

export const FloatingChatbotButton: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, currentTab } = useApp();

  // Don't show if already open or on login page
  if (isAIAssistantOpen || currentTab === 'login') return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip speech bubble on desktop */}
      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="hidden md:flex items-center gap-2 bg-[#001730]/95 backdrop-blur-md text-white border border-amber-400/40 py-1.5 px-3 rounded-full text-xs font-medium shadow-xl select-none"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-amber-300 font-bold">Bharat AI:</span>
        <span className="text-slate-200">Need specification help? Ask me</span>
      </motion.div>

      {/* Main Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsAIAssistantOpen(true)}
        className="relative group bg-gradient-to-br from-[#002244] via-[#001b36] to-[#000e1f] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl border-2 border-amber-400 flex items-center gap-2.5 cursor-pointer"
        title="Open Bharat AI Material Intelligence Copilot"
        aria-label="Open Bharat AI Assistant"
      >
        {/* Animated Radial Pulse Rings */}
        <span className="absolute -inset-1 rounded-full bg-amber-400/30 blur-sm pointer-events-none group-hover:bg-amber-400/50 transition-colors animate-pulse" />
        <span className="absolute -inset-2.5 rounded-full border border-amber-400/20 pointer-events-none animate-ping opacity-40" />

        {/* Bot Icon with Sparkle Badge */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-[#001730] flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Text Label on Tablet/Desktop */}
        <div className="hidden sm:flex flex-col text-left z-10 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-tight text-white font-display">
              Bharat AI Copilot
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-mono px-1 py-0.2 rounded font-bold">
              AI
            </span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono">
            Ask Domain Intelligence
          </span>
        </div>

        {/* Mobile Mini Chat Bubble Icon */}
        <span className="sm:hidden z-10">
          <MessageSquare className="w-4 h-4 text-amber-400" />
        </span>
      </motion.button>
    </div>
  );
};
