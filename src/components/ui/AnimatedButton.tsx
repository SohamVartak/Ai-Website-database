import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  isSuccess?: boolean;
  successText?: string;
  isError?: boolean;
  errorText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  isSuccess = false,
  successText,
  isError = false,
  errorText,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  onClick,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  const variantStyles = {
    primary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow-md border border-transparent',
    secondary:
      'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs hover:shadow-md border border-transparent',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md border border-transparent',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md border border-transparent',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-xs px-3.5 py-2 rounded-lg gap-2',
    lg: 'text-sm px-5 py-2.5 rounded-xl gap-2.5'
  };

  const isDisabled = disabled || isLoading || isSuccess;

  return (
    <motion.button
      whileHover={shouldReduceMotion || isDisabled ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion || isDisabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={isDisabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center font-semibold transition-colors duration-150 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...(rest as any)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{loadingText || 'Loading...'}</span>
        </span>
      ) : isSuccess ? (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5 text-emerald-100"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{successText || 'Completed'}</span>
        </motion.span>
      ) : isError ? (
        <motion.span
          initial={{ x: -2 }}
          animate={{ x: [0, -2, 2, -2, 0] }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 text-rose-200"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorText || 'Failed'}</span>
        </motion.span>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span className="truncate">{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};
