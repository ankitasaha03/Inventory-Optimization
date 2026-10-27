'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useInventory } from '@/context/InventoryContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart as PieIcon } from 'lucide-react';
import { StockStatus } from '@/types/inventory';

export function InventoryHealthDonut() {
  const { metrics, selectedStatus, setSelectedStatus } = useInventory();

  const data = [
    { name: 'Optimal Stock', status: 'optimal' as StockStatus, value: metrics.optimalCount, color: '#10b981' },
    { name: 'Stockout Risk', status: 'stockout_risk' as StockStatus, value: metrics.stockoutAlertsCount, color: '#f43f5e' },
    { name: 'Excess / Slow', status: 'excess' as StockStatus, value: metrics.excessCount, color: '#f59e0b' },
    { name: 'Reordering Now', status: 'reordering' as StockStatus, value: metrics.reorderingCount, color: '#3b82f6' },
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const optimalPercentage = Math.round((metrics.optimalCount / total) * 100);

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-500" />
          Inventory Health Breakdown
        </CardTitle>
        <CardDescription>Distribution across operational status tiers</CardDescription>
      </CardHeader>

      <div className="p-5 pt-0 flex flex-col items-center">
        <div className="h-56 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={84}
                paddingAngle={4}
                dataKey="value"
                onClick={(entry: any) => {
                  const status = entry?.status || entry?.payload?.status;
                  if (status) {
                    setSelectedStatus(selectedStatus === status ? 'all' : status);
                  }
                }}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={selectedStatus === 'all' || selectedStatus === entry.status ? 1 : 0.35}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0];
                    const percent = Math.round(((d.value as number) / total) * 100);
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md text-xs">
                        <p className="font-semibold" style={{ color: d.payload.color }}>
                          {d.name}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                          {d.value} SKUs ({percent}%)
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 italic">Click to filter</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Central Donut Text */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {optimalPercentage}%
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Optimal Health
            </span>
          </div>
        </div>

        {/* Legend with interactive buttons */}
        <div className="grid grid-cols-2 gap-2 w-full mt-2">
          {data.map((item) => {
            const isSelected = selectedStatus === item.status;
            return (
              <button
                key={item.name}
                onClick={() => setSelectedStatus(isSelected ? 'all' : item.status)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs transition-all border ${
                  isSelected
                    ? 'border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 font-semibold'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100 ml-1">{item.value}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
