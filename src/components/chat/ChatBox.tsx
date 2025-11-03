import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X, Paperclip, Smile, MoreVertical, Users, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { chatService } from "@/services/chatService";

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Group {
  id: string;
  name: string;
  members: number;
  icon: string;
}

const communityGroups: Group[] = [
  { id: "1", name: "Education Reform", members: 1245, icon: "📚" },
  { id: "2", name: "Healthcare Discussions", members: 892, icon: "🏥" },
  { id: "3", name: "Youth Empowerment", members: 2103, icon: "👥" },
  { id: "4", name: "Agriculture & Food", members: 756, icon: "🌾" }
];

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeView, setActiveView] = useState<"chat" | "groups">("groups");
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const { user } = useAuth();

  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const API_WS = (import.meta.env.VITE_WS_URL || "wss://api.civ-con.org/ws/chat");

  // 🔗 Connect to WebSocket when group is selected
  useEffect(() => {
    if (!activeGroup) return;
    const ws = new WebSocket(`${API_WS}/${activeGroup.id}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ Connected to group:", activeGroup.name);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: msg.sender,
          content: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: msg.sender === user?.first_name
        },
      ]);
    };
    ws.onclose = () => console.log("❌ Disconnected");

    // Load history
    chatService.getHistory(activeGroup.id).then((data) => setMessages(data));

    return () => ws.close();
  }, [activeGroup]);

  // auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !wsRef.current) return;
    const newMsg = {
      sender: user?.first_name || "You",
      content: message.trim(),
    };
    wsRef.current.send(JSON.stringify(newMsg));
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen)
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-elegant bg-primary hover:bg-primary/90 md:bottom-6 animate-pulse-soft hover:scale-110 transition-all duration-300"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 animate-bounce" />
      </Button>
    );

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-elegant md:bottom-6 md:w-96 animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-subtle rounded-t-lg">
        <div className="flex items-center space-x-2">
          {activeView === "chat" ? (
            <MessageCircle className="h-5 w-5 text-primary" />
          ) : (
            <Users className="h-5 w-5 text-primary" />
          )}
          <h3 className="font-semibold text-sm">
            {activeView === "chat" ? activeGroup?.name || "Community Chat" : "Groups"}
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setActiveView("chat")}>
                <MessageCircle className="h-4 w-4 mr-2" /> Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView("groups")}>
                <Users className="h-4 w-4 mr-2" /> Groups
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Hash className="h-4 w-4 mr-2" /> Create Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeView === "groups" ? (
        <ScrollArea className="h-80 p-4 space-y-3">
          {communityGroups.map((group, i) => (
            <div
              key={group.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 cursor-pointer animate-fade-in hover:scale-105"
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => {
                setActiveGroup(group);
                setActiveView("chat");
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{group.icon}</div>
                <div>
                  <h4 className="font-medium text-sm">{group.name}</h4>
                  <p className="text-xs text-muted-foreground">{group.members} members</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">Join</Button>
            </div>
          ))}
        </ScrollArea>
      ) : (
        <ScrollArea className="h-80 p-4" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex space-x-2 mb-3", msg.isOwn && "flex-row-reverse space-x-reverse")}>
              {!msg.isOwn && (
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {msg.sender[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:scale-[1.01]",
                  msg.isOwn ? "bg-primary text-primary-foreground shadow-md" : "bg-muted"
                )}
              >
                {!msg.isOwn && <p className="text-xs font-medium mb-1 opacity-70">{msg.sender}</p>}
                <p>{msg.content}</p>
                <p className={cn("text-xs mt-1 opacity-70", msg.isOwn ? "text-right" : "text-left")}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}

      {/* Input */}
      {activeView === "chat" && (
        <div className="p-3 border-t bg-muted/20">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 bg-background focus-visible:ring-primary"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={sendMessage} size="icon" disabled={!message.trim()} className="h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
