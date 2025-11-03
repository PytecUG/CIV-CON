import { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageCircle,
  X,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Hash,
  Search,
  Phone,
  Video,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { messageService } from "@/services/messageService";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
  messages: Message[];
}

interface ModernChatBoxProps {
  className?: string; // ✅ allows external styling without breaking build
}

const WS_BASE = import.meta.env.VITE_WS_URL || "wss://api.civ-con.org/ws/direct";

export const ModernChatBox = ({ className }: ModernChatBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<"conversations" | "chat">("conversations");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const { user, token } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 🔌 Connect WebSocket once user is available
  useEffect(() => {
    if (!user) return;
    const ws = new WebSocket(`${WS_BASE}/${user.id}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ Connected to DM WebSocket");
    ws.onclose = () => console.log("❌ Disconnected from DM WebSocket");
    ws.onerror = (e) => console.error("⚠️ WS Error", e);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "dm") handleIncomingMessage(data);
      if (data.type === "typing") handleTyping(data);
      if (data.type === "seen") updateSeenStatus(data.from_user_id);
    };

    return () => ws.close();
  }, [user]);

  const handleIncomingMessage = (data: any) => {
    const incomingMsg: Message = {
      id: Date.now().toString(),
      senderId: data.from_user_id.toString(),
      senderName: data.sender_name || "User",
      content: data.content,
      timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: false,
      status: "delivered",
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === data.from_user_id.toString()
          ? { ...conv, messages: [...conv.messages, incomingMsg], unreadCount: (conv.unreadCount || 0) + 1 }
          : conv
      )
    );

    // Auto mark as read if active chat is open
    if (selectedConversation?.id === data.from_user_id.toString()) {
      wsRef.current?.send(
        JSON.stringify({ type: "seen", to_user_id: data.from_user_id })
      );
    }
  };

  const handleTyping = (data: any) => {
    setTypingUser(data.sender_name);
    setTimeout(() => setTypingUser(null), 2000);
  };

  const updateSeenStatus = (userId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === userId
          ? {
              ...conv,
              messages: conv.messages.map((m) =>
                m.isOwn ? { ...m, status: "read" } : m
              ),
            }
          : conv
      )
    );
  };

  // Fetch conversation history
  const openConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setActiveView("chat");

    try {
      const data = await messageService.getConversation(Number(conversation.id), token!);
      const formatted: Message[] = data.map((msg: any) => ({
        id: msg.id.toString(),
        senderId: msg.sender_id.toString(),
        senderName: msg.sender_name || "User",
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: msg.sender_id === user?.id,
        status: msg.read_at ? "read" : "delivered",
      }));

      setSelectedConversation({ ...conversation, messages: formatted });
      setConversations((prev) =>
        prev.map((c) => (c.id === conversation.id ? { ...c, unreadCount: 0 } : c))
      );
    } catch {
      toast.error("Failed to load messages.");
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;
    const recipientId = Number(selectedConversation.id);

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user?.id.toString() || "",
      senderName: user?.first_name || "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      status: "sent",
    };

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
    });
    setMessage("");

    try {
      await messageService.sendMessage(recipientId, message, token!);
      wsRef.current?.send(
        JSON.stringify({
          type: "dm",
          recipient_id: recipientId,
          content: message,
          sender_name: user?.first_name || "You",
        })
      );
    } catch {
      toast.error("Message failed to send.");
    }
  };

  const handleTypingEvent = () => {
    if (wsRef.current && selectedConversation) {
      wsRef.current.send(
        JSON.stringify({
          type: "typing",
          to_user_id: Number(selectedConversation.id),
          sender_name: user?.first_name,
        })
      );
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  if (!isOpen)
    return (
      <div className={cn(className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg md:bottom-6"
          size="icon"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {totalUnread > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 text-xs flex items-center justify-center bg-destructive">
                {totalUnread}
              </Badge>
            )}
          </div>
        </Button>
      </div>
    );

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-xl md:bottom-6 md:w-96 overflow-hidden",
        className
      )}
    >
      {/* ——— Header ——— */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center space-x-2">
          {activeView === "chat" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveView("conversations")}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <h3 className="font-semibold text-sm">
            {activeView === "conversations" ? "Messages" : selectedConversation?.name}
          </h3>
          {selectedConversation?.isOnline && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-muted-foreground">online</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {activeView === "chat" && (
            <>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Phone className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Video className="h-3 w-3" />
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setActiveView("conversations")}>
                <MessageCircle className="h-4 w-4 mr-2" />
                All Messages
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Hash className="h-4 w-4 mr-2" />
                Create Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* ——— Search Bar ——— */}
      {activeView === "conversations" && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm"
            />
          </div>
        </div>
      )}

      {/* ——— Main Content ——— */}
      <ScrollArea className="h-80">
        {activeView === "conversations" && (
          <div className="p-2 space-y-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => openConversation(conv)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback>{conv.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm truncate">{conv.name}</h4>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    {conv.unreadCount ? (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-primary">{conv.unreadCount}</Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === "chat" && selectedConversation && (
          <div className="p-4 space-y-4">
            {selectedConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex space-x-2",
                  msg.isOwn && "flex-row-reverse space-x-reverse"
                )}
              >
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    msg.isOwn ? "bg-primary text-white" : "bg-muted"
                  )}
                >
                  <p>{msg.content}</p>
                  <div className="flex justify-end text-xs opacity-70 mt-1 space-x-1">
                    <span>{msg.timestamp}</span>
                    {msg.isOwn &&
                      (msg.status === "read" ? (
                        <CheckCheck className="h-3 w-3 text-blue-300" />
                      ) : msg.status === "delivered" ? (
                        <CheckCheck className="h-3 w-3 text-gray-300" />
                      ) : (
                        <Check className="h-3 w-3 text-gray-400" />
                      ))}
                  </div>
                </div>
              </div>
            ))}
            {typingUser && (
              <p className="text-xs text-muted-foreground italic">
                {typingUser} is typing...
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* ——— Message Input ——— */}
      {activeView === "chat" && (
        <div className="p-3 border-t bg-muted/20">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTypingEvent();
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="pr-10 bg-background rounded-full"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={!message.trim()}
              className="h-8 w-8 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
