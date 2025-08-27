import { Header } from "./Header";
import { CollapsibleSidebar } from "./CollapsibleSidebar";
import { BottomNav } from "./BottomNav";
import { ModernChatBox } from "../chat/ModernChatBox";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Track sidebar state

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)] relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <CollapsibleSidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            className={`
              fixed top-16 left-0 h-[calc(100vh-4rem)] 
              bg-sidebar-background text-sidebar-foreground
              transition-all duration-300 overflow-hidden
              shadow-soft
              ${sidebarOpen ? "w-64" : "w-16"}
            `}
          />
        )}

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300
            ${!isMobile && sidebarOpen ? "ml-64" : !isMobile ? "ml-16" : "ml-0 w-full"}
          `}
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNav
          className="fixed bottom-0 left-0 w-full bg-sidebar-background text-sidebar-foreground shadow-elegant"
        />
      )}

      {/* Modern Chat Box */}
      <ModernChatBox className="fixed bottom-4 right-4 z-50" />
    </div>
  );
};