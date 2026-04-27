import { useState, useEffect, useCallback } from "react";

export interface InventoryRecord {
  bottles: number;    // 瓶数
  particles: number;  // 粒数
  threshold: number;  // 低库存阈值（瓶）
}

export interface HistoryEntry {
  id: string;
  colorId: string;
  type: "restock" | "consume";  // 补货 or 消耗
  bottles: number;
  particles: number;
  date: string;
  note: string;
}

export interface InventoryData {
  records: Record<string, InventoryRecord>;
  history: HistoryEntry[];
}

const STORAGE_KEY = "bead-inventory-data";

const DEFAULT_RECORD: InventoryRecord = {
  bottles: 0,
  particles: 0,
  threshold: 1,
};

function loadData(): InventoryData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return { records: {}, history: [] };
}

function saveData(data: InventoryData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useInventory() {
  const [data, setData] = useState<InventoryData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const getRecord = useCallback(
    (colorId: string): InventoryRecord => {
      return data.records[colorId] || { ...DEFAULT_RECORD };
    },
    [data.records]
  );

  const updateStock = useCallback(
    (
      colorId: string,
      type: "restock" | "consume",
      bottles: number,
      particles: number,
      note: string = ""
    ) => {
      setData((prev) => {
        const current = prev.records[colorId] || { ...DEFAULT_RECORD };
        let newBottles = current.bottles;
        let newParticles = current.particles;

        if (type === "restock") {
          newBottles = current.bottles + bottles;
          newParticles = current.particles + particles;
        } else {
          newBottles = Math.max(0, current.bottles - bottles);
          newParticles = Math.max(0, current.particles - particles);
        }

        const entry: HistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          colorId,
          type,
          bottles,
          particles,
          date: new Date().toISOString(),
          note,
        };

        return {
          records: {
            ...prev.records,
            [colorId]: { bottles: newBottles, particles: newParticles, threshold: current.threshold },
          },
          history: [entry, ...prev.history],
        };
      });
    },
    []
  );

  const setThreshold = useCallback((colorId: string, threshold: number) => {
    setData((prev) => {
      const current = prev.records[colorId] || { ...DEFAULT_RECORD };
      return {
        records: {
          ...prev.records,
          [colorId]: { ...current, threshold },
        },
        history: prev.history,
      };
    });
  }, []);

  const isLowStock = useCallback(
    (colorId: string): boolean => {
      const record = data.records[colorId];
      if (!record) return false;
      return record.bottles <= record.threshold;
    },
    [data.records]
  );

  const getLowStockColors = useCallback((): string[] => {
    return Object.entries(data.records)
      .filter(([, record]) => record.bottles <= record.threshold)
      .map(([colorId]) => colorId);
  }, [data.records]);

  const getColorHistory = useCallback(
    (colorId: string): HistoryEntry[] => {
      return data.history.filter((entry) => entry.colorId === colorId);
    },
    [data.history]
  );

  const getAllHistory = useCallback((): HistoryEntry[] => {
    return data.history;
  }, [data.history]);

  const exportData = useCallback((): string => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as InventoryData;
      if (parsed.records && parsed.history) {
        setData(parsed);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  return {
    getRecord,
    updateStock,
    setThreshold,
    isLowStock,
    getLowStockColors,
    getColorHistory,
    getAllHistory,
    exportData,
    importData,
  };
}