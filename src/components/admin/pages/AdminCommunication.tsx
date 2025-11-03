// src/components/admin/pages/AdminCommunication.tsx
import { useState, useMemo } from "react";
import {
  Mail,
  Bell,
  MessageSquare,
  Send,
  Users,
  User,
  Search,
  FileText,   // ← Fixed: Replaced 'Template' with 'FileText'
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock user data
interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastSeen?: string;
}

const users: AppUser[] = [
  { id: 1, name: "John Kizza", email: "john@example.com", role: "Citizen" },
  { id: 2, name: "Sarah Namutebi", email: "sarah@reporter.ug", role: "Journalist" },
  { id: 3, name: "Hon. Moses Ali", email: "moses@parliament.go.ug", role: "Leader" },
  { id: 4, name: "Aisha Nansubuga", email: "aisha@mak.ac.ug", role: "Student" },
  { id: 5, name: "NGO Uganda", email: "info@ngo.org", role: "NGO" },
  { id: 6, name: "David Mutebi", email: "david@tech.ug", role: "Citizen" },
];

const ROLES = ["Citizen", "Journalist", "Leader", "Student", "NGO", "Admin"];

// Email templates
const TEMPLATES = {
  welcome: {
    name: "Welcome Message",
    subject: "Welcome to Uganda Connects!",
    body: `Dear {name},

Welcome to Uganda Connects! We're excited to have you join our civic engagement platform.

Stay informed, connect with leaders, and make your voice heard.

Best regards,
The Uganda Connects Team`,
  },
  alert: {
    name: "Urgent Alert",
    subject: "Important Update: {topic}",
    body: `Hi {name},

**Urgent Notice**

{topic}

Please take immediate action.

Thank you,
Admin Team`,
  },
  newsletter: {
    name: "Weekly Newsletter",
    subject: "This Week in Uganda Connects",
    body: `Hello {name},

Here's your weekly update:

• Top stories
• Community highlights
• Upcoming events

[Read More]

Stay connected!
Uganda Connects`,
  },
};

interface Message {
  id: number;
  from: "admin" | "user";
  text: string;
  timestamp: string;
}

