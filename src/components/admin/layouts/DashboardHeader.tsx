// src/components/admin/layouts/DashboardHeader.tsx
import { useState } from "react";
import {
  Search,
  Moon,
  Sun,
  Bell,
  Mail,
  MessageCircle,
  Settings,
  User,
  LogOut,
  Edit,
  Lock,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const DashboardHeader = () => {
  const { theme, setTheme } = useTheme();

  // ── Mock data (replace with real API later) ──────────────────────
  const unread = {
    total: 12,
    email: 5,
    chat: 3,
    system: 4,
  };

  // ── Dropdown states ───────────────────────────────────────────────
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* ── Logo ── */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
            <span className="text-white font-bold text-sm">UC</span>
          </div>
          <span className="font-bold text-xl text-gradient">CIV-CON</span>
        </div>

        {/* ── Search (desktop) ── */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users, groups, content..."
              className="pl-10 bg-muted/50 border-none focus-visible:ring-gray-400"
            />
          </div>
        </div>

        {/* ── Right side actions ── */}
        <div className="flex items-center space-x-3">

          {/* ── Theme toggle ── */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* ── Notification dropdown ── */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unread.total > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unread.total}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Email */}
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>Emails</span>
                </div>
                {unread.email > 0 && (
                  <Badge variant="secondary">{unread.email}</Badge>
                )}
              </DropdownMenuItem>

              {/* Chat */}
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span>Chat messages</span>
                </div>
                {unread.chat > 0 && (
                  <Badge variant="secondary">{unread.chat}</Badge>
                )}
              </DropdownMenuItem>

              {/* System */}
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <span>System alerts</span>
                </div>
                {unread.system > 0 && (
                  <Badge variant="secondary">{unread.system}</Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── Profile dropdown ── */}
          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full overflow-hidden"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/api/placeholder/32/32" alt="User" />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    JD
                  </AvatarFallback>
                </Avatar>

                {/* Online badge */}
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500",
                    "ring-2 ring-background"
                  )}
                  aria-label="Online"
                />
                <span className="sr-only">Open profile menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <NavLink to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  View Profile
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <NavLink to="/profile/edit" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <NavLink to="/profile/password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <NavLink to="/" className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};