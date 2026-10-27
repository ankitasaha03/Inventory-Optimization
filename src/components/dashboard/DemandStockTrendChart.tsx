'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useInventory } from '@/context/InventoryContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export function DemandStockTrendChart() {
  const { items, selectedSkuForTrend, setSelectedSkuForTrend, isDarkMode } = useInventory();
  const [includeHolidaySurge, setIncludeHolidaySurge] = useState(false);

  // Find active SKU
  const activeItem = items.find((i) => i.id === selectedSkuForTrend) || items[0];

  // Prepare chart data with optional holiday surge overlay
  const chartData = (activeItem?.stockHistory || []).map((point) => {
    const surgeMultiplier = includeHolidaySurge && point.forecast ? 1.28 : 1.0;
    return {
      week: point.week,
      stock: point.stock,
      demand: point.demand > 0 ? point.demand : null,
      forecast: point.forecast ? Math.round(point.forecast * surgeMultiplier) : null,
    };
  });

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Demand vs. Stock Levels Trend
            </CardTitle>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/20">
              AI Forecast
            </span>
          </div>
          <CardDescription className="mt-1">
            Historical demand velocity vs real-time on-hand stock and predictive runout curves
          </CardDescription>
        </div>

        {/* Controls: Select SKU + Seasonality Toggle */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <select
            value={selectedSkuForTrend}
            onChange={(e) => setSelectedSkuForTrend(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[200px] truncate"
          >
            {items.map((sku) => (
              <option key={sku.id} value={sku.id}>
                {sku.name.length > 28 ? sku.name.substring(0, 26) + '...' : sku.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIncludeHolidaySurge(!includeHolidaySurge)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium ${
              includeHolidaySurge
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle +28% Seasonality Lift"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            +28% Surge
          </button>
        </div>
      </CardHeader>

      {/* Chart Body */}
      <div className="p-5 pt-0">
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="week"
                stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{label}</p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name}:
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {entry.value} units
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />
              <ReferenceLine
                y={activeItem?.safetyStock || 50}
                label={{
                  value: `Safety Stock (${activeItem?.safetyStock || 50})`,
                  fill: '#f43f5e',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
                stroke="#f43f5e"
                strokeDasharray="3 3"
              />
              <Area
                type="monotone"
                dataKey="stock"
                name="Stock Level"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#stockGradient)"
              />
              <Line
                type="monotone"
                dataKey="demand"
                name="Historical Demand"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="AI Forecasted Demand"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#a855f7' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Item context banner */}
        <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Runout forecast:{' '}
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                {activeItem?.daysRemaining || 0} days remaining
              </span>{' '}
              at current burn of {activeItem?.dailyVelocity} units/day
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Warehouse: {activeItem?.warehouse}
          </span>
        </div>
      </div>
    </Card>
  );
}
