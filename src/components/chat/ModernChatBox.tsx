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

interface ModernChatBoxProps {
  className?: string;
}

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
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Hon. Rebecca Kadaga",
    lastMessage: "Thank you for your feedback on the education reforms",
    timestamp: "2:30 PM",
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: "1",
        senderId: "kadaga",
        senderName: "Hon. Rebecca Kadaga",
        content:
          "Thank you for your feedback on the education reforms. We're reviewing all suggestions.",
        timestamp: "2:30 PM",
        isOwn: false,
        status: "read",
      },
      {
        id: "2",
        senderId: "you",
        senderName: "You",
        content:
          "I appreciate your commitment to improving our education system. The community supports these changes.",
        timestamp: "2:35 PM",
        isOwn: true,
        status: "read",
      },
    ],
  },
  {
    id: "2",
    name: "Dr. Kiiza Besigye",
    lastMessage: "The youth employment discussion was insightful",
    timestamp: "1:15 PM",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: "3",
        senderId: "besigye",
        senderName: "Dr. Kiiza Besigye",
        content:
          "The youth employment discussion was insightful. We need more platforms like this.",
        timestamp: "1:15 PM",
        isOwn: false,
        status: "read",
      },
    ],
  },
  {
    id: "3",
    name: "Community Groups",
    lastMessage: "New message in Education Reform group",
    timestamp: "11:45 AM",
    unreadCount: 5,
    isOnline: true,
    messages: [],
  },
];

export const ModernChatBox: React.FC<ModernChatBoxProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "conversations" | "chat" | "groups"
  >("conversations");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalUnreadCount = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const sendMessage = () => {
    if (message.trim() && selectedConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: "you",
        senderName: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        status: "sent",
      };

      selectedConversation.messages.push(newMessage);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Floating chat button
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-strong bg-primary hover:bg-primary-hover md:bottom-6 transition-all duration-300 hover:scale-110",
          className
        )}
        size="icon"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6" />
          {totalUnreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-destructive">
              {totalUnreadCount}
            </Badge>
          )}
        </div>
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-background border rounded-lg shadow-strong md:bottom-6 md:w-96 animate-scale-in overflow-hidden",
        className
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center space-x-2">
          {activeView === "conversations" ? (
            <MessageCircle className="h-5 w-5 text-primary" />
          ) : activeView === "chat" ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setActiveView("conversations");
                  setSelectedConversation(null);
                }}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedConversation?.avatar} />
                <AvatarFallback className="text-xs">
                  {selectedConversation?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <Users className="h-5 w-5 text-primary" />
          )}

          <h3 className="font-semibold text-sm">
            {activeView === "conversations"
              ? "Messages"
              : activeView === "chat"
              ? selectedConversation?.name
              : "Groups"}
          </h3>

          {selectedConversation?.isOnline && activeView === "chat" && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-muted-foreground">online</span>
            </div>
          )}
        </div>

        {/* HEADER ACTIONS */}
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
            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {(activeView === "conversations" || activeView === "groups") && (
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm"
            />
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <ScrollArea className="h-80">
        {/* Conversations List */}
        {activeView === "conversations" && (
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setActiveView("chat");
                }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="text-sm">
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-primary">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Chat View */}
        {activeView === "chat" && selectedConversation && (
          <div className="p-4 space-y-4">
            {selectedConversation.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={cn(
                  "flex space-x-2 animate-fade-in",
                  msg.isOwn && "flex-row-reverse space-x-reverse"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {!msg.isOwn && (
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {msg.senderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm transition-all duration-200",
                    msg.isOwn
                      ? "bg-primary text-primary-foreground shadow-md rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  )}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <div
                    className={cn(
                      "flex items-center space-x-1 mt-1",
                      msg.isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs opacity-70",
                        msg.isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {msg.timestamp}
                    </span>
                    {msg.isOwn && (
                      <div
                        className={cn(
                          "text-xs opacity-70",
                          msg.status === "read" && "text-blue-300",
                          msg.status === "delivered" && "text-gray-300",
                          msg.status === "sent" && "text-gray-400"
                        )}
                      >
                        {msg.status === "read" && "✓✓"}
                        {msg.status === "delivered" && "✓✓"}
                        {msg.status === "sent" && "✓"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Groups View */}
        {activeView === "groups" && (
          <div className="p-2 space-y-1">
            {[
              {
                id: "1",
                name: "Education Reform",
                members: 1245,
                icon: "📚",
                unread: 3,
              },
              {
                id: "2",
                name: "Healthcare Discussions",
                members: 892,
                icon: "🏥",
                unread: 0,
              },
              {
                id: "3",
                name: "Youth Empowerment",
                members: 2103,
                icon: "👥",
                unread: 7,
              },
              {
                id: "4",
                name: "Agriculture & Food",
                members: 756,
                icon: "🌾",
                unread: 1,
              },
            ].map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{group.icon}</div>
                  <div>
                    <h4 className="font-medium text-sm">{group.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {group.members} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {group.unread > 0 && (
                    <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center bg-primary">
                      {group.unread}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 hover:bg-primary/10 hover:text-primary"
                  >
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* INPUT BAR */}
      {activeView === "chat" && (
        <div className="p-3 border-t bg-muted/20">
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
                onKeyDown={handleKeyPress}
                className="pr-10 bg-background focus-visible:ring-primary transition-all duration-200 rounded-full"
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
              className="h-8 w-8 rounded-full hover:scale-110 transition-all duration-200 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
