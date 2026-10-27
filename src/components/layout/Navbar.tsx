'use client';

import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Bot,
  Warehouse as WarehouseIcon,
  Layers,
  Sparkles,
  Download,
  RotateCcw,
} from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { Category, Warehouse, SimulationMode } from '@/types/inventory';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedWarehouse,
    setSelectedWarehouse,
    simulationMode,
    setSimulationMode,
    setIsAssistantOpen,
    filteredItems,
    addToast,
  } = useInventory();

  const categories: Category[] = [
    'All',
    'Electronics',
    'Apparel',
    'Home & Kitchen',
    'Footwear',
    'Accessories',
  ];

  const warehouses: Warehouse[] = [
    'All Warehouses',
    'US-West Reno',
    'US-East Bethlehem',
    'EU-Central Frankfurt',
    'Asia-Pac Singapore',
  ];

  const exportCSV = () => {
    const headers = [
      'SKU ID',
      'Name',
      'Category',
      'Warehouse',
      'Stock',
      'Safety Stock',
      'Velocity (units/day)',
      'Days Left',
      'Status',
      'Unit Cost',
      'Supplier',
      'AI Recommendation',
    ];
    const rows = filteredItems.map((item) => [
      item.id,
      `"${item.name}"`,
      item.category,
      item.warehouse,
      item.currentStock,
      item.safetyStock,
      item.dailyVelocity,
      item.daysRemaining,
      item.status,
      item.unitCost,
      `"${item.supplierName}"`,
      `"${item.aiAction}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StockIQ_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Export Successful', `Exported ${filteredItems.length} SKUs to CSV report.`, 'success');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-6 backdrop-blur-md">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-72 md:w-80">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, product, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Center/Right Controls: Warehouse, Category, What-If Simulation, AI Co-Pilot */}
      <div className="flex items-center gap-3">
        {/* Warehouse Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg">
          <WarehouseIcon className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value as Warehouse)}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
          >
            {warehouses.map((wh) => (
              <option key={wh} value={wh} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {wh}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category)}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* What-If Simulation Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <span className="px-2 py-0.5 text-[11px] font-semibold text-slate-400 hidden xl:inline flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> What-If:
          </span>
          <button
            onClick={() => setSimulationMode('normal')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
              simulationMode === 'normal'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => setSimulationMode('demand_surge')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
              simulationMode === 'demand_surge'
                ? 'bg-rose-500 text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-rose-500'
            }`}
            title="Simulate +45% Demand Surge across all fulfillment nodes"
          >
            +45% Demand
          </button>
          <button
            onClick={() => setSimulationMode('supply_delay')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
              simulationMode === 'supply_delay'
                ? 'bg-amber-500 text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-amber-500'
            }`}
            title="Simulate +6.5 days supplier transit delay"
          >
            +7d Port Delay
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={exportCSV}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors shadow-xs"
          title="Export Filtered Inventory CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          Export
        </button>

        {/* AI Assistant Drawer Trigger */}
        <Button
          variant="ai"
          size="sm"
          onClick={() => setIsAssistantOpen(true)}
          className="shadow-sm font-medium"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI Co-Pilot</span>
        </Button>
      </div>
    </header>
  );
}
