'use client';

import React from 'react';
import { useInventory } from '@/context/InventoryContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-blue-500/30 bg-blue-50/95 dark:bg-slate-900/95 text-blue-900 dark:text-blue-100';
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/30 bg-emerald-50/95 dark:bg-slate-900/95 text-emerald-950 dark:text-emerald-100';
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/30 bg-amber-50/95 dark:bg-slate-900/95 text-amber-950 dark:text-amber-100';
          iconColor = 'text-amber-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-normal break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
