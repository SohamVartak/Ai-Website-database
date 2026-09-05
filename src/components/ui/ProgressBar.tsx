import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  color?: 'emerald' | 'amber' | 'rose' | 'slate' | 'cyan';
  height?: 'sm' | 'md' | 'lg';
  className?: string;
  delay?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercent = true,
  color = 'slate',
  height = 'md',
  className = '',
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();

  const colorStyles = {
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-600',
    slate: 'bg-slate-800',
    cyan: 'bg-cyan-600'
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div ref={ref} className={`space-y-1.5 ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="text-slate-600 font-medium">{label}</span>}
          {showPercent && <span className="text-slate-900 font-bold">{clamped}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-slate-100 ${heightStyles[height]} rounded-full overflow-hidden`}
      >
        <motion.div
          initial={shouldReduceMotion ? { width: `${clamped}%` } : { width: 0 }}
          animate={isInView ? { width: `${clamped}%` } : {}}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className={`${colorStyles[color]} h-full rounded-full`}
        />
      </div>
    </div>
  );
};
