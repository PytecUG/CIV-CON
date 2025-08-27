import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Hash, 
  Compass, 
  UserPlus,
  Bell, 
  Settings,
  ChevronRight,
  X,
  User,
  GitGraph,
  Users,
  Plus,
  Video,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { title: "Home", icon: Home, href: "/feed" },
  { title: "Articles", icon: FileText, href: "/articles" },
  { title: "Topics", icon: GitGraph, href: "/topics" },
  { title: "Groups", icon: Users, href: "/groups" },
  { title: "Post", icon: Compass, href: "/post" },
  { title: "Connect", icon: UserPlus, href: "/People"},
  { title: "Live Discussion", icon: Video, href: "/join-discussions" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

interface CollapsibleSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const CollapsibleSidebar = ({ isOpen, onToggle, className }: CollapsibleSidebarProps) => {
  const location = useLocation();

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
          onClick={onToggle}
          className="h-8 w-8 hover:bg-accent transition-colors"
        >
          {isOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="p-2 space-y-1 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  !isOpen && "justify-center"
                )
              }
            >
              <div className="relative flex items-center">
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className={cn(
                      "absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center",
                      !isOpen ? "scale-75" : ""
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>

              {isOpen && (
                <span className="font-medium transition-opacity duration-200">
                  {item.title}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Trending Section */}
      {isOpen && (
        <div className="mt-6 px-4">
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Trending Now
            </h3>
            <div className="space-y-2">
              {[
                "#EducationReform",
                "#YouthEmployment", 
                "#Infrastructure",
                "#DigitalInnovation"
              ].map((trend, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {trend}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
