export type StockStatus = 'optimal' | 'stockout_risk' | 'excess' | 'reordering';

export type Category = 
  | 'All'
  | 'Electronics'
  | 'Apparel'
  | 'Home & Kitchen'
  | 'Footwear'
  | 'Accessories';

export type Warehouse = 
  | 'All Warehouses'
  | 'US-West Reno'
  | 'US-East Bethlehem'
  | 'EU-Central Frankfurt'
  | 'Asia-Pac Singapore';

export interface InventoryItem {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  warehouse: Exclude<Warehouse, 'All Warehouses'>;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  dailyVelocity: number; // units sold / day
  daysRemaining: number;
  status: StockStatus;
  unitCost: number;
  retailPrice: number;
  excessValue?: number;
  supplierId: string;
  supplierName: string;
  supplierLeadTime: number; // days
  aiConfidence: number; // e.g. 96 (%)
  aiAction: string;
  aiActionType: 'reorder' | 'discount' | 'transfer' | 'optimize';
  recommendedQuantity?: number;
  recommendedDiscount?: number;
  lastExecutedAt?: string;
  stockHistory: {
    week: string;
    stock: number;
    demand: number;
    forecast?: number;
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  avgLeadTime: number;
  targetLeadTime: number;
  reliabilityScore: number; // 0-100%
  location: string;
  riskRating: 'Low Risk' | 'Medium Risk' | 'High Risk';
  activeOrders: number;
  onTimeDeliveryRate: number;
  primaryCategory: Exclude<Category, 'All'>;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  skuId: string;
  skuName: string;
  supplierName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  status: 'Draft' | 'Sent' | 'In Transit' | 'Delivered';
  createdAt: string;
  estimatedDelivery: string;
  isExpedited: boolean;
}

export interface PromotionalCampaign {
  id: string;
  skuId: string;
  skuName: string;
  discountPercentage: number;
  originalPrice: number;
  promoPrice: number;
  targetUnits: number;
  channel: 'Omnichannel' | 'Web Flash Sale' | 'Outlet / In-Store';
  status: 'Active' | 'Scheduled' | 'Ended';
  projectedRevenue: number;
  activatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  actionItem?: {
    skuId?: string;
    skuName?: string;
    actionTitle: string;
    actionType: 'reorder' | 'discount' | 'switch_sku' | 'filter_status';
    recommendedQuantity?: number;
    discountPercent?: number;
  };
  tableData?: {
    headers: string[];
    rows: Array<{
      sku: string;
      name: string;
      currentStock: number;
      daysRemaining: number;
      action: string;
      urgency: 'critical' | 'warning' | 'optimal';
    }>;
  };
}

export type SimulationMode = 'normal' | 'demand_surge' | 'supply_delay';
