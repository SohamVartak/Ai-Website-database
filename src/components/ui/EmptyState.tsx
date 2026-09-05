import React from 'react';
import { Database } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
        {icon || <Database className="w-6 h-6" />}
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <AnimatedButton variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};
