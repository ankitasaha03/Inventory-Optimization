'use client';

import React from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  TrendingUp,
  Package,
  ExternalLink,
} from 'lucide-react';

export function SuppliersView() {
  const { suppliers, addToast } = useInventory();

  const handleAuditRequest = (supplierName: string) => {
    addToast(
      'SLA Audit Requested',
      `Audit notice dispatched to ${supplierName}. Turnaround telemetry will be refreshed.`,
      'info'
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-500" />
            Supplier Directory & SLA Performance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time lead time tracking, reliability scoring, and procurement risk classification
          </p>
        </div>
      </div>

      {/* Grid of Suppliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers.map((supplier) => {
          const isDelayed = supplier.avgLeadTime > supplier.targetLeadTime;
          const variance = +(supplier.avgLeadTime - supplier.targetLeadTime).toFixed(1);

          return (
            <Card key={supplier.id} className="p-5 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{supplier.location}</span>
                      <span>•</span>
                      <span>{supplier.primaryCategory}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      supplier.riskRating === 'Low Risk'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : supplier.riskRating === 'Medium Risk'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}
                  >
                    {supplier.riskRating}
                  </span>
                </div>

                {/* Lead Time Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      Avg Lead Time
                    </span>
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-baseline gap-1">
                      {supplier.avgLeadTime}d
                      {isDelayed ? (
                        <span className="text-[10px] font-semibold text-rose-500">
                          (+{variance}d)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-500">
                          (SLA OK)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Target: {supplier.targetLeadTime}d</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      Reliability Score
                    </span>
                    <div
                      className={`text-lg font-bold ${
                        supplier.reliabilityScore > 90
                          ? 'text-emerald-500'
                          : supplier.reliabilityScore > 80
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {supplier.reliabilityScore}%
                    </div>
                    <span className="text-[10px] text-slate-400">
                      On-Time: {supplier.onTimeDeliveryRate}%
                    </span>
                  </div>
                </div>

                {/* Active orders */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-blue-500" />
                    Active PO Shipments:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {supplier.activeOrders} orders
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAuditRequest(supplier.name)}
                  className="w-full text-xs"
                >
                  Request SLA Audit
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function SuppliersPage() {
  return <SuppliersView />;
}
