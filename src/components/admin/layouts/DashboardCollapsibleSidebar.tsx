import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  GitGraph,
  BarChart2,
  Shield,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { title: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Groups", icon: GitGraph, href: "/admin/groups" },
  { title: "Analytics", icon: BarChart2, href: "/admin/analytics" },
  { title: "Content Moderation", icon: Shield, href: "/admin/moderation" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

interface DashboardCollapsibleSidebarProps {
  className?: string;
  onToggle?: (isOpen: boolean) => void; // 🔹 new prop to notify parent
}

export const DashboardCollapsibleSidebar = ({
  className,
  onToggle,
}: DashboardCollapsibleSidebarProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarIsOpen");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // 🔹 Sync sidebar state with localStorage + notify parent
  useEffect(() => {
    localStorage.setItem("sidebarIsOpen", JSON.stringify(isOpen));
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={cn(
        "flex flex-col h-[calc(100vh-4rem)] bg-background border-r border-border transition-all duration-300 ease-in-out z-30",
        isOpen ? "w-64" : "w-16",
        className
      )}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="h-8 w-8 hover:bg-accent rounded-md transition-colors"
        >
          {isOpen ? (
            <ChevronsLeft className="h-4 w-4" />
          ) : (
            <ChevronsRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="p-2 xs:p-3 space-y-1.5 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center justify-start p-3 w-full h-10 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                !isOpen && "justify-center"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-3 truncate">{item.title}</span>}

              {/* Tooltip when collapsed */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
