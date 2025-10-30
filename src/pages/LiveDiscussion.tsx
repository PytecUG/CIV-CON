import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, Radio, Heart, Pin } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { liveFeedService } from "@/services/liveFeedService";
import {
  connectLiveFeedSocket,
  disconnectLiveFeedSocket,
  sendLiveFeedMessage,
} from "@/services/liveFeedSocket";
import type { User } from "@/types/user";

interface LiveMessage {
  id: string | number;
  user: {
    name: string;
    avatar?: string;
    role?: string;
    verified?: boolean;
  };
  message: string;
  timestamp: string;
  likes?: number;
  isPinned?: boolean;
  type?: "system" | "chat";
}

export default function LiveDiscussion() {
  const { feed_id } = useParams();
  const { token, user } = useAuth();
  const [feed, setFeed] = useState<any | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /**  Fetch live feed details */
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const data = await liveFeedService.getOne(Number(feed_id));
        setFeed(data);
      } catch {
        toast.error("Failed to load live feed");
      } finally {
        setLoading(false);
      }
    };
    if (feed_id) fetchFeed();
  }, [feed_id]);

  /**  Fetch past chat messages */
  const fetchMessages = useCallback(async () => {
    try {
      const res = await liveFeedService.getMessages(Number(feed_id));
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, [feed_id]);

  /**  WebSocket connection with reconnection support */
  useEffect(() => {
    if (!feed_id || !token) return;

    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      const socket = connectLiveFeedSocket(Number(feed_id), token, (msg: any) => {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      });

      setConnected(true);

      socket.onclose = () => {
        setConnected(false);
        toast.warning("Connection lost. Reconnecting...");
        reconnectTimer = setTimeout(connect, 4000); // retry after 4s
      };

      (window as any).currentLiveSocket = socket;
    };

    fetchMessages();
    connect();

    return () => {
      clearTimeout(reconnectTimer);
      disconnectLiveFeedSocket();
    };
  }, [feed_id, token, fetchMessages]);

  /** ✉️ Send message */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) {
      if (!connected) toast.warning("Not connected. Please wait...");
      return;
    }

    const optimisticMsg: LiveMessage = {
      id: Date.now(),
      user: {
        name: user?.first_name + " " + user?.last_name || "You",
        avatar: user?.profile_image || "/api/placeholder/40/40",
        role: user?.role || "citizen",
        verified: user?.verified || false,
      },
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
      type: "chat",
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    sendLiveFeedMessage(newMessage.trim());
    setNewMessage("");
    scrollToBottom();
  };

  /**  Like message (local only) */
  const handleLikeMessage = (messageId: string | number) => {
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === messageId ? { ...msg, likes: (msg.likes || 0) + 1 } : msg
      )
    );
  };

  /**  Role badge color */
  const getRoleColor = (role?: string) => {
    switch (role) {
      case "journalist":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "moderator":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "mp":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  /** 🕐 Scroll to bottom (debounced for performance) */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    );
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center text-muted-foreground">
          Loading live discussion...
        </div>
      </Layout>
    );
  }

  if (!feed) {
    return (
      <Layout>
        <div className="container mx-auto py-12 text-center text-muted-foreground">
          Live discussion not found or has ended.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {feed.title}
                  </h1>
                  {feed.is_active && (
                    <Badge
                      variant="destructive"
                      className="bg-red-500 text-white animate-pulse"
                    >
                      <Radio className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{feed.description}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {feed.participants || 0} participants
                  </div>
                  <div>
                    Hosted by {feed.journalist?.first_name || "Unknown"}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {connected ? (
                  <span className="text-green-500">● Connected</span>
                ) : (
                  <span className="text-red-500">● Disconnected</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Discussion</span>
                  <Badge variant="outline">{messages.length} messages</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg border ${
                          msg.isPinned
                            ? "bg-primary/5 border-primary/20"
                            : "bg-muted/30"
                        }`}
                      >
                        {msg.type === "system" ? (
                          <div className="text-center text-sm italic text-muted-foreground">
                            {msg.message}
                          </div>
                        ) : (
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.user.avatar} />
                              <AvatarFallback>
                                {msg.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">
                                  {msg.user.name}
                                </span>
                                {msg.user.verified && (
                                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-primary-foreground text-xs">
                                      ✓
                                    </span>
                                  </div>
                                )}
                                <Badge
                                  variant="secondary"
                                  className={getRoleColor(msg.user.role)}
                                >
                                  {msg.user.role}
                                </Badge>
                                {msg.isPinned && (
                                  <Pin className="h-3 w-3 text-primary" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {msg.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-foreground mb-2">
                                {msg.message}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLikeMessage(msg.id)}
                                  className="text-muted-foreground hover:text-primary h-6 px-2"
                                >
                                  <Heart className="h-3 w-3 mr-1" />
                                  {msg.likes || 0}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={bottomRef}></div>
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  {isTyping && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Remember to keep discussions respectful and on-topic
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussion Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Stay on topic</p>
                <p>• Be respectful to all participants</p>
                <p>• No spam or inappropriate content</p>
                <p>• Ask questions freely</p>
                <p>• Fact-based discussions encouraged</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  Share Discussion
                </Button>
                <Button variant="outline" className="w-full">
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full">
                  Leave Discussion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
