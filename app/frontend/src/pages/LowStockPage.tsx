import { useState, useMemo } from "react";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_COLORS, CATEGORY_CONFIG, type ColorCategory } from "@/data/colors";
import { useInventory } from "@/hooks/useInventory";
import StockEditor from "@/components/StockEditor";

const EMPTY_BEADS_URL = "https://mgx-backend-cdn.metadl.com/generate/images/1135264/2026-04-22/ndbdutaaafma/empty-state-beads.png";

export default function LowStockPage() {
  const { getRecord, isLowStock, getLowStockColors, updateStock, setThreshold, getColorHistory } = useInventory();
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const lowStockIds = getLowStockColors();
  const lowStockColors = useMemo(
    () => lowStockIds.map((id) => ALL_COLORS.find((c) => c.id === id)!).filter(Boolean),
    [lowStockIds]
  );

  // Group by category
  const grouped = useMemo(() => {
    const map: Record<string, typeof lowStockColors> = {};
    for (const color of lowStockColors) {
      if (!map[color.category]) map[color.category] = [];
      map[color.category].push(color);
    }
    return map;
  }, [lowStockColors]);

  const selectedColor = selectedColorId
    ? ALL_COLORS.find((c) => c.id === selectedColorId)
    : null;

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-red-100 p-2 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h2 className="font-bold text-gray-700 text-base">低库存提醒 💕</h2>
          <p className="text-xs text-gray-400">
            {lowStockColors.length > 0
              ? `${lowStockColors.length} 种颜色需要补货`
              : "所有颜色库存充足 🎉"}
          </p>
        </div>
      </div>

      {lowStockColors.length === 0 ? (
        <div className="text-center py-12">
          <img src={EMPTY_BEADS_URL} alt="" className="w-32 h-32 mx-auto mb-4 opacity-80" />
          <p className="text-sm text-gray-400 mb-1">库存充足，无需补货</p>
          <p className="text-xs text-pink-300">继续保持哦~ 🌸</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, colors]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{CATEGORY_CONFIG[category as ColorCategory]?.emoji}</span>
                <h3 className="text-sm font-bold text-gray-600">{category}</h3>
                <span className="text-xs text-gray-400">({colors.length})</span>
              </div>
              <div className="space-y-2">
                {colors.map((color) => {
                  const record = getRecord(color.id);
                  const ratio = record.threshold > 0 ? record.bottles / record.threshold : 0;

                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColorId(color.id)}
                      className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border border-red-100 shadow-sm active:scale-[0.98] transition-transform"
                    >
                      <div
                        className="w-10 h-10 rounded-full shadow-sm border-2 border-white ring-2 ring-red-200 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-700 text-sm">{color.id}</span>
                          <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            record.bottles === 0
                              ? "bg-red-100 text-red-500"
                              : "bg-orange-100 text-orange-500"
                          )}>
                            {record.bottles === 0 ? "缺货" : "低库存"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                ratio <= 0.3 ? "bg-red-400" : ratio <= 0.6 ? "bg-orange-400" : "bg-yellow-400"
                              )}
                              style={{ width: `${Math.min(100, ratio * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {record.bottles}/{record.threshold}瓶
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {record.particles}粒 | 阈值: {record.threshold}瓶
                        </p>
                      </div>
                      <ShoppingCart className="w-4 h-4 text-pink-300 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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