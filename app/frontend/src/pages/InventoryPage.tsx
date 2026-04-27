import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_COLORS, ALL_CATEGORIES, CATEGORY_CONFIG, type ColorCategory } from "@/data/colors";
import { useInventory } from "@/hooks/useInventory";
import StockEditor from "@/components/StockEditor";

export default function InventoryPage() {
  const { getRecord, isLowStock, updateStock, setThreshold, getColorHistory } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<ColorCategory | "全部">("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const filteredColors = useMemo(() => {
    let colors = ALL_COLORS;
    if (selectedCategory !== "全部") {
      colors = colors.filter((c) => c.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toUpperCase();
      colors = colors.filter((c) => c.id.toUpperCase().includes(q));
    }
    return colors;
  }, [selectedCategory, searchQuery]);

  const selectedColor = selectedColorId
    ? ALL_COLORS.find((c) => c.id === selectedColorId)
    : null;

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索颜色编号..."
          className="w-full pl-9 pr-10 py-2.5 bg-white border border-pink-200 rounded-2xl text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-pink-200 shadow-sm"
        />
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors",
            showFilter ? "bg-pink-100 text-pink-500" : "text-pink-300 hover:text-pink-400"
          )}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter */}
      {showFilter && (
        <div className="mb-3 flex flex-wrap gap-1.5 animate-fade-in">
          <button
            onClick={() => setSelectedCategory("全部")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
              selectedCategory === "全部"
                ? "bg-pink-400 text-white shadow-sm"
                : "bg-pink-50 text-pink-400 border border-pink-200"
            )}
          >
            🌈 全部
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                selectedCategory === cat
                  ? "bg-pink-400 text-white shadow-sm"
                  : "bg-pink-50 text-pink-400 border border-pink-200"
              )}
            >
              {CATEGORY_CONFIG[cat].emoji} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs text-gray-400">
          共 <span className="text-pink-500 font-bold">{filteredColors.length}</span> 色
        </p>
        <p className="text-xs text-gray-400">
          💕 低库存 <span className="text-red-400 font-bold">{filteredColors.filter(c => isLowStock(c.id)).length}</span> 色
        </p>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-7 gap-2">
        {filteredColors.map((color) => {
          const record = getRecord(color.id);
          const low = isLowStock(color.id);
          const hasStock = record.bottles > 0 || record.particles > 0;

          return (
            <button
              key={color.id}
              onClick={() => setSelectedColorId(color.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1.5 rounded-2xl transition-all active:scale-90",
                low
                  ? "bg-red-50 border-2 border-red-200 shadow-sm"
                  : hasStock
                  ? "bg-white border border-pink-100 shadow-sm"
                  : "bg-gray-50/50 border border-gray-100"
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full shadow-sm border-2 border-white ring-1",
                    low ? "ring-red-200" : "ring-pink-100"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                {low && (
                  <span className="absolute -top-1 -right-1 text-[8px]">💕</span>
                )}
                {!hasStock && (
                  <span className="absolute -top-1 -right-1 text-[8px]">💤</span>
                )}
              </div>
              <span className={cn(
                "text-[9px] font-bold leading-tight",
                low ? "text-red-400" : hasStock ? "text-gray-600" : "text-gray-300"
              )}>
                {color.id}
              </span>
              {hasStock && (
                <span className={cn(
                  "text-[8px] leading-tight",
                  low ? "text-red-300" : "text-pink-400"
                )}>
                  {record.bottles}瓶
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filteredColors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-2">🐱</p>
          <p className="text-sm text-gray-400">没有找到匹配的颜色</p>
        </div>
      )}

      {/* Stock Editor Modal */}
      {selectedColor && (
        <StockEditor
          color={selectedColor}
          record={getRecord(selectedColor.id)}
          history={getColorHistory(selectedColor.id)}
          onClose={() => setSelectedColorId(null)}
          onUpdateStock={updateStock}
          onSetThreshold={setThreshold}
        />
      )}
    </div>
  );
}