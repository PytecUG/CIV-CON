import {
  Search,
  Bell,
  Moon,
  Sun,
  Calendar,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

//  Correct imports
import { notificationService } from "@/services/notificationService"; // REST API (getAll, markRead)
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "@/services/notificationWS"; // WebSocket live updates

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState<number>(0);

  const handleLogout = () => {
    disconnectNotificationSocket();
    logout();
    toast.success("Logged out successfully");
  };

  //  Fetch unread notifications count (REST)
  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getAll();
      const unread = data.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications count:", err);
    }
  };

  //  Manage WebSocket connection + real-time updates
  useEffect(() => {
    if (!token || !user) return;

    fetchUnreadCount();

    let ws = connectNotificationSocket(token, (message) => {
      console.log("📡 New notification:", message);
      setUnreadCount((prev) => prev + 1);
      toast.info(message.message || "New notification received!");
    });

    //  Auto-reconnect if WS closes
    ws.onclose = () => {
      console.warn(" WebSocket closed — reconnecting in 5s...");
      setTimeout(() => {
        if (token) {
          ws = connectNotificationSocket(token, (message) => {
            setUnreadCount((prev) => prev + 1);
          });
        }
      }, 5000);
    };

    // Custom DOM events to sync with Notifications page
    const onReadAll = () => setUnreadCount(0);
    const onMarkOne = () => setUnreadCount((prev) => Math.max(0, prev - 1));

    window.addEventListener("notifications:readAll", onReadAll);
    window.addEventListener("notifications:markOneRead", onMarkOne);

    return () => {
      disconnectNotificationSocket();
      window.removeEventListener("notifications:readAll", onReadAll);
      window.removeEventListener("notifications:markOneRead", onMarkOne);
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [token, user?.id]);

  //  Loading State
  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </header>
    );
  }

  //  Main Header
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <span className="text-white font-bold text-sm">UC</span>
          </div>
          <span className="font-bold text-xl text-gradient">CIV-CON</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search discussions, articles, topics..."
              className="pl-10 bg-muted/50 border-none focus-visible:ring-gray-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Events */}
          <Link to="/events">
            <Button variant="ghost" size="icon">
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>

          {/* Notifications */}
          {user && (
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border border-border hover:ring-2 hover:ring-primary/50 transition-all">
                  <AvatarImage
                    src={user.profile_image || "/api/placeholder/32/32"}
                    alt={user.first_name}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {user.first_name?.[0]}
                    {user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 mt-2 shadow-lg">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  <User className="h-4 w-4 mr-2 text-primary" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="h-4 w-4 mr-2 text-primary" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 cursor-pointer focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
