import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: string | number;
    direction?: 'up' | 'down' | 'neutral';
    label?: string;
    positiveIsGood?: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  progressPercent?: number;
  progressLabel?: string;
  className?: string;
  delay?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  subtitle,
  icon,
  iconBg = 'bg-slate-100',
  iconColor = 'text-slate-700',
  progressPercent,
  progressLabel,
  className = '',
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();

  // If value is numeric, count up
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  const isNumeric = !isNaN(numericValue) && typeof value === 'number';

  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    if (shouldReduceMotion) {
      setDisplayValue(numericValue);
      return;
    }

    let startTime: number | null = null;
    const duration = 1200; // ms

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * numericValue));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(numericValue);
      }
    };

    const animId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animId);
  }, [isInView, isNumeric, numericValue, shouldReduceMotion]);

  const formattedNumber = isNumeric
    ? displayValue.toLocaleString('en-IN')
    : String(value);

  const getTrendStyle = () => {
    if (!trend) return null;
    const isPositive = trend.direction === 'up';
    const isGood = trend.positiveIsGood !== false ? isPositive : !isPositive;

    if (trend.direction === 'neutral') {
      return {
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        Icon: Minus
      };
    }

    return {
      badgeBg: isGood
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-rose-50 text-rose-700 border-rose-200',
      Icon: isPositive ? TrendingUp : TrendingDown
    };
  };

  const trendStyle = getTrendStyle();

  return (
    <motion.div
      ref={cardRef}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: delay * 0.08, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      className={`bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 group flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono truncate">
            {label}
          </span>
          {icon && (
            <div
              className={`w-9 h-9 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Value Row with Count-Up */}
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-mono">
            {prefix}
            {formattedNumber}
            {suffix}
          </span>

          {trend && trendStyle && (
            <motion.span
              initial={shouldReduceMotion ? {} : { scale: 0.85, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: delay * 0.08 + 0.3, duration: 0.3 }}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${trendStyle.badgeBg}`}
            >
              <trendStyle.Icon className="w-3 h-3" />
              <span>{trend.value}</span>
            </motion.span>
          )}
        </div>

        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {/* Optional Progress Bar */}
      {typeof progressPercent === 'number' && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
            <span>{progressLabel || 'Progress'}</span>
            <span className="font-semibold text-slate-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={shouldReduceMotion ? { width: `${progressPercent}%` } : { width: 0 }}
              animate={isInView ? { width: `${Math.min(100, Math.max(0, progressPercent))}%` } : {}}
              transition={{ duration: 0.8, delay: delay * 0.08 + 0.2, ease: 'easeOut' }}
              className="bg-emerald-600 h-full rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
