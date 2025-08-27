import { Home, MessageSquare, Hash, User, TrendingUp, GitGraph } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const bottomNavItems = [
  {
    title: "Feed",
    icon: Home,
    href: "/feed",
  },
  {
    title: "Topics",
    icon: GitGraph,
    href: "/topics",
  },
  {
    title: "Hot Topics",
    icon: TrendingUp,
    href: "/explore",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t md:hidden">
      <nav className="flex items-center justify-around h-16 px-2">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};