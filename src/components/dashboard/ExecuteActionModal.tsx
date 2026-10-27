'use client';

import React, { useState, useEffect } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Tag,
  Zap,
  Calendar,
  DollarSign,
  AlertTriangle,
  Building,
  CheckCircle2,
} from 'lucide-react';

export function ExecuteActionModal() {
  const { actionModalItem, setActionModalItem, executeReorder, executeDiscount } = useInventory();

  const [quantity, setQuantity] = useState(150);
  const [isExpedited, setIsExpedited] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [promoChannel, setPromoChannel] = useState<'Omnichannel' | 'Web Flash Sale' | 'Outlet / In-Store'>('Web Flash Sale');

  useEffect(() => {
    if (actionModalItem) {
      if (actionModalItem.recommendedQuantity) {
        setQuantity(actionModalItem.recommendedQuantity);
      }
      if (actionModalItem.recommendedDiscount) {
        setDiscountPercent(actionModalItem.recommendedDiscount);
      }
      setIsExpedited(actionModalItem.daysRemaining < 3);
    }
  }, [actionModalItem]);

  if (!actionModalItem) return null;

  const isReorder = actionModalItem.aiActionType === 'reorder' || actionModalItem.status === 'stockout_risk';
  const isDiscount = actionModalItem.aiActionType === 'discount' || actionModalItem.status === 'excess';

  const unitCost = actionModalItem.unitCost;
  const totalCost = quantity * unitCost + (isExpedited ? 450 : 0);
  const promoPrice = +(actionModalItem.retailPrice * (1 - discountPercent / 100)).toFixed(2);
  const estClearanceRevenue = +(actionModalItem.currentStock * promoPrice).toFixed(2);

  const handleConfirm = () => {
    if (isReorder) {
      executeReorder(actionModalItem.id, quantity, isExpedited);
    } else if (isDiscount) {
      executeDiscount(actionModalItem.id, discountPercent, promoChannel);
    } else {
      setActionModalItem(null);
    }
  };

  return (
    <Modal
      isOpen={!!actionModalItem}
      onClose={() => setActionModalItem(null)}
      title={isReorder ? 'Execute Immediate Purchase Order' : isDiscount ? 'Launch Promotional Clearance' : 'Inventory Optimization'}
      description={`AI Recommendation for ${actionModalItem.id} — ${actionModalItem.name}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Item Summary Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                {actionModalItem.name}
              </span>
              <Badge variant={actionModalItem.status}>{actionModalItem.status.replace('_', ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Category: {actionModalItem.category} • Warehouse: {actionModalItem.warehouse}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Current Stock</span>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {actionModalItem.currentStock} units
            </div>
          </div>
        </div>

        {/* AI Action Brief */}
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">AI Recommendation Engine ({actionModalItem.aiConfidence}% confidence):</span>
            <p className="mt-0.5">{actionModalItem.aiAction}</p>
          </div>
        </div>

        {/* Config Form: Reorder Mode */}
        {isReorder && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Reorder Quantity
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Supplier
                </label>
                <div className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="truncate">{actionModalItem.supplierName}</span>
                  <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Expedited Freight Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/40">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Expedited Air Freight (+ $450)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cuts lead time from {actionModalItem.supplierLeadTime} days down to 4 days
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isExpedited}
                onChange={(e) => setIsExpedited(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* PO Cost Calculation */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500">Unit Cost: ${unitCost.toFixed(2)}</span>
                {isExpedited && <span className="text-blue-500 ml-2">+ $450 Rush Freight</span>}
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total PO Commitment</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Config Form: Clearance / Discount Mode */}
        {isDiscount && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Discount Markdown (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-amber-500 w-10 text-right">{discountPercent}%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Channel Target
                </label>
                <select
                  value={promoChannel}
                  onChange={(e) => setPromoChannel(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Web Flash Sale">Web Flash Sale (48h)</option>
                  <option value="Omnichannel">Omnichannel (Online & Store)</option>
                  <option value="Outlet / In-Store">Outlet / In-Store Clearance</option>
                </select>
              </div>
            </div>

            {/* Markdown impact banner */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 line-through mr-1.5">${actionModalItem.retailPrice}</span>
                <span className="text-base font-bold text-amber-500">${promoPrice} Promo Price</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Est. Recovered Capital</span>
                <span className="text-base font-bold text-emerald-500">
                  ${estClearanceRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" onClick={() => setActionModalItem(null)}>
            Cancel
          </Button>
          <Button
            variant={isReorder ? 'primary' : 'ai'}
            size="sm"
            onClick={handleConfirm}
            className="font-medium"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isReorder ? 'Approve & Dispatch PO' : isDiscount ? 'Launch Promo Campaign' : 'Confirm Action'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
