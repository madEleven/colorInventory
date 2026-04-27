import { useState, useMemo } from "react";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_COLORS } from "@/data/colors";
import { useInventory } from "@/hooks/useInventory";

export default function HistoryPage() {
  const { getAllHistory } = useInventory();
  const allHistory = getAllHistory();
  const [filterType, setFilterType] = useState<"all" | "restock" | "consume">("all");

  const filteredHistory = useMemo(() => {
    if (filterType === "all") return allHistory;
    return allHistory.filter((h) => h.type === filterType);
  }, [allHistory, filterType]);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, typeof filteredHistory> = {};
    for (const entry of filteredHistory) {
      const d = new Date(entry.date);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    }
    return map;
  }, [filteredHistory]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "今天 🌸";
    if (d.toDateString() === yesterday.toDateString()) return "昨天 🌙";
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  // Stats
  const totalRestock = allHistory.filter((h) => h.type === "restock").reduce((s, h) => s + h.bottles, 0);
  const totalConsume = allHistory.filter((h) => h.type === "consume").reduce((s, h) => s + h.bottles, 0);

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-2xl border border-green-100">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[10px] text-green-500 font-bold">总补货</span>
          </div>
          <p className="text-xl font-bold text-green-600">{totalRestock}<span className="text-xs ml-0.5">瓶</span></p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-2xl border border-orange-100">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] text-orange-500 font-bold">总消耗</span>
          </div>
          <p className="text-xl font-bold text-orange-600">{totalConsume}<span className="text-xs ml-0.5">瓶</span></p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "all" as const, label: "全部", emoji: "📋" },
          { id: "restock" as const, label: "补货", emoji: "📥" },
          { id: "consume" as const, label: "消耗", emoji: "📤" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              filterType === f.id
                ? "bg-pink-400 text-white shadow-sm"
                : "bg-pink-50 text-pink-400 border border-pink-200"
            )}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      {/* History List */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-2">🐱</p>
          <p className="text-sm text-gray-400">暂无操作记录</p>
          <p className="text-xs text-pink-300 mt-1">开始管理你的拼豆库存吧~</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, entries]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-pink-300" />
                  <span className="text-xs font-bold text-gray-500">{formatDate(entries[0].date)}</span>
                  <div className="flex-1 h-px bg-pink-100" />
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => {
                    const color = ALL_COLORS.find((c) => c.id === entry.colorId);
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border",
                          entry.type === "restock"
                            ? "bg-green-50/50 border-green-100"
                            : "bg-orange-50/50 border-orange-100"
                        )}
                      >
                        {color && (
                          <div
                            className="w-8 h-8 rounded-full shadow-sm border-2 border-white ring-1 ring-pink-100 flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-700">{entry.colorId}</span>
                            <span className="text-[10px] text-gray-400">{formatTime(entry.date)}</span>
                          </div>
                          <p className={cn(
                            "text-xs font-bold mt-0.5",
                            entry.type === "restock" ? "text-green-500" : "text-orange-500"
                          )}>
                            {entry.type === "restock" ? "📥 补货" : "📤 消耗"}{" "}
                            {entry.type === "restock" ? "+" : "-"}{entry.bottles}瓶 {entry.particles}粒
                          </p>
                          {entry.note && (
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">💬 {entry.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}