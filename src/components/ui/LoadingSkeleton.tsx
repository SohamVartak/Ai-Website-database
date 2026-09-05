import React from 'react';

export interface LoadingSkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'table-row' | 'card';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  count = 1,
  className = ''
}) => {
  const items = Array.from({ length: count });

  if (variant === 'table-row') {
    return (
      <>
        {items.map((_, idx) => (
          <tr key={idx} className="animate-pulse border-b border-slate-100">
            <td className="p-3">
              <div className="h-4 bg-slate-200 rounded-md w-24"></div>
            </td>
            <td className="p-3">
              <div className="h-4 bg-slate-200 rounded-md w-48"></div>
            </td>
            <td className="p-3">
              <div className="h-4 bg-slate-200 rounded-md w-20"></div>
            </td>
            <td className="p-3">
              <div className="h-4 bg-slate-200 rounded-md w-16"></div>
            </td>
            <td className="p-3 text-right">
              <div className="h-4 bg-slate-200 rounded-md w-20 ml-auto"></div>
            </td>
          </tr>
        ))}
      </>
    );
  }

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl p-5 border border-slate-200 shadow-xs animate-pulse space-y-3 ${className}`}
          >
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-200 rounded w-28"></div>
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-20"></div>
            <div className="h-3 bg-slate-200 rounded w-36"></div>
          </div>
        ))}
      </div>
    );
  }

  const baseStyle = 'animate-pulse bg-slate-200';
  const variantStyles = {
    text: 'h-3.5 rounded-md w-full',
    rectangular: 'rounded-xl w-full h-24',
    circular: 'rounded-full w-10 h-10 shrink-0'
  };

  return (
    <div className="space-y-2">
      {items.map((_, idx) => (
        <div
          key={idx}
          className={`${baseStyle} ${variantStyles[variant as keyof typeof variantStyles]} ${className}`}
        />
      ))}
    </div>
  );
};
