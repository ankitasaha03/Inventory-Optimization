'use client';

import React, { useEffect } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { StockIQAssistant } from './StockIQAssistant';

export function AssistantDrawer() {
  const { isAssistantOpen, setIsAssistantOpen } = useInventory();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAssistantOpen) {
        setIsAssistantOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAssistantOpen, setIsAssistantOpen]);

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsAssistantOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-xl bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-all animate-in slide-in-from-right duration-300 flex flex-col">
          <StockIQAssistant isDrawer onCloseDrawer={() => setIsAssistantOpen(false)} />
        </div>
      </div>
    </div>
  );
}
