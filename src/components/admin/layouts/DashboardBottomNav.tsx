import { Home, Users, GitGraph, BarChart2, Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const bottomNavItems = [
  { title: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Groups", icon: GitGraph, href: "/admin/groups" },
  { title: "Analytics", icon: BarChart2, href: "/admin/analytics" },
  { title: "Moderation", icon: Shield, href: "/admin/moderation" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

export const DashboardBottomNav = ({ className }: { className?: string }) => {
  const location = useLocation();

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t md:hidden", className)}>
      <nav className="flex items-center h-16 px-2 overflow-x-auto no-scrollbar">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-[72px] shrink-0",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate hidden xs:block">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};