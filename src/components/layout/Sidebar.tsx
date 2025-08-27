import { Home, MessageSquare, Hash, User, Settings, FileText, TrendingUp, GitGraph, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

const sidebarItems = [
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
    title: "Articles",
    icon: FileText,
    href: "/articles",
  },
  {
    title: "connect",
    icon: Users,
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
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const trendingTopics = [
  {
    title: "Youth Employment",
    posts: 234,
  },
  {
    title: "Education Reform",
    posts: 189,
  },
  {
    title: "Infrastructure",
    posts: 145,
  },
];


export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-sidebar hidden md:block">
      <div className="flex flex-col h-full p-4">
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4",
                    isActive && "bg-primary text-primary-foreground shadow-soft",
                    !isActive && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Trending Topics Widget */}
        <div className="mt-auto pt-4 border-t">
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Trending Now</h3>
          <div className="space-y-2">
            <div className="text-xs text-sidebar-foreground/70">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="font-medium">#</span>
                  <span>{topic.title}</span>
                  <p className="text-sidebar-foreground/50">({topic.posts} discussions)</p>
                </div>
              ))}

            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};