import { useState, useEffect } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardCollapsibleSidebar } from "./DashboardCollapsibleSidebar";
import { DashboardBottomNav } from "./DashboardBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔹 Sync with localStorage to match the sidebar's saved state
  useEffect(() => {
    const saved = localStorage.getItem("sidebarIsOpen");
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Layout */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)] relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DashboardCollapsibleSidebar
            onToggle={(open) => setSidebarOpen(open)} // 🔹 track open/closed state
            className={`
              fixed top-16 left-0 h-[calc(100vh-4rem)]
              bg-sidebar-background text-sidebar-foreground
              transition-all duration-300 overflow-hidden shadow-soft
            `}
          />
        )}

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-[margin,width] duration-300 ease-in-out
            ${!isMobile ? (sidebarOpen ? "ml-64" : "ml-16") : "ml-0 w-full"}
          `}
        >
          <div className="p-4 sm:p-6 md:p-8">
            <Outlet /> {/* ⬅️ Nested routes render here */}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <DashboardBottomNav className="fixed bottom-0 left-0 w-full bg-sidebar-background text-sidebar-foreground shadow-elegant" />
      )}
    </div>
  );
};
