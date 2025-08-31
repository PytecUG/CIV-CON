import { DashboardHeader } from "./DashboardHeader";
import { DashboardCollapsibleSidebar } from "./DashboardCollapsibleSidebar";
import { DashboardBottomNav } from "./DashboardBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom"; // ⬅️ Import Outlet

export const DashboardLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main Layout */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)] relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <DashboardCollapsibleSidebar
            className="
              fixed top-16 left-0 h-[calc(100vh-4rem)] 
              bg-sidebar-background text-sidebar-foreground
              transition-all duration-300 overflow-hidden
              shadow-soft
            "
          />
        )}

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300
            ${!isMobile ? "ml-16 sm:ml-64" : "ml-0 w-full"}
          `}
        >
          <Outlet /> {/* ⬅️ This is where nested routes will render */}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <DashboardBottomNav
          className="fixed bottom-0 left-0 w-full bg-sidebar-background text-sidebar-foreground shadow-elegant"
        />
      )}
    </div>
  );
};
