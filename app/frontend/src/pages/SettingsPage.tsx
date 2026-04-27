import { useState, useRef } from "react";
import { Download, Upload, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInventory } from "@/hooks/useInventory";

export default function SettingsPage() {
  const { exportData, importData } = useInventory();
  const [showConfirm, setShowConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [exportFileName, setExportFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const fileName = `bead-inventory-${new Date().toISOString().slice(0, 10)}.json`;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setExportFileName(fileName);
    setTimeout(() => setExportFileName(null), 4000);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = importData(text);
      setImportStatus(ok ? "success" : "error");
      setTimeout(() => setImportStatus("idle"), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearData = () => {
    localStorage.removeItem("bead-inventory-data");
    setShowConfirm(false);
    window.location.reload();
  };

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-pink-100 p-2 rounded-2xl">
          <Info className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h2 className="font-bold text-gray-700 text-base">设置 ⚙️</h2>
          <p className="text-xs text-gray-400">数据管理与导出</p>
        </div>
      </div>

      {/* Data Management */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 px-1">📦 数据管理</h3>

        {/* Export */}
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-pink-100 shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="bg-green-100 p-2.5 rounded-xl">
            <Download className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-left flex-1">
            <p className="font-bold text-gray-700 text-sm">导出数据</p>
            <p className="text-xs text-gray-400">将库存数据导出后可存入网盘防止丢失</p>
          </div>
          <span className="text-pink-300 text-lg">📥</span>
        </button>

        {/* Import */}
        <button
          onClick={handleImport}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-pink-100 shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="bg-blue-100 p-2.5 rounded-xl">
            <Upload className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-left flex-1">
            <p className="font-bold text-gray-700 text-sm">导入数据</p>
            <p className="text-xs text-gray-400">导入文件恢复库存数据</p>
          </div>
          <span className="text-pink-300 text-lg">📤</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Export Success Popup */}
        {exportFileName && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center animate-fade-in">
            <p className="text-sm text-green-600 font-bold">✅ 导出成功！</p>
            <p className="text-xs text-green-500 mt-1">文件名：{exportFileName}</p>
          </div>
        )}

        {/* Import Status */}
        {importStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center animate-fade-in">
            <p className="text-sm text-green-600 font-bold">✅ 导入成功！</p>
          </div>
        )}
        {importStatus === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center animate-fade-in">
            <p className="text-sm text-red-500 font-bold">❌ 导入失败，文件格式不正确</p>
          </div>
        )}

        {/* Clear Data */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-500 px-1 mb-3">⚠️ 危险操作</h3>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-red-100 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="bg-red-100 p-2.5 rounded-xl">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-red-500 text-sm">清除所有数据</p>
                <p className="text-xs text-gray-400">删除所有库存和操作记录</p>
              </div>
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-fade-in">
              <p className="text-sm text-red-600 font-bold mb-3">确定要清除所有数据吗？此操作不可恢复！</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-500"
                >
                  取消
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-2 rounded-xl bg-red-400 text-white text-sm font-bold"
                >
                  确认清除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="mt-8 text-center">
        <p className="text-3xl mb-2">🎀</p>
        <p className="text-xs text-gray-400">拼豆库存管理工具 v1.0</p>
        <p className="text-[10px] text-pink-300 mt-1">Made with 💕</p>
      </div>
    </div>
  );
}