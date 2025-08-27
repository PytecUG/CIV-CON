import { useState } from "react";
import { Send, MessageCircle, X, Paperclip, Smile, MoreVertical, Users, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const communityGroups = [
  { id: "1", name: "Education Reform", members: 1245, icon: "📚" },
  { id: "2", name: "Healthcare Discussions", members: 892, icon: "🏥" },
  { id: "3", name: "Youth Empowerment", members: 2103, icon: "👥" },
  { id: "4", name: "Agriculture & Food", members: 756, icon: "🌾" }
];

const dummyMessages: Message[] = [
  {
    id: "1",
    sender: "John Doe",
    content: "Hey! Are you following the education reform discussions?",
    timestamp: "2:30 PM",
    isOwn: false,
  },
  {
    id: "2",
    sender: "You",
    content: "Yes! The new policies look promising. What do you think about the budget allocation?",
    timestamp: "2:32 PM",
    isOwn: true,
  },
  {
    id: "3",
    sender: "John Doe", 
    content: "I think it's a step in the right direction, but we need more transparency in how funds are distributed.",
    timestamp: "2:35 PM",
    isOwn: false,
  }
];

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [activeView, setActiveView] = useState<"chat" | "groups">("chat");

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-elegant bg-primary hover:bg-primary/90 md:bottom-6 animate-pulse-soft hover:scale-110 transition-all duration-300"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 animate-bounce" />
      </Button>
    );
  }

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
            {activeView === "chat" ? "Community Chat" : "Groups"}
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
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView("groups")}>
                <Users className="h-4 w-4 mr-2" />
                Community Groups
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
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-80 p-4">
        {activeView === "chat" ? (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={cn(
                  "flex space-x-2 animate-fade-in",
                  msg.isOwn && "flex-row-reverse space-x-reverse"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {msg.sender.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:scale-105",
                    msg.isOwn
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {!msg.isOwn && (
                    <p className="text-xs font-medium mb-1 opacity-70">{msg.sender}</p>
                  )}
                  <p>{msg.content}</p>
                  <p className={cn(
                    "text-xs mt-1 opacity-70",
                    msg.isOwn ? "text-right" : "text-left"
                  )}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {communityGroups.map((group, index) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 cursor-pointer animate-fade-in hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setActiveView("chat")}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{group.icon}</div>
                  <div>
                    <h4 className="font-medium text-sm">{group.name}</h4>
                    <p className="text-xs text-muted-foreground">{group.members} members</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  Join
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input - Only show for chat view */}
      {activeView === "chat" && (
        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 bg-background focus-visible:ring-primary transition-all duration-200"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={!message.trim()}
              className="h-8 w-8 hover:scale-110 transition-all duration-200 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};