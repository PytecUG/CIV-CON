import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users, Radio, Heart, Pin } from "lucide-react";

interface LiveMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
    verified: boolean;
  };
  message: string;
  timestamp: string;
  likes: number;
  isPinned?: boolean;
}

interface DiscussionTopic {
  id: string;
  title: string;
  description: string;
  isLive: boolean;
  participants: number;
  moderator: string;
}

const dummyTopic: DiscussionTopic = {
  id: "1",
  title: "Healthcare Reform in Uganda: What Citizens Need to Know",
  description: "Join our live discussion about the upcoming healthcare reforms and how they will impact citizens across Uganda.",
  isLive: true,
  participants: 234,
  moderator: "Dr. Sarah Mukasa"
};

const dummyMessages: LiveMessage[] = [
  {
    id: "1",
    user: {
      name: "John Okello",
      avatar: "/api/placeholder/40/40",
      role: "citizen",
      verified: false
    },
    message: "Thank you for organizing this discussion. I'm really concerned about the accessibility of healthcare in rural areas.",
    timestamp: "2 minutes ago",
    likes: 12,
    isPinned: true
  },
  {
    id: "2",
    user: {
      name: "Dr. Sarah Mukasa",
      avatar: "/api/placeholder/40/40",
      role: "healthcare expert",
      verified: true
    },
    message: "That's an excellent point, John. The new reforms specifically address rural healthcare infrastructure with mobile clinics and telemedicine initiatives.",
    timestamp: "1 minute ago",
    likes: 28
  },
  {
    id: "3",
    user: {
      name: "Grace Namuli",
      avatar: "/api/placeholder/40/40",
      role: "citizen",
      verified: false
    },
    message: "What about the cost? Will these reforms make healthcare more affordable for low-income families?",
    timestamp: "30 seconds ago",
    likes: 8
  }
];

const LiveDiscussion = () => {
  const [messages, setMessages] = useState<LiveMessage[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'healthcare expert':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'moderator':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'verified citizen':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: LiveMessage = {
        id: Date.now().toString(),
        user: {
          name: "You",
          avatar: "/api/placeholder/40/40",
          role: "citizen",
          verified: false
        },
        message: newMessage.trim(),
        timestamp: "now",
        likes: 0
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleLikeMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Topic Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{dummyTopic.title}</h1>
                  {dummyTopic.isLive && (
                    <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">
                      <Radio className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{dummyTopic.description}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {dummyTopic.participants} participants
                  </div>
                  <div>Moderated by {dummyTopic.moderator}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Live Chat */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Discussion</span>
                  <Badge variant="outline">{messages.length} messages</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`p-4 rounded-lg border ${message.isPinned ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.user.avatar} />
                            <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{message.user.name}</span>
                              {message.user.verified && (
                                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-primary-foreground text-xs">✓</span>
                                </div>
                              )}
                              <Badge variant="secondary" className={getRoleColor(message.user.role)}>
                                {message.user.role}
                              </Badge>
                              {message.isPinned && (
                                <Pin className="h-3 w-3 text-primary" />
                              )}
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                            <p className="text-sm text-foreground mb-2">{message.message}</p>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeMessage(message.id)}
                                className="text-muted-foreground hover:text-primary h-6 px-2"
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                {message.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

          {/* Participants & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussion Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Stay on topic</p>
                  <p>• Be respectful to all participants</p>
                  <p>• No spam or inappropriate content</p>
                  <p>• Ask questions freely</p>
                  <p>• Fact-based discussions encouraged</p>
                </div>
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
};

export default LiveDiscussion;