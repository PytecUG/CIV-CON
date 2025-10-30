import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  GitGraph,
  Users,
  UserPlus,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Video,
  Compass,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePost } from "@/components/forms/CreatePost";
import { cn } from "@/lib/utils";
import { postService } from "@/services/postService";

//  Strong typing for each sidebar item
interface SidebarItem {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  href?: string;
  badge?: string | number;
}

const sidebarItems: SidebarItem[] = [
  { title: "Home", icon: Home, href: "/feed" },
  { title: "Articles", icon: FileText, href: "/articles" },
  { title: "Topics", icon: GitGraph, href: "/topics" },
  { title: "Groups", icon: Users, href: "/groups" },
  { title: "Post", icon: Compass },
  { title: "Connect", icon: UserPlus, href: "/people" },
  { title: "Live Discussion", icon: Video, href: "/join-discussions" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

interface CollapsibleSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  isOpen,
  onToggle,
  className,
}) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          const isActive = item.href
            ? location.pathname === item.href
            : isModalOpen;

          //  Handle special “Post” modal button
          if (item.title === "Post") {
            return (
              <Dialog
                key={item.title}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start p-3 w-full h-10 rounded-lg transition-all duration-200 group text-sm font-medium",
                      isModalOpen
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      !isOpen && "justify-center"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="ml-3 truncate">{item.title}</span>
                    )}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] xs:max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] p-3 xs:p-4 sm:p-5">
                  <DialogHeader>
                    <DialogTitle className="text-sm xs:text-base sm:text-lg md:text-xl text-primary">
                      Create a New Post
                    </DialogTitle>
                  </DialogHeader>
                  <CreatePost />
                </DialogContent>
              </Dialog>
            );
          }

          //  Default Navigation Links
          return (
            <NavLink
              key={item.href}
              to={item.href || "#"}
              className={cn(
                "relative flex items-center justify-start p-3 w-full h-10 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                !isOpen && "justify-center"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-3 truncate">{item.title}</span>}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-4 w-4 p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 xs:p-3 border-t">
        <Button
          onClick={() => postService.logout()}
          variant="ghost"
          className={cn(
            "flex items-center justify-start p-3 w-full h-10 rounded-lg transition-all duration-200 group text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent",
            !isOpen && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span className="ml-3 truncate">Log Out</span>}
          {!isOpen && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Log Out
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
