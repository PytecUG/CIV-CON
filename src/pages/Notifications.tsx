// src/pages/Notifications.tsx
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart, MessageCircle, UserPlus, BookOpen } from "lucide-react";
import { notificationService } from "@/services/notificationService";

interface Notification {
  id: number;
  type: string;
  user: {
    first_name?: string;
    last_name?: string;
    username?: string;
    profile_image?: string;
  };
  message: string;
  read: boolean; // backend may use is_read, map accordingly
  created_at: string;
}

const iconMap: Record<string, any> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  article: BookOpen,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  // fetch notifications on mount
  useEffect(() => {
    let mounted = true;

    const fetchAndMark = async () => {
      try {
        const data = await notificationService.getAll();
        if (!mounted) return;
        // map backend field names if needed (e.g. is_read -> read)
        const normalized = data.map((n: any) => ({
          id: n.id,
          type: n.type,
          user: n.user || {},
          message: n.message,
          read: n.is_read ?? n.read ?? false,
          created_at: n.created_at ?? n.createdAt,
        }));
        setNotifications(normalized);

        // find unread notifications
        const unread = normalized.filter((n: { read: boolean }) => !n.read);
        if (unread.length > 0) {
          // mark all unread as read on backend in parallel
          setMarkingAll(true);
          await notificationService.markAllAsRead(normalized);
          // update UI immediately
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          // dispatch a global event so other parts of the app (Header) can reset badge
          window.dispatchEvent(
            new CustomEvent("notifications:readAll", { detail: { count: unread.length } })
          );
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setNotifications([]);
      } finally {
        if (mounted) {
          setMarkingAll(false);
          setLoading(false);
        }
      }
    };

    fetchAndMark();

    return () => {
      mounted = false;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkOneRead = async (id: number) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      // notify header to decrement one
      window.dispatchEvent(new CustomEvent("notifications:markOneRead", { detail: { id } }));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 max-w-2xl text-center text-muted-foreground">
          Loading notifications...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    // allow manual mark all as read as fallback
                    await notificationService.markAllAsRead(notifications);
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                    window.dispatchEvent(new CustomEvent("notifications:readAll", { detail: { count: notifications.filter(n => !n.read).length } }));
                  }}
                  disabled={markingAll || unreadCount === 0}
                >
                  Mark all as read
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground p-6">
                No notifications yet.
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((n) => {
                  const Icon = iconMap[n.type] || Bell;
                  const fullName =
                    n.user?.first_name && n.user?.last_name
                      ? `${n.user.first_name} ${n.user.last_name}`
                      : n.user?.username || "User";

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleMarkOneRead(n.id)}
                      className={`flex items-start gap-3 p-4 hover:bg-accent cursor-pointer border-b last:border-b-0 ${
                        !n.read ? "bg-primary/5 border-l-4 border-l-primary" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={n.user?.profile_image || "/api/placeholder/40/40"}
                          alt={fullName}
                        />
                        <AvatarFallback>{fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">{fullName}</span> {n.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(n.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!n.read && <div className="w-2 h-2 bg-primary rounded-full mt-2" />}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;
