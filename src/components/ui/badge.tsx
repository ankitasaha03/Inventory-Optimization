import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'optimal' | 'stockout_risk' | 'excess' | 'reordering' | 'neutral' | 'outline' | 'ai';
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', className = '', children, ...props }: BadgeProps) {
  let style = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (variant === 'optimal') {
    style = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  } else if (variant === 'stockout_risk') {
    style = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse';
  } else if (variant === 'excess') {
    style = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  } else if (variant === 'reordering') {
    style = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  } else if (variant === 'ai') {
    style = 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-500/30 font-medium';
  } else if (variant === 'outline') {
    style = 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${style} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
