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
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { debounce } from "lodash";
import { searchService } from "@/services/searchService"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { notificationService } from "@/services/notificationService";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "@/services/notificationWS";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState<number>(0);

  // ✅ Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleLogout = () => {
    disconnectNotificationSocket();
    logout();
    toast.success("Logged out successfully");
  };

  // 🔔 Notifications (unchanged)
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

  useEffect(() => {
    if (!token || !user) return;

    fetchUnreadCount();

    let ws = connectNotificationSocket(token, (message) => {
      setUnreadCount((prev) => prev + 1);
      toast.info(message.message || "New notification received!");
    });

    ws.onclose = () => {
      setTimeout(() => {
        if (token) {
          ws = connectNotificationSocket(token, (message) => {
            setUnreadCount((prev) => prev + 1);
          });
        }
      }, 5000);
    };

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

  // ✅ Debounced search handler
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        setSearching(true);
        const results = await searchService.globalSearch(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setSearching(false);
      }
    }, 400),
    []
  );

  // ✅ Search input change
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    handleSearch(q);
  };

  // ✅ Navigate to full search page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  // ✅ Navigate when clicking a suggestion
  const handleSuggestionClick = (item: any) => {
    setShowSuggestions(false);
    if (item.type === "article") navigate(`/articles/${item.id}`);
    else if (item.type === "post") navigate(`/posts/${item.id}`);
    else if (item.type === "discussion") navigate(`/discussions/${item.id}`);
    else if (item.type === "user") navigate(`/profile/${item.id}`);
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </header>
    );
  }

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

        {/* ✅ Search Box */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <form onSubmit={handleSubmit} className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search discussions, articles, topics..."
              value={searchQuery}
              onChange={onSearchChange}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 bg-muted/50 border-none focus-visible:ring-gray-400"
            />
          </form>

          {/* ✅ Suggestions Dropdown */}
          {showSuggestions && searchQuery.trim() && (
            <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
              {searching && (
                <div className="p-3 text-sm text-muted-foreground">Searching...</div>
              )}
              {!searching && suggestions.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">
                  No results found.
                </div>
              )}
              {!searching &&
                suggestions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(item)}
                    className="p-3 text-sm hover:bg-muted cursor-pointer transition-all"
                  >
                    <span className="font-medium">{item.title || item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({item.type})
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Actions (unchanged) */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link to="/events">
            <Button variant="ghost" size="icon">
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>

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
