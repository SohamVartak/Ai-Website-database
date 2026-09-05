import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles, ChevronDown, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export interface EvidenceItem {
  text: string;
  type: 'match' | 'mismatch' | 'info';
  detail?: string;
}

export interface AIInsightCardProps {
  title?: string;
  subtitle?: string;
  recommendation: string;
  recommendationType?: 'approve' | 'reject' | 'review' | 'info';
  explanation: string;
  evidenceItems?: EvidenceItem[];
  defaultOpen?: boolean;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title = 'AI Recommendation & Evidence Reasoning',
  subtitle = 'BMG Multi-Attribute Specification Guard Engine',
  recommendation,
  recommendationType = 'review',
  explanation,
  evidenceItems = [],
  defaultOpen = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const shouldReduceMotion = useReducedMotion();

  const getRecommendationStyle = () => {
    switch (recommendationType) {
      case 'approve':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'reject':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'info':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'review':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {/* Card Header with Trigger */}
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-xs tracking-tight">{title}</h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRecommendationStyle()}`}>
                {recommendation}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle evidence breakdown"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-transform"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 space-y-4">
              {/* Primary Explanation */}
              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                {explanation}
              </div>

              {/* Sequential Evidence Items */}
              {evidenceItems.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Why did AI recommend this decision?
                  </div>

                  <div className="space-y-1.5">
                    {evidenceItems.map((item, idx) => {
                      const isMatch = item.type === 'match';
                      const isMismatch = item.type === 'mismatch';

                      return (
                        <motion.div
                          key={idx}
                          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.25 }}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs border ${
                            isMismatch
                              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                              : isMatch
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isMismatch ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            ) : isMatch ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Info className="w-3.5 h-3.5 text-slate-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold">{item.text}</span>
                            {item.detail && (
                              <span className="text-slate-500 text-[11px] block mt-0.5">
                                {item.detail}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
