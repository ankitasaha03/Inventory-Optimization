'use client';

import React from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Card } from '@/components/ui/card';
import {
  Boxes,
  AlertTriangle,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from 'lucide-react';

export function MetricCards() {
  const { metrics, selectedStatus, setSelectedStatus } = useInventory();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total SKU Count */}
      <Card
        onClick={() => setSelectedStatus('all')}
        className={`p-4 transition-all hover:scale-[1.01] ${
          selectedStatus === 'all'
            ? 'ring-1 ring-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20'
            : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total SKU Count
          </span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {metrics.totalSkuCount.toLocaleString()}
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3 h-3" /> +14 this mo
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          <span>{metrics.optimalCount} Optimal</span>
          <span className="text-blue-500 font-medium">{metrics.reorderingCount} In Transit</span>
        </div>
      </Card>

      {/* 2. Stockout Risk Alerts (High Priority) */}
      <Card
        onClick={() => setSelectedStatus(selectedStatus === 'stockout_risk' ? 'all' : 'stockout_risk')}
        className={`p-4 transition-all hover:scale-[1.01] cursor-pointer ${
          selectedStatus === 'stockout_risk'
            ? 'ring-2 ring-rose-500 bg-rose-50/20 dark:bg-rose-950/25'
            : 'hover:border-rose-300 dark:hover:border-rose-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            Stockout Risk Alerts
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </span>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {metrics.stockoutAlertsCount} SKUs
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <ArrowUpRight className="w-3 h-3" /> Urgent Action
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          <span>&lt; 3.5 days runway avg</span>
          <span className="text-rose-500 font-medium">Click to filter table</span>
        </div>
      </Card>

      {/* 3. Excess Inventory Value */}
      <Card
        onClick={() => setSelectedStatus(selectedStatus === 'excess' ? 'all' : 'excess')}
        className={`p-4 transition-all hover:scale-[1.01] cursor-pointer ${
          selectedStatus === 'excess'
            ? 'ring-2 ring-amber-500 bg-amber-50/20 dark:bg-amber-950/25'
            : 'hover:border-amber-300 dark:hover:border-amber-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Excess Inventory Value
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            ${metrics.excessInventoryValue.toLocaleString()}
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <TrendingUp className="w-3 h-3" /> {metrics.excessCount} SKUs
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          <span>Stagnant &gt; 60 days</span>
          <span className="text-amber-500 font-medium">Click to filter table</span>
        </div>
      </Card>

      {/* 4. Average Supplier Lead Time */}
      <Card className="p-4 transition-all hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Avg Supplier Lead Time
          </span>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {metrics.avgSupplierLeadTime} Days
          </span>
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowDownRight className="w-3 h-3" /> -1.2d SLA
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          <span>94.2% Reliability Score</span>
          <span className="text-emerald-500 font-medium">Tier-1 On-track</span>
        </div>
      </Card>
    </div>
  );
}
