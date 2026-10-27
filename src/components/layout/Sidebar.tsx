'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Truck,
  Building2,
  Sparkles,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode, toggleDarkMode, setIsAssistantOpen, metrics, simulationMode } = useInventory();

  const navItems = [
    {
      name: 'Overview Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: metrics.stockoutAlertsCount > 0 ? `${metrics.stockoutAlertsCount} alerts` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      name: 'StockIQ Assistant',
      href: '/chat',
      icon: Bot,
      badge: 'AI Co-pilot',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    },
    {
      name: 'Purchase Orders',
      href: '/purchase-orders',
      icon: Truck,
      badge: 'Live',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    {
      name: 'Supplier Directory',
      href: '/suppliers',
      icon: Building2,
      badge: `${metrics.avgSupplierLeadTime}d SLA`,
      badgeColor: 'bg-slate-500/20 text-slate-400',
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-md shadow-blue-500/20 flex-shrink-0">
            <Zap className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                StockIQ <span className="text-xs px-1.5 py-0.2 rounded bg-blue-600 text-white font-semibold">AI</span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">Inventory Intelligence</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Simulation status pill if active */}
      {simulationMode !== 'normal' && !collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span className="font-medium truncate">
            {simulationMode === 'demand_surge' ? '+45% Demand Surge' : 'Supply Delay Active'}
          </span>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Assistant Quick Slide-over Launcher */}
      {!collapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/20 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold">Autonomous Copilot</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 leading-relaxed">
            4 stockout anomalies detected. Ask for reorder or clearance plans.
          </p>
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="w-full text-xs py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            Launch Assistant
          </button>
        </div>
      )}

      {/* Footer controls: System Health & Dark Mode */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 p-3 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-medium">Telemetry Synced</span>
          </div>
        )}

        <button
          onClick={toggleDarkMode}
          className={`rounded-lg p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </aside>
  );
}
