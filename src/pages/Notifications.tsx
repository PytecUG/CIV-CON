import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart, MessageCircle, UserPlus, BookOpen } from "lucide-react";

const notifications = [
  {
    id: '1',
    type: 'like',
    user: { name: 'Sarah Namuli', avatar: '/api/placeholder/40/40' },
    message: 'liked your post about youth employment',
    timestamp: '2 minutes ago',
    read: false,
    icon: Heart
  },
  {
    id: '2',
    type: 'comment',
    user: { name: 'Charles Onyango-Obbo', avatar: '/api/placeholder/40/40' },
    message: 'commented on your article about education reform',
    timestamp: '1 hour ago',
    read: false,
    icon: MessageCircle
  },
  {
    id: '3',
    type: 'follow',
    user: { name: 'Dr. Kiiza Besigye', avatar: '/api/placeholder/40/40' },
    message: 'started following you',
    timestamp: '3 hours ago',
    read: true,
    icon: UserPlus
  },
  {
    id: '4',
    type: 'article',
    user: { name: 'Grace Natabaalo', avatar: '/api/placeholder/40/40' },
    message: 'published a new article: "Climate Change and Agriculture"',
    timestamp: '5 hours ago',
    read: true,
    icon: BookOpen
  },
  {
    id: '5',
    type: 'like',
    user: { name: 'Hon. Rebecca Kadaga', avatar: '/api/placeholder/40/40' },
    message: 'liked your comment on infrastructure development',
    timestamp: '1 day ago',
    read: true,
    icon: Heart
  }
];

const Notifications = () => {
  const unreadCount = notifications.filter(n => !n.read).length;

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
                  <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="outline" size="sm">
                Mark all as read
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 hover:bg-accent cursor-pointer border-b last:border-b-0 ${
                      !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">{notification.user.name}</span>{' '}
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;