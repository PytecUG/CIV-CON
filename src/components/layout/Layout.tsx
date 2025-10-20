import { Header } from "./Header";
import { CollapsibleSidebar } from "./CollapsibleSidebar";
import { BottomNav } from "./BottomNav";
import { ModernChatBox } from "../chat/ModernChatBox";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  // SSR-safe initializer for localStorage
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return true; // default while SSR
      const saved = localStorage.getItem("sidebarOpen");
      return saved !== null ? saved === "true" : true;
    } catch (e) {
      return true;
    }
  });

  // Persist changes to localStorage (client-side)
  useEffect(() => {
    try {
      localStorage.setItem("sidebarOpen", sidebarOpen.toString());
    } catch (e) {
      // ignore (e.g. storage disabled)
    }
  }, [sidebarOpen]);

  const handleToggle = () => setSidebarOpen((s) => !s);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 min-h-[calc(100vh-4rem)] relative">
        {!isMobile && (
          <CollapsibleSidebar
            isOpen={sidebarOpen}
            onToggle={handleToggle}
            className={`
              fixed top-16 left-0 h-[calc(100vh-4rem)] 
              bg-sidebar-background text-sidebar-foreground
              transition-all duration-300 overflow-hidden
              shadow-soft
              ${sidebarOpen ? "w-64" : "w-16"}
            `}
          />
        )}

        <main
          className={`
            flex-1 transition-all duration-300
            ${!isMobile && sidebarOpen ? "ml-64" : !isMobile ? "ml-16" : "ml-0 w-full"}
          `}
        >
          {children}
        </main>
      </div>

      {isMobile && (
        <BottomNav
          className="fixed bottom-0 left-0 w-full bg-sidebar-background text-sidebar-foreground shadow-elegant"
        />
      )}

      <ModernChatBox className="fixed bottom-4 right-4 z-50" />
    </div>
  );
};
