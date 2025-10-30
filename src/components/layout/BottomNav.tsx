import {
  Home,
  MessageSquare,
  User,
  Settings,
  FileText,
  GitGraph,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface BottomNavProps {
  className?: string;
}

const bottomNavItems = [
  { title: "Feed", icon: Home, href: "/feed" },
  { title: "Topics", icon: GitGraph, href: "/topics" },
  { title: "Articles", icon: FileText, href: "/articles" },
  { title: "Connect", icon: Users, href: "/explore" },
  { title: "Messages", icon: MessageSquare, href: "/messages" },
  { title: "Profile", icon: User, href: "/profile" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const location = useLocation();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t md:hidden",
        className
      )}
    >
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
