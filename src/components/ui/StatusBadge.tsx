import React from 'react';

export type StatusBadgeType =
  | 'Approved'
  | 'Pending'
  | 'High Priority'
  | 'Critical'
  | 'Rejected'
  | 'Needs More Data'
  | 'Deferred'
  | 'Active'
  | 'Resolved'
  | 'Valid'
  | 'Warning'
  | 'Error'
  | 'Standardized';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const normalized = status.toLowerCase();

  const getStyle = () => {
    if (normalized.includes('approv') || normalized.includes('valid') || normalized.includes('active') || normalized.includes('standard') || normalized.includes('resolv')) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-600'
      };
    }
    if (normalized.includes('reject') || normalized.includes('critical') || normalized.includes('error') || normalized.includes('fatal')) {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-600'
      };
    }
    if (normalized.includes('high') || normalized.includes('warn') || normalized.includes('need')) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-600'
      };
    }
    if (normalized.includes('defer') || normalized.includes('sync')) {
      return {
        bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        dot: 'bg-cyan-600'
      };
    }
    // Default Pending / Draft
    return {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-500'
    };
  };

  const style = getStyle();
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border font-mono select-none ${style.bg} ${sizeClass} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
      <span className="truncate">{status}</span>
    </span>
  );
};
