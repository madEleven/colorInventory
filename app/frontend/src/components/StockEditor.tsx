import { useState } from "react";
import { X, Plus, Minus, Save, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryRecord, HistoryEntry } from "@/hooks/useInventory";
import type { BeadColor } from "@/data/colors";

interface StockEditorProps {
  color: BeadColor;
  record: InventoryRecord;
  history: HistoryEntry[];
  onClose: () => void;
  onUpdateStock: (colorId: string, type: "restock" | "consume", bottles: number, particles: number, note: string) => void;
  onSetThreshold: (colorId: string, threshold: number) => void;
}

export default function StockEditor({
  color,
  record,
  history,
  onClose,
  onUpdateStock,
  onSetThreshold,
}: StockEditorProps) {
  const [tab, setTab] = useState<"edit" | "history">("edit");
  const [operation, setOperation] = useState<"restock" | "consume">("restock");
  const [bottles, setBottles] = useState(1);
  const [particles, setParticles] = useState(0);
  const [note, setNote] = useState("");
  const [threshold, setThreshold] = useState(record.threshold);
  const [showThresholdEdit, setShowThresholdEdit] = useState(false);

  const isLow = record.bottles <= record.threshold;

  const handleSubmit = () => {
    if (bottles === 0 && particles === 0) return;
    onUpdateStock(color.id, operation, bottles, particles, note);
    setBottles(1);
    setParticles(0);
    setNote("");
  };

  const handleThresholdSave = () => {
    onSetThreshold(color.id, threshold);
    setShowThresholdEdit(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-pink-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full shadow-md border-2 border-white ring-2 ring-pink-200"
              style={{ backgroundColor: color.hex }}
            />
            <div>
              <h3 className="font-bold text-gray-700 text-lg">{color.id}</h3>
              <span className="text-xs text-pink-400">{color.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-pink-50 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Current Stock Display */}
        <div className={cn(
          "mx-5 mt-3 p-3 rounded-2xl flex items-center justify-between",
          isLow ? "bg-red-50 border border-red-200" : "bg-pink-50 border border-pink-200"
        )}>
          <div className="flex items-center gap-2">
            {isLow && <AlertTriangle className="w-4 h-4 text-red-400" />}
            <div>
              <p className="text-xs text-gray-500">当前库存</p>
              <p className={cn("font-bold text-lg", isLow ? "text-red-500" : "text-pink-600")}>
                {record.bottles}瓶 {record.particles}粒
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">阈值: {record.threshold}瓶</p>
            {!showThresholdEdit ? (
              <button
                onClick={() => setShowThresholdEdit(true)}
                className="text-[10px] text-pink-400 underline"
              >
                修改阈值
              </button>
            ) : (
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="number"
                  min={0}
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                  className="w-12 text-center text-xs border border-pink-200 rounded-lg py-0.5 focus:outline-none focus:border-pink-400"
                />
                <button onClick={handleThresholdSave} className="text-[10px] text-pink-500 font-bold">✓</button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Switch */}
        <div className="flex mx-5 mt-3 bg-pink-50 rounded-2xl p-1">
          <button
            onClick={() => setTab("edit")}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
              tab === "edit" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"
            )}
          >
            📝 调整库存
          </button>
          <button
            onClick={() => setTab("history")}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
              tab === "history" ? "bg-white text-pink-500 shadow-sm" : "text-gray-400"
            )}
          >
            📋 操作记录
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {tab === "edit" ? (
            <div className="space-y-4">
              {/* Operation Type */}
              <div className="flex gap-2">
                <button
                  onClick={() => setOperation("restock")}
                  className={cn(
                    "flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all",
                    operation === "restock"
                      ? "bg-green-400 text-white shadow-md"
                      : "bg-green-50 text-green-400 border border-green-200"
                  )}
                >
                  <Plus className="w-4 h-4" /> 补货
                </button>
                <button
                  onClick={() => setOperation("consume")}
                  className={cn(
                    "flex-1 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all",
                    operation === "consume"
                      ? "bg-orange-400 text-white shadow-md"
                      : "bg-orange-50 text-orange-400 border border-orange-200"
                  )}
                >
                  <Minus className="w-4 h-4" /> 消耗
                </button>
              </div>

              {/* Bottles */}
              <div>
                <label className="text-xs text-gray-500 font-bold mb-1.5 block">瓶数 🧴</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBottles(Math.max(0, bottles - 1))}
                    className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 font-bold text-lg flex items-center justify-center active:scale-90 transition-transform"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={bottles}
                    onChange={(e) => setBottles(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 text-center text-xl font-bold text-gray-700 border border-pink-200 rounded-2xl py-2 focus:outline-none focus:border-pink-400"
                  />
                  <button
                    onClick={() => setBottles(bottles + 1)}
                    className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 font-bold text-lg flex items-center justify-center active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Particles */}
              <div>
                <label className="text-xs text-gray-500 font-bold mb-1.5 block">粒数 💎</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setParticles(Math.max(0, particles - 100))}
                    className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 font-bold text-lg flex items-center justify-center active:scale-90 transition-transform"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={particles}
                    onChange={(e) => setParticles(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 text-center text-xl font-bold text-gray-700 border border-pink-200 rounded-2xl py-2 focus:outline-none focus:border-pink-400"
                  />
                  <button
                    onClick={() => setParticles(particles + 100)}
                    className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 font-bold text-lg flex items-center justify-center active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-center">每瓶约1200粒</p>
              </div>

              {/* Note */}
              <div>
                <label className="text-xs text-gray-500 font-bold mb-1.5 block">备注 📝</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="可选备注..."
                  className="w-full text-sm border border-pink-200 rounded-2xl py-2.5 px-4 focus:outline-none focus:border-pink-400 placeholder:text-pink-200"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={bottles === 0 && particles === 0}
                className={cn(
                  "w-full py-3 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg",
                  bottles === 0 && particles === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : operation === "restock"
                    ? "bg-gradient-to-r from-green-400 to-emerald-400 active:scale-95"
                    : "bg-gradient-to-r from-orange-400 to-amber-400 active:scale-95"
                )}
              >
                <Save className="w-4 h-4" />
                {operation === "restock" ? "确认补货 💚" : "确认消耗 🧡"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-2">🐱</p>
                  <p className="text-sm text-gray-400">暂无操作记录</p>
                </div>
              ) : (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "p-3 rounded-2xl border",
                      entry.type === "restock"
                        ? "bg-green-50 border-green-100"
                        : "bg-orange-50 border-orange-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        entry.type === "restock"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      )}>
                        {entry.type === "restock" ? "📥 补货" : "📤 消耗"}
                      </span>
                      <span className="text-[10px] text-gray-400">{formatDate(entry.date)}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-700 mt-1">
                      {entry.type === "restock" ? "+" : "-"}{entry.bottles}瓶 {entry.particles}粒
                    </p>
                    {entry.note && (
                      <p className="text-xs text-gray-400 mt-0.5">💬 {entry.note}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}