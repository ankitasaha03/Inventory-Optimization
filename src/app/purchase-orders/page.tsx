'use client';

import React, { useState } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Plus, CheckCircle2, Clock, Search, ArrowUpRight, ShieldCheck } from 'lucide-react';

export function PurchaseOrdersView() {
  const { purchaseOrders, items, setActionModalItem } = useInventory();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = purchaseOrders.filter((po) => {
    const matchStatus = filterStatus === 'all' || po.status.toLowerCase() === filterStatus.toLowerCase();
    const matchQuery =
      query === '' ||
      po.poNumber.toLowerCase().includes(query.toLowerCase()) ||
      po.skuName.toLowerCase().includes(query.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalCost, 0);
  const inTransitCount = purchaseOrders.filter((p) => p.status === 'In Transit').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            Supplier Purchase Orders Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track automated and manual replenishment orders across all manufacturing vendors
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            const stockoutItem = items.find((i) => i.status === 'stockout_risk') || items[0];
            setActionModalItem(stockoutItem);
          }}
          className="text-xs"
        >
          <Plus className="w-4 h-4" />
          Create Emergency PO
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs font-medium text-slate-500">Total PO Volume Commitment</div>
          <div className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{purchaseOrders.length} total orders recorded</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-medium text-slate-500">In Transit Turnaround</div>
          <div className="text-2xl font-bold mt-1 text-blue-500">
            {inTransitCount} Shipments Active
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-1">✓ On-schedule delivery ETA</div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-medium text-slate-500">Expedited Air Freight Active</div>
          <div className="text-2xl font-bold mt-1 text-purple-500">
            {purchaseOrders.filter((p) => p.isExpedited).length} Expedited
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Safeguarding critical stockout runway</div>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter POs by number or item..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs self-start sm:self-auto">
          {['all', 'sent', 'in transit', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                filterStatus === st
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Orders Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500">
                <th className="py-3 px-4">PO Identifier</th>
                <th className="py-3 px-4">Target SKU / Product</th>
                <th className="py-3 px-4">Supplier Partner</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Est. Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-mono font-medium text-blue-500 flex items-center gap-1.5">
                    {po.poNumber}
                    {po.isExpedited && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Air Freight
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {po.skuName}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{po.supplierName}</td>
                  <td className="py-3 px-4 font-medium">{po.quantity.toLocaleString()} units</td>
                  <td className="py-3 px-4 text-slate-500">${po.unitCost.toFixed(2)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                    ${po.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{po.estimatedDelivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function PurchaseOrdersPage() {
  return <PurchaseOrdersView />;
}
