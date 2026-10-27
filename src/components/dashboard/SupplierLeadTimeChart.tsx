'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useInventory } from '@/context/InventoryContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Truck, ShieldAlert } from 'lucide-react';

export function SupplierLeadTimeChart() {
  const { suppliers, isDarkMode } = useInventory();

  const data = suppliers.map((s) => ({
    name: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    fullName: s.name,
    avgLeadTime: s.avgLeadTime,
    targetLeadTime: s.targetLeadTime,
    reliabilityScore: s.reliabilityScore,
    riskRating: s.riskRating,
    location: s.location,
  }));

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-500" />
            Supplier Lead Time Performance & SLA Compliance
          </CardTitle>
          <CardDescription>
            Actual replenishment turnaround days vs contractual target SLAs with reliability ratings
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
            <span>Avg Lead Time</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700"></span>
            <span>Target SLA</span>
          </div>
        </div>
      </CardHeader>

      <div className="p-5 pt-0">
        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
              <XAxis
                dataKey="name"
                stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-12}
                textAnchor="end"
              />
              <YAxis
                stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit="d"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const isExceeding = d.avgLeadTime > d.targetLeadTime;
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{d.fullName}</p>
                        <p className="text-[11px] text-slate-400">Hub: {d.location}</p>
                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
                          <p className="flex justify-between gap-4">
                            <span className="text-slate-500">Avg Lead Time:</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{d.avgLeadTime} days</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-slate-500">Target SLA:</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{d.targetLeadTime} days</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-slate-500">Reliability Score:</span>
                            <span
                              className={`font-semibold ${
                                d.reliabilityScore > 90
                                  ? 'text-emerald-500'
                                  : d.reliabilityScore > 80
                                  ? 'text-amber-500'
                                  : 'text-rose-500'
                              }`}
                            >
                              {d.reliabilityScore}%
                            </span>
                          </p>
                          {isExceeding && (
                            <p className="text-rose-500 font-medium text-[11px] flex items-center gap-1 mt-1">
                              <ShieldAlert className="w-3 h-3" /> Exceeding SLA by +{(d.avgLeadTime - d.targetLeadTime).toFixed(1)} days
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avgLeadTime" name="Avg Lead Time (Days)" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => {
                  let color = '#3b82f6';
                  if (entry.avgLeadTime > entry.targetLeadTime + 2) {
                    color = '#f43f5e'; // High delay
                  } else if (entry.avgLeadTime > entry.targetLeadTime) {
                    color = '#f59e0b'; // Moderate delay
                  } else {
                    color = '#10b981'; // Ahead of schedule
                  }
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
              <Bar dataKey="targetLeadTime" name="Target SLA" fill={isDarkMode ? '#334155' : '#cbd5e1'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Supplier summary pills */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {suppliers.map((s) => (
            <div
              key={s.id}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 text-xs"
            >
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {s.name.split(' ')[0]}
              </div>
              <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500 dark:text-slate-400">
                <span>{s.avgLeadTime}d avg</span>
                <span
                  className={`font-semibold ${
                    s.reliabilityScore > 90
                      ? 'text-emerald-500'
                      : s.reliabilityScore > 80
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }`}
                >
                  {s.reliabilityScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
