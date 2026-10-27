'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Zap,
  Tag,
  ArrowRight,
  X,
  Maximize2,
  Minimize2,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ChatMessage } from '@/types/inventory';
import { INITIAL_AI_CHAT_MESSAGES } from '@/data/mockInventory';

interface AssistantProps {
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export function StockIQAssistant({ isDrawer = false, onCloseDrawer }: AssistantProps) {
  const {
    items,
    suppliers,
    executeReorder,
    executeDiscount,
    setSelectedSkuForTrend,
    setSelectedStatus,
    setActionModalItem,
  } = useInventory();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_AI_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Which items are at immediate risk of stocking out this week?',
    'Suggest a discount strategy for our top 3 slow-moving electronic accessories.',
    'What is the forecasted demand for Winter jackets next month based on seasonality?',
    'Show suppliers with lead times exceeding 12 days and low reliability.',
    'Generate emergency PO recommendations for all critical SKUs.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate intelligent LLM processing with rich context
    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiResponse: ChatMessage;

      if (lower.includes('stockout') || lower.includes('risk') || lower.includes('run out')) {
        const stockoutItems = items.filter((i) => i.status === 'stockout_risk');
        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### Immediate Stockout Risk Analysis (Next 72 Hours)

Our predictive neural model identified **${stockoutItems.length} SKUs** that will deplete before supplier replenishment arrives:

1. **UltraQuiet ANC Pro Headphones (SKU-8910)**: Only **1.7 days** of buffer remaining. Daily sales velocity is **14.2 units/day**, but supplier lead time from Shenzhen is **14 days**.
2. **Merino Wool Arctic Parka (SKU-4102)**: **2.8 days** of inventory left. Experiencing an unseasonal **+42% velocity spike**.
3. **MagFast 3-in-1 Charging Hub (SKU-7721)**: **3.3 days** left at current burn rate.

I recommend dispatching emergency expedited purchase orders immediately to avoid an estimated **$34,200 in lost revenue**.`,
          tableData: {
            headers: ['SKU', 'Product Name', 'Current Stock', 'Runout Runway', 'Prescribed Action'],
            rows: stockoutItems.map((item) => ({
              sku: item.id,
              name: item.name,
              currentStock: item.currentStock,
              daysRemaining: item.daysRemaining,
              action: item.aiAction,
              urgency: 'critical',
            })),
          },
          actionItem: {
            skuId: 'SKU-8910',
            skuName: 'UltraQuiet ANC Pro Wireless Headphones',
            actionTitle: '⚡ One-Click Expedited Reorder (250 units)',
            actionType: 'reorder',
            recommendedQuantity: 250,
          },
        };
      } else if (lower.includes('discount') || lower.includes('slow-moving') || lower.includes('excess') || lower.includes('accessories')) {
        const excessItems = items.filter((i) => i.status === 'excess');
        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### Markdown & Working Capital Optimization Plan

You currently have **$27,695 in stagnant capital** tied up in slow-moving inventory (> 120 days supply). Here is the prescribed pricing elasticity strategy:

- **Retro Stylus Touch Pen (SKU-1192)**: 680 units on-hand (**618 days of supply**). Apply a **35% Flash Sale** ($24.99 → $16.24) and bundle with tablet folios.
- **Neon Silicone Keyboard Covers (SKU-6601)**: 1,250 units on-hand (**543 days of supply**). Recommend an aggressive **40% cart cross-sell discount**.
- **Distressed Leather Messenger Bag (SKU-7209)**: **216 days of supply**. Run a **22% weekend promotion**.

Executing this clearance markdown will recover approximately **$19,535 in free cash flow** within 14 days.`,
          actionItem: {
            skuId: 'SKU-1192',
            skuName: 'Retro Stylus Touch Pen (Gunmetal)',
            actionTitle: '🏷️ Launch 35% Clearance Flash Sale',
            actionType: 'discount',
            discountPercent: 35,
          },
        };
      } else if (lower.includes('winter') || lower.includes('jacket') || lower.includes('forecast') || lower.includes('seasonality')) {
        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### Seasonality Forecast: Outerwear & Winter Apparel

Based on our multi-year climate telemetry and Q4 retail indexing:

• **Projected Demand Lift**: Outerwear categories will experience a **+48% demand surge** over the next 45 days.
• **Merino Wool Arctic Parka (SKU-4102)**: Forecasted demand is **55 units/week** (Week 7) scaling to **62 units/week** (Week 9).
• **Vulnerability Flag**: Nordic Apparel Logistics has a low lead time of 6.1 days, but current stock is only 18 units. A complete stockout is scheduled to occur by Thursday without immediate replenishment.

Would you like to inspect the historical and forecasted runout curve?`,
          actionItem: {
            skuId: 'SKU-4102',
            skuName: 'Merino Wool Arctic Parka (Obsidian)',
            actionTitle: '📈 View Parka in Demand vs Stock Trend Chart',
            actionType: 'switch_sku',
          },
        };
      } else if (lower.includes('supplier') || lower.includes('lead time') || lower.includes('sla')) {
        const risky = suppliers.filter((s) => s.avgLeadTime > 12 || s.reliabilityScore < 85);
        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### Supplier Reliability & Lead Time Risk Audit

Two primary manufacturing partners are currently violating their contractual SLA commitments:

1. **Apex Electronics Shenzhen (SUP-01)**:
   - **Actual Avg Lead Time**: 14.2 days vs 10.0 days SLA (**+4.2 days variance**)
   - **Reliability Score**: 81.5%
   - **Impact**: Elevates stockout probability for ANC Pro Headphones & MagFast Hubs. Recommend negotiating buffer consignment stock.

2. **TerraHome Global Mills (SUP-05)**:
   - **Actual Avg Lead Time**: 16.5 days vs 12.0 days SLA (**+4.5 days variance**)
   - **Reliability Score**: 76.8% (High Risk)`,
        };
      } else {
        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `I have analyzed your query across **2,480 catalog SKUs**, active supplier replenishment pipelines, and regional warehouse telemetry.

• **Catalog Health**: 64% Optimal, 14% Stockout Risk, 18% Slow-Moving Excess, 4% Reordering In-Transit.
• **Top Recommendation**: Address the **4 critical stockouts** in Reno and Bethlehem warehouses to protect **$34k in weekly margin**.
• **Simulation Engine**: You can also simulate a 45% demand surge or 7-day port delay from the top bar to test supply resilience.

Would you like me to generate a replenishment order or execute clearance promotions for slow movers?`,
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 900);
  };

  const handleActionClick = (action: ChatMessage['actionItem']) => {
    if (!action) return;

    if (action.actionType === 'reorder' && action.skuId) {
      const target = items.find((i) => i.id === action.skuId);
      if (target) {
        setActionModalItem(target);
      }
    } else if (action.actionType === 'discount' && action.skuId) {
      const target = items.find((i) => i.id === action.skuId);
      if (target) {
        setActionModalItem(target);
      }
    } else if (action.actionType === 'switch_sku' && action.skuId) {
      setSelectedSkuForTrend(action.skuId);
      if (isDrawer && onCloseDrawer) {
        onCloseDrawer();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-sm">
            <Bot className="w-4 h-4" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight">StockIQ Assistant</h3>
              <Badge variant="ai" className="text-[10px] py-0 px-1.5">
                Enterprise AI
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Context-Aware Retail Inventory Co-pilot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages(INITIAL_AI_CHAT_MESSAGES)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isDrawer && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs ${
                  isUser
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-100/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Formatted Text */}
                <div className="whitespace-pre-line space-y-1.5">
                  {msg.text.split('\n\n').map((paragraph, i) => (
                    <p key={i}>
                      {paragraph.split('**').map((part, index) =>
                        index % 2 === 1 ? (
                          <strong key={index} className="font-semibold text-slate-900 dark:text-white">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  ))}
                </div>

                {/* Embedded Structured Table if present */}
                {msg.tableData && (
                  <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          {msg.tableData.headers.map((h) => (
                            <th key={h} className="py-1.5 px-2.5 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {msg.tableData.rows.map((row) => (
                          <tr key={row.sku} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                            <td className="py-2 px-2.5 font-mono text-[10px] text-slate-400">{row.sku}</td>
                            <td className="py-2 px-2.5 font-semibold text-slate-900 dark:text-slate-100">
                              {row.name}
                            </td>
                            <td className="py-2 px-2.5 font-medium">{row.currentStock}</td>
                            <td className="py-2 px-2.5 text-rose-500 font-bold">{row.daysRemaining} days</td>
                            <td className="py-2 px-2.5 text-slate-600 dark:text-slate-300">{row.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Embedded Quick Action Button */}
                {msg.actionItem && (
                  <div className="pt-2">
                    <Button
                      variant="ai"
                      size="sm"
                      onClick={() => handleActionClick(msg.actionItem)}
                      className="text-xs font-semibold shadow-sm w-full sm:w-auto"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {msg.actionItem.actionTitle}
                    </Button>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 dark:text-slate-500 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-slate-400 ml-1.5 font-medium">StockIQ is analyzing inventory telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Suggestions:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask StockIQ anything (e.g. 'How much capital is trapped in Reno warehouse?')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <Button
            type="submit"
            variant="ai"
            size="md"
            disabled={isTyping || !inputValue.trim()}
            className="rounded-xl px-4 py-2.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