export const AdminCommunication = () => {
  const { toast } = useToast();

  // Tabs
  const [tab, setTab] = useState("email");

  // Email State
  const [emailTo, setEmailTo] = useState<"all" | "role" | "user">("all");
  const [emailRole, setEmailRole] = useState("");
  const [emailUser, setEmailUser] = useState<AppUser | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [emailPreview, setEmailPreview] = useState(false);

  // Notification State
  const [notifTo, setNotifTo] = useState<"all" | "role" | "user">("all");
  const [notifRole, setNotifRole] = useState("");
  const [notifUser, setNotifUser] = useState<AppUser | null>(null);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");

  // Chat State
  const [chatUser, setChatUser] = useState<AppUser | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "user", text: "Hello, I have a question about the new policy.", timestamp: "10:30 AM" },
    { id: 2, from: "admin", text: "Hi! Happy to help. What's your question?", timestamp: "10:32 AM" },
  ]);

  // Send history
  const [history] = useState([
    { id: 1, type: "email", to: "All Users", subject: "System Update", time: "2 hours ago", status: "sent" },
    { id: 2, type: "notification", to: "Leaders", title: "Urgent Meeting", time: "5 hours ago", status: "sent" },
    { id: 3, type: "chat", to: "John Kizza", message: "Meeting rescheduled", time: "1 day ago", status: "sent" },
  ]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(emailSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(emailSearch.toLowerCase())
    );
  }, [emailSearch]);

  // Load template
  const loadTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key];
    setEmailSubject(t.subject);
    setEmailBody(t.body);
    toast({ title: "Template Loaded", description: t.name });
  };

  // Send Email
  const sendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast({ title: "Error", description: "Subject and body are required.", variant: "destructive" });
      return;
    }

    toast({
      title: "Email Sent",
      description: `To: ${emailTo === "all" ? "All Users" : emailTo === "role" ? emailRole : emailUser?.name}`,
      icon: <CheckCircle className="h-4 w-4" />,
    });

    // Reset
    setEmailSubject("");
    setEmailBody("");
    setEmailTo("all");
    setEmailRole("");
    setEmailUser(null);
  };

  // Send Notification
  const sendNotification = () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast({ title: "Error", description: "Title and message required.", variant: "destructive" });
      return;
    }

    toast({
      title: "Notification Sent",
      description: `To: ${notifTo === "all" ? "All" : notifTo === "role" ? notifRole : notifUser?.name}`,
      icon: <Bell className="h-4 w-4" />,
    });

    setNotifTitle("");
    setNotifMessage("");
    setNotifTo("all");
    setNotifRole("");
    setNotifUser(null);
  };

  // Send Chat
  const sendChat = () => {
    if (!chatMessage.trim() || !chatUser) return;

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      from: "admin",
      text: chatMessage,
      timestamp: format(new Date(), "h:mm a"),
    }]);

    toast({ title: "Message Sent", description: `To ${chatUser.name}` });
    setChatMessage("");
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 flex items-center gap-2">
            <Mail className="h-7 w-7" /> Communication Center
          </h1>
          <p className="text-muted-foreground">Send emails, notifications, and chat with users.</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {/* === EMAIL TAB === */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Compose Email</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEmailPreview(true)}>
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                  <Select onValueChange={loadTemplate}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Load Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TEMPLATES).map(([k, t]) => (
                        <SelectItem key={k} value={k}>
                          <FileText className="h-4 w-4 inline mr-2" /> {/* Fixed */}
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Recipient */}
              <div className="space-y-3">
                <Label>Send To</Label>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant={emailTo === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEmailTo("all")}
                  >
                    <Users className="h-4 w-4 mr-1" /> All Users
                  </Button>
                  <Button
                    variant={emailTo === "role" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEmailTo("role")}
                  >
                    By Role
                  </Button>
                  <Button
                    variant={emailTo === "user" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEmailTo("user")}
                  >
                    <User className="h-4 w-4 mr-1" /> Specific User
                  </Button>
                </div>

                {emailTo === "role" && (
                  <Select value={emailRole} onValueChange={setEmailRole}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}

                {emailTo === "user" && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search user..."
                        value={emailSearch}
                        onChange={e => setEmailSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <ScrollArea className="h-32 border rounded-md">
                      {filteredUsers.map(u => (
                        <div
                          key={u.id}
                          className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                          onClick={() => { setEmailUser(u); setEmailSearch(""); }}
                        >
                          <Checkbox checked={emailUser?.id === u.id} />
                          <span className="text-sm">{u.name} ({u.email})</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label>Subject</Label>
                <Input
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  placeholder="Write your email..."
                  className="min-h-48"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use <code className="bg-muted px-1 rounded">{`{name}`}</code> for personalization.
                </p>
              </div>

              <Button onClick={sendEmail} className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" /> Send Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === NOTIFICATIONS TAB === */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Push Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label>Send To</Label>
                <div className="flex gap-3 flex-wrap">
                  <Button variant={notifTo === "all" ? "default" : "outline"} size="sm" onClick={() => setNotifTo("all")}>
                    <Users className="h-4 w-4 mr-1" /> All
                  </Button>
                  <Button variant={notifTo === "role" ? "default" : "outline"} size="sm" onClick={() => setNotifTo("role")}>
                    By Role
                  </Button>
                  <Button variant={notifTo === "user" ? "default" : "outline"} size="sm" onClick={() => setNotifTo("user")}>
                    <User className="h-4 w-4 mr-1" /> User
                  </Button>
                </div>

                {notifTo === "role" && (
                  <Select value={notifRole} onValueChange={setNotifRole}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}

                {notifTo === "user" && (
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                    <SelectContent>
                      {users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label>Title</Label>
                <Input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Alert title..." />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={notifMessage}
                  onChange={e => setNotifMessage(e.target.value)}
                  placeholder="Short message..."
                  className="min-h-32"
                />
              </div>

              <Button onClick={sendNotification} className="w-full sm:w-auto">
                <Bell className="h-4 w-4 mr-2" /> Send Notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === CHAT TAB === */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {users.map(u => (
                    <div
                      key={u.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                        ${chatUser?.id === u.id ? "bg-primary/10" : "hover:bg-muted"}
                      `}
                      onClick={() => setChatUser(u)}
                    >
                      <Avatar>
                        <AvatarFallback>{u.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.role}</p>
                      </div>
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{chatUser ? `Chat with ${chatUser.name}` : "Select a user"}</span>
                  {chatUser && <Badge variant="secondary">{chatUser.role}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chatUser ? (
                  <>
                    <ScrollArea className="h-80 mb-4 p-4 border rounded-lg">
                      {messages.map(m => (
                        <div
                          key={m.id}
                          className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"} mb-3`}
                        >
                          <div
                            className={`
                              max-w-xs px-4 py-2 rounded-lg text-sm
                              ${m.from === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}
                            `}
                          >
                            <p>{m.text}</p>
                            <p className="text-xs opacity-70 mt-1">{m.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>

                    <div className="flex gap-2">
                      <Input
                        value={chatMessage}
                        onChange={e => setChatMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendChat()}
                        placeholder="Type a message..."
                      />
                      <Button onClick={sendChat}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    <p>Select a user to start chatting</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* === SEND HISTORY === */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map(h => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {h.type === "email" ? <Mail className="h-4 w-4" /> :
                   h.type === "notification" ? <Bell className="h-4 w-4" /> :
                   <MessageSquare className="h-4 w-4" />}
                  <div>
                    <p className="font-medium text-sm">
                      {h.type === "email" ? h.subject :
                       h.type === "notification" ? h.title :
                       h.message}
                    </p>
                    <p className="text-xs text-muted-foreground">To: {h.to}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{h.status}</Badge>
                  <p className="text-xs text-muted-foreground">{h.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Preview Dialog */}
      <Dialog open={emailPreview} onOpenChange={setEmailPreview}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <p className="font-medium">{emailSubject || "(no subject)"}</p>
            </div>
            <div>
              <Label>Body</Label>
              <div className="prose prose-sm max-w-none bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans">{emailBody || "(no body)"}</pre>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailPreview(false)}>Close</Button>
            <Button onClick={() => { setEmailPreview(false); sendEmail(); }}>Send Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};