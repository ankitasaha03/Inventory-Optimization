'use client';

import React from 'react';
import { useInventory } from '@/context/InventoryContext';
import { MetricCards } from './MetricCards';
import { DemandStockTrendChart } from './DemandStockTrendChart';
import { InventoryHealthDonut } from './InventoryHealthDonut';
import { SupplierLeadTimeChart } from './SupplierLeadTimeChart';
import { ActionableRecommendationsTable } from './ActionableRecommendationsTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sparkles,
  Bot,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Tag,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export function DashboardView() {
  const {
    metrics,
    setIsAssistantOpen,
    campaigns,
    purchaseOrders,
    selectedCategory,
    selectedWarehouse,
    selectedStatus,
  } = useInventory();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top AI Intelligence Alert Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-blue-950/40 to-purple-950/40 p-4 md:p-5 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  StockIQ Neural Diagnostic: 4 Critical Stockout Runouts Detected
                </h2>
                <Badge variant="stockout_risk">High Urgency</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                High-demand items in Reno and Bethlehem are projected to stock out within <strong>1.7 to 3.3 days</strong>. 
                Average supplier lead time from Shenzhen is currently 14.2 days. Immediate expedited PO dispatch recommended.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Button
              variant="ai"
              size="sm"
              onClick={() => setIsAssistantOpen(true)}
              className="text-xs shadow-md"
            >
              <Bot className="w-4 h-4" />
              Open StockIQ Assistant
            </Button>
          </div>
        </div>

        {/* Active filter breadcrumbs if filtered */}
        {(selectedCategory !== 'All' || selectedWarehouse !== 'All Warehouses' || selectedStatus !== 'all') && (
          <div className="mt-3 pt-3 border-t border-indigo-500/20 flex items-center gap-2 text-xs text-indigo-300">
            <span className="font-semibold">Active Filter Scope:</span>
            {selectedCategory !== 'All' && <Badge variant="outline">Category: {selectedCategory}</Badge>}
            {selectedWarehouse !== 'All Warehouses' && <Badge variant="outline">Node: {selectedWarehouse}</Badge>}
            {selectedStatus !== 'all' && <Badge variant="outline">Status: {selectedStatus}</Badge>}
          </div>
        )}
      </div>

      {/* Top Metric Cards Row */}
      <MetricCards />

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DemandStockTrendChart />
        <InventoryHealthDonut />
      </div>

      {/* Secondary Supplier Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SupplierLeadTimeChart />
      </div>

      {/* Actionable Recommendations Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActionableRecommendationsTable />
      </div>

      {/* Active Promotional Markdown Campaigns (if any executed) */}
      {campaigns.length > 0 && (
        <Card className="p-5 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Active Clearance & Markdown Campaigns ({campaigns.length})
              </h3>
            </div>
            <span className="text-xs font-medium text-amber-500">
              Recovering trapped working capital
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {camp.skuName}
                  </span>
                  <Badge variant="excess">{camp.discountPercentage}% OFF</Badge>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Channel: {camp.channel}</span>
                  <span className="text-emerald-500 font-bold">
                    Est. ${camp.projectedRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Launched {camp.activatedAt} • Target: {camp.targetUnits} units
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Live Purchase Orders Snapshot */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Recent Replenishment Purchase Orders
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {purchaseOrders.length} active supplier orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 pb-2">
                <th className="py-2 px-3">PO Number</th>
                <th className="py-2 px-3">Item Name</th>
                <th className="py-2 px-3">Supplier</th>
                <th className="py-2 px-3">Units</th>
                <th className="py-2 px-3">Total Value</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Est Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-mono font-medium text-blue-500">{po.poNumber}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    {po.skuName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{po.supplierName}</td>
                  <td className="py-2.5 px-3 font-medium">{po.quantity}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    ${po.totalCost.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        po.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : po.status === 'In Transit'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                    {po.estimatedDelivery} {po.isExpedited && <span className="text-purple-500 font-bold">(Expedited)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
