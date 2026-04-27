import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import InventoryPage from "@/pages/InventoryPage";
import LowStockPage from "@/pages/LowStockPage";
import HistoryPage from "@/pages/HistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import { useInventory } from "@/hooks/useInventory";

const queryClient = new QueryClient();

const BeadInventoryApp = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const { getLowStockColors } = useInventory();
  const lowStockCount = getLowStockColors().length;

  const renderPage = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryPage />;
      case "lowstock":
        return <LowStockPage />;
      case "history":
        return <HistoryPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <InventoryPage />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} lowStockCount={lowStockCount}>
      {renderPage()}
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BeadInventoryApp />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;