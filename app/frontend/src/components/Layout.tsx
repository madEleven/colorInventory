import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  lowStockCount: number;
}

const CAT_MASCOT_URL = "https://mgx-backend-cdn.metadl.com/generate/images/1135264/2026-04-22/ndbdt7yaaflq/cute-cat-mascot.png";
const HEADER_DECOR_URL = "https://mgx-backend-cdn.metadl.com/generate/images/1135264/2026-04-22/ndbd5cqaafna/header-decoration.png";

const tabs = [
  { id: "inventory", label: "库存", emoji: "🎨" },
  { id: "lowstock", label: "补货", emoji: "🛒" },
  { id: "history", label: "记录", emoji: "📋" },
  { id: "settings", label: "设置", emoji: "⚙️" },
];

export default function Layout({ children, activeTab, onTabChange, lowStockCount }: LayoutProps) {
  const [showSparkle, setShowSparkle] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 px-4 pt-3 pb-2 shadow-md">
        <div className="absolute inset-0 opacity-20">
          <img src={HEADER_DECOR_URL} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={CAT_MASCOT_URL} alt="🐱" className="w-10 h-10 drop-shadow-md" />
            <div>
              <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
                🎀 拼豆库存
              </h1>
              <p className="text-pink-100 text-[10px] leading-tight">Perler Bead Inventory</p>
            </div>
          </div>
          {lowStockCount > 0 && (
            <div className="bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm animate-bounce">
              <span className="text-xs">💕</span>
              <span className="text-pink-500 text-xs font-bold">{lowStockCount}色需补</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        {showSparkle && (
          <div className="absolute inset-0 pointer-events-none z-50">
            <span className="absolute top-4 left-1/4 text-xl animate-ping">✨</span>
            <span className="absolute top-8 right-1/3 text-lg animate-ping delay-100">💫</span>
          </div>
        )}
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 shadow-[0_-4px_12px_rgba(255,105,180,0.3)] z-40">
        <div className="flex items-center justify-around py-1.5 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 min-w-[64px]",
                activeTab === tab.id
                  ? "bg-white/90 shadow-md scale-105"
                  : "hover:bg-white/30 active:scale-95"
              )}
            >
              <span className={cn(
                "text-xl transition-transform duration-300",
                activeTab === tab.id && "animate-bounce"
              )}>
                {tab.emoji}
              </span>
              <span className={cn(
                "text-[10px] font-bold",
                activeTab === tab.id ? "text-pink-500" : "text-white"
              )}>
                {tab.label}
              </span>
              {tab.id === "lowstock" && lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-400 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {lowStockCount > 9 ? "9+" : lowStockCount}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Cute bottom decoration */}
        <div className="flex justify-center gap-1 pb-1 opacity-60">
          <span className="text-[8px]">🐾</span>
          <span className="text-[8px]">🐾</span>
          <span className="text-[8px]">🐾</span>
        </div>
      </nav>
    </div>
  );
}