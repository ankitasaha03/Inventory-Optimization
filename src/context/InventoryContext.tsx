'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  InventoryItem,
  Supplier,
  PurchaseOrder,
  PromotionalCampaign,
  Category,
  Warehouse,
  StockStatus,
  SimulationMode,
} from '@/types/inventory';
import {
  INITIAL_INVENTORY,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
} from '@/data/mockInventory';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface InventoryContextType {
  items: InventoryItem[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  campaigns: PromotionalCampaign[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedWarehouse: Warehouse;
  setSelectedWarehouse: (wh: Warehouse) => void;
  selectedStatus: StockStatus | 'all';
  setSelectedStatus: (status: StockStatus | 'all') => void;
  selectedSkuForTrend: string;
  setSelectedSkuForTrend: (skuId: string) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  simulationMode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  actionModalItem: InventoryItem | null;
  setActionModalItem: (item: InventoryItem | null) => void;
  executeReorder: (skuId: string, quantity: number, isExpedited: boolean) => void;
  executeDiscount: (skuId: string, discountPercent: number, channel: any) => void;
  resetSimulation: () => void;
  filteredItems: InventoryItem[];
  metrics: {
    totalSkuCount: number;
    stockoutAlertsCount: number;
    excessInventoryValue: number;
    avgSupplierLeadTime: number;
    optimalCount: number;
    excessCount: number;
    reorderingCount: number;
  };
  toasts: Toast[];
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [campaigns, setCampaigns] = useState<PromotionalCampaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>('All Warehouses');
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | 'all'>('all');
  const [selectedSkuForTrend, setSelectedSkuForTrend] = useState<string>('SKU-8910');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [simulationMode, setSimulationModeState] = useState<SimulationMode>('normal');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [actionModalItem, setActionModalItem] = useState<InventoryItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reorder Execution
  const executeReorder = (skuId: string, quantity: number, isExpedited: boolean) => {
    const target = items.find((i) => i.id === skuId);
    if (!target) return;

    const poNumber = `PO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const cost = target.unitCost * quantity + (isExpedited ? 450 : 0);

    const newPO: PurchaseOrder = {
      id: 'po-' + Date.now(),
      poNumber,
      skuId: target.id,
      skuName: target.name,
      supplierName: target.supplierName,
      quantity,
      unitCost: target.unitCost,
      totalCost: cost,
      status: 'Sent',
      createdAt: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + (isExpedited ? 4 : target.supplierLeadTime) * 86400000)
        .toISOString()
        .split('T')[0],
      isExpedited,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === skuId) {
          return {
            ...item,
            status: 'reordering',
            aiAction: `PO #${poNumber} dispatched (${quantity} units). Est delivery in ${isExpedited ? '4' : item.supplierLeadTime} days`,
            lastExecutedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return item;
      })
    );

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // safe fallback
    }

    addToast(
      'Purchase Order Generated',
      `PO #${poNumber} for ${quantity}x "${target.name}" sent to ${target.supplierName}. Total: $${cost.toLocaleString()}`,
      'success'
    );

    setActionModalItem(null);
  };

  // Clearance / Discount Execution
  const executeDiscount = (
    skuId: string,
    discountPercent: number,
    channel: 'Omnichannel' | 'Web Flash Sale' | 'Outlet / In-Store' = 'Web Flash Sale'
  ) => {
    const target = items.find((i) => i.id === skuId);
    if (!target) return;

    const promoPrice = +(target.retailPrice * (1 - discountPercent / 100)).toFixed(2);
    const targetUnits = Math.min(target.currentStock - target.safetyStock, target.currentStock);
    const projectedRevenue = +(targetUnits * promoPrice).toFixed(2);

    const newCampaign: PromotionalCampaign = {
      id: 'camp-' + Date.now(),
      skuId: target.id,
      skuName: target.name,
      discountPercentage: discountPercent,
      originalPrice: target.retailPrice,
      promoPrice,
      targetUnits,
      channel,
      status: 'Active',
      projectedRevenue,
      activatedAt: new Date().toLocaleDateString(),
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === skuId) {
          const clearedStock = Math.max(item.safetyStock + 20, Math.floor(item.currentStock * 0.45));
          return {
            ...item,
            currentStock: clearedStock,
            daysRemaining: +(clearedStock / (item.dailyVelocity * 2.8)).toFixed(1),
            status: 'optimal',
            excessValue: 0,
            aiAction: `Flash Promo ${discountPercent}% Active on ${channel}. Velocity boosted to ~${(item.dailyVelocity * 2.8).toFixed(1)}/day`,
            lastExecutedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return item;
      })
    );

    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // safe fallback
    }

    addToast(
      'Clearance Campaign Launched',
      `${discountPercent}% promo applied to "${target.name}". Projected recovery: $${projectedRevenue.toLocaleString()}`,
      'success'
    );

    setActionModalItem(null);
  };

  // Simulation mode toggling
  const setSimulationMode = (mode: SimulationMode) => {
    setSimulationModeState(mode);
    if (mode === 'demand_surge') {
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          dailyVelocity: +(item.dailyVelocity * 1.45).toFixed(1),
          daysRemaining: +(item.currentStock / (item.dailyVelocity * 1.45)).toFixed(1),
          status: item.currentStock / (item.dailyVelocity * 1.45) < 7 ? 'stockout_risk' : item.status,
        }))
      );
      addToast(
        'Simulation: +45% Demand Surge',
        'Simulated high seasonal surge across all fulfillment nodes. 2 additional SKUs transitioned to Stockout Risk.',
        'warning'
      );
    } else if (mode === 'supply_delay') {
      setSuppliers((prev) =>
        prev.map((sup) => ({
          ...sup,
          avgLeadTime: +(sup.avgLeadTime + 6.5).toFixed(1),
          reliabilityScore: Math.max(50, +(sup.reliabilityScore - 12).toFixed(1)),
        }))
      );
      addToast(
        'Simulation: Port & Logistics Delay',
        'Added +6.5 days to supplier lead times. Supplier reliability scores adjusted downward.',
        'warning'
      );
    } else {
      resetSimulation();
    }
  };

  const resetSimulation = () => {
    setSimulationModeState('normal');
    setItems(INITIAL_INVENTORY);
    setSuppliers(INITIAL_SUPPLIERS);
    addToast('Simulation Reset', 'Inventory velocity, lead times, and stock levels restored to baseline telemetry.', 'info');
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchWarehouse = selectedWarehouse === 'All Warehouses' || item.warehouse === selectedWarehouse;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

      return matchSearch && matchCategory && matchWarehouse && matchStatus;
    });
  }, [items, searchQuery, selectedCategory, selectedWarehouse, selectedStatus]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const stockoutCount = items.filter((i) => i.status === 'stockout_risk').length;
    const excessCount = items.filter((i) => i.status === 'excess').length;
    const optimalCount = items.filter((i) => i.status === 'optimal').length;
    const reorderingCount = items.filter((i) => i.status === 'reordering').length;

    const excessVal = items
      .filter((i) => i.status === 'excess')
      .reduce((acc, curr) => acc + (curr.excessValue || (curr.currentStock - curr.safetyStock) * curr.unitCost), 0);

    const avgLead = suppliers.reduce((acc, s) => acc + s.avgLeadTime, 0) / (suppliers.length || 1);

    return {
      totalSkuCount: 2480 + (items.length - INITIAL_INVENTORY.length),
      stockoutAlertsCount: stockoutCount,
      excessInventoryValue: Math.round(excessVal + 115000), // realistic enterprise baseline
      avgSupplierLeadTime: +avgLead.toFixed(1),
      optimalCount,
      excessCount,
      reorderingCount,
    };
  }, [items, suppliers]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        suppliers,
        purchaseOrders,
        campaigns,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedWarehouse,
        setSelectedWarehouse,
        selectedStatus,
        setSelectedStatus,
        selectedSkuForTrend,
        setSelectedSkuForTrend,
        isAssistantOpen,
        setIsAssistantOpen,
        simulationMode,
        setSimulationMode,
        isDarkMode,
        toggleDarkMode,
        actionModalItem,
        setActionModalItem,
        executeReorder,
        executeDiscount,
        resetSimulation,
        filteredItems,
        metrics,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
