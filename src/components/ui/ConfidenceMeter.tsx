import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

export interface ConfidenceMeterProps {
  confidenceScore: number; // 0 to 100
  label?: string;
  sublabel?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidenceScore,
  label = 'AI Confidence Score',
  sublabel,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setAnimatedScore(confidenceScore);
      return;
    }

    let startTime: number | null = null;
    const duration = 1000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(+(eased * confidenceScore).toFixed(1));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedScore(confidenceScore);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isInView, confidenceScore, shouldReduceMotion]);

  const getColorTheme = (score: number) => {
    if (score >= 90) {
      return {
        bar: 'bg-emerald-600',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        label: 'High Confidence Match',
        Icon: ShieldCheck
      };
    }
    if (score >= 75) {
      return {
        bar: 'bg-amber-500',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        label: 'Medium Confidence',
        Icon: AlertTriangle
      };
    }
    return {
      bar: 'bg-rose-600',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      label: 'Critical Divergence',
      Icon: XCircle
    };
  };

  const theme = getColorTheme(confidenceScore);
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div ref={containerRef} className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {showIcon && <theme.Icon className={`w-4 h-4 ${theme.text}`} />}
          <div>
            <span className="text-xs font-bold text-slate-800">{label}</span>
            {sublabel && <p className="text-[11px] text-slate-500">{sublabel}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${theme.bg} ${theme.text} ${theme.border}`}>
            {theme.label}
          </span>
          <span className={`font-mono font-bold text-sm ${theme.text}`}>
            {animatedScore}%
          </span>
        </div>
      </div>

      {/* Meter Bar */}
      <div className={`w-full bg-slate-100 ${heightClass} rounded-full overflow-hidden`}>
        <motion.div
          initial={shouldReduceMotion ? { width: `${confidenceScore}%` } : { width: 0 }}
          animate={isInView ? { width: `${Math.min(100, Math.max(0, confidenceScore))}%` } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`${theme.bar} h-full rounded-full`}
        />
      </div>
    </div>
  );
};
