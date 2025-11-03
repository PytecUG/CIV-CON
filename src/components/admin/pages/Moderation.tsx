// src/components/admin/pages/Moderation.tsx
import { useState, useMemo } from "react";
import {
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Search,
  Filter,
  Download,
  Ban,
  Edit,
  User,
} from "lucide-react";
import { format } from "date-fns";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Post {
  id: number;
  content: string;
  author: string;
  authorId: number;
  status: "Approved" | "Flagged" | "Removed";
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  reports: number;
}

interface Topic {
  id: number;
  name: string;
  posts: number;
  engagement: number;
  trend: "up" | "down" | "stable";
  status: "Active" | "Suspended";
}

// Mock data
const generatePosts = (): Post[] => {
  const base = [
    { content: "Community event this weekend!", author: "John Kizza", authorId: 1, views: 1200, likes: 89, comments: 23, reports: 0 },
    { content: "Inappropriate content reported.", author: "Sarah Namutebi", authorId: 2, views: 450, likes: 12, comments: 8, reports: 5 },
    { content: "Local governance discussion.", author: "Moses Ali", authorId: 3, views: 890, likes: 67, comments: 41, reports: 1 },
    { content: "Offensive language detected.", author: "Aisha Nansubuga", authorId: 4, views: 320, likes: 5, comments: 12, reports: 8 },
    { content: "Education reform proposal.", author: "NGO Uganda", authorId: 5, views: 2100, likes: 245, comments: 89, reports: 2 },
  ];
  return Array.from({ length: 25 }, (_, i) => ({
    ...base[i % 5],
    id: i + 1,
    createdAt: new Date(2025, 0, 1 + (i % 28)).toISOString(),
    status: i % 7 === 0 ? "Flagged" : i % 11 === 0 ? "Removed" : "Approved",
  }));
};

const topics: Topic[] = [
  { id: 1, name: "Youth Empowerment", posts: 145, engagement: 89, trend: "up", status: "Active" },
  { id: 2, name: "Local Elections", posts: 98, engagement: 76, trend: "up", status: "Active" },
  { id: 3, name: "Health Awareness", posts: 67, engagement: 45, trend: "stable", status: "Suspended" },
  { id: 4, name: "Education Reform", posts: 210, engagement: 92, trend: "up", status: "Active" },
  { id: 5, name: "Climate Action", posts: 134, engagement: 81, trend: "down", status: "Active" },
];

export const Moderation = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [posts] = useState<Post[]>(generatePosts());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);

  const perPage = 8;

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = p.content.toLowerCase().includes(search.toLowerCase()) ||
        p.author.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  const pagePosts = filteredPosts.slice(0, perPage);

  // Stats
  const stats = {
    total: posts.length,
    flagged: posts.filter(p => p.status === "Flagged").length,
    removed: posts.filter(p => p.status === "Removed").length,
    activeTopics: topics.filter(t => t.status === "Active").length,
  };

  // Performance chart
  const performanceData = posts.slice(0, 7).map(p => ({
    date: format(new Date(p.createdAt), "MMM dd"),
    views: p.views,
    likes: p.likes,
    comments: p.comments,
  }));

  // Topic engagement pie
  const topicPie = topics.map(t => ({
    name: t.name,
    value: t.engagement,
  }));

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

  // Actions
  const handleBulkAction = (action: "approve" | "suspend" | "remove") => {
    toast({ title: `${action.charAt(0).toUpperCase() + action.slice(1)}d`, description: `${selected.length} items updated.` });
    setSelected([]);
  };

  const handlePostAction = (post: Post, action: "approve" | "remove") => {
    setSelectedPost(post);
    setActionOpen(true);
  };

  const confirmAction = () => {
    if (selectedPost) {
      toast({ title: "Action Confirmed", description: `Post ${selectedPost.id} updated.` });
      setActionOpen(false);
      setSelectedPost(null);
    }
  };

  const exportCSV = () => {
    const csv = [
      "ID,Content,Author,Status,Views,Likes,Comments,Reports,Date",
      ...filteredPosts.map(p => [
        p.id, `"${p.content}"`, p.author, p.status, p.views, p.likes, p.comments, p.reports, p.createdAt
      ].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moderation-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast({ title: "Exported", description: `${filteredPosts.length} posts` });
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 flex items-center gap-2">
            <Flag className="h-7 w-7" /> Content Moderation
          </h1>
          <p className="text-muted-foreground">Manage posts, track performance, and moderate trending topics.</p>
        </div>
        <Button onClick={exportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="topics">Trending Topics</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Posts", value: stats.total, icon: MessageSquare },
              { title: "Flagged", value: stats.flagged, icon: Flag, color: "text-yellow-600" },
              { title: "Removed", value: stats.removed, icon: XCircle, color: "text-red-600" },
              { title: "Active Topics", value: stats.activeTopics, icon: TrendingUp, color: "text-green-600" },
            ].map((s, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                  <s.icon className={`h-4 w-4 ${s.color || "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${s.color || ""}`}>{s.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Post Performance (Last 7 Days)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Views" />
                    <Line type="monotone" dataKey="likes" stroke="#10b981" name="Likes" />
                    <Line type="monotone" dataKey="comments" stroke="#f59e0b" name="Comments" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Topic Engagement</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={topicPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {topicPie.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Posts */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content or author..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Flagged">Flagged</SelectItem>
                <SelectItem value="Removed">Removed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selected.length > 0 && (
            <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">{selected.length} selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                <CheckCircle className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("suspend")}>
                <Ban className="h-4 w-4 mr-1" /> Suspend
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction("remove")}>
                <XCircle className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
          )}

          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left"><Checkbox /></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Content</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Stats</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {pagePosts.map(p => (
                    <tr key={p.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.includes(p.id)}
                          onCheckedChange={() => setSelected(prev =>
                            prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs truncate">{p.content}</td>
                      <td className="px-4 py-3 text-sm hidden sm:table-cell">{p.author}</td>
                      <td className="px-4 py-3 text-xs">
                        <div className="flex gap-2 text-muted-foreground">
                          <span title="Views">{p.views}</span>
                          <span title="Likes">{p.likes}</span>
                          <span title="Comments">{p.comments}</span>
                          {p.reports > 0 && <Badge variant="destructive">{p.reports} reports</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={
                          p.status === "Approved" ? "bg-green-100 text-green-800" :
                          p.status === "Flagged" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedPost(p); setViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handlePostAction(p, "approve")} disabled={p.status === "Approved"}>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handlePostAction(p, "remove")} disabled={p.status === "Removed"}>
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Trending Topics */}
        <TabsContent value="topics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map(t => (
              <Card key={t.id} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  <Badge variant={t.status === "Active" ? "default" : "destructive"}>
                    {t.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Posts</span>
                    <span className="font-medium">{t.posts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Engagement</span>
                    <span className="font-medium">{t.engagement}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trend</span>
                    <Badge variant={t.trend === "up" ? "default" : t.trend === "down" ? "destructive" : "secondary"}>
                      {t.trend}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedTopic(t); setTopicOpen(true); }}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Ban className="h-4 w-4 mr-1" /> Suspend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Post Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <Label>Content</Label>
                <p className="text-sm mt-1">{selectedPost.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Author</Label>
                  <p className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" /> {selectedPost.author}
                  </p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-sm">{format(new Date(selectedPost.createdAt), "MMM dd, yyyy")}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{selectedPost.views}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{selectedPost.likes}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{selectedPost.comments}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation */}
      <Dialog open={actionOpen} onOpenChange={setActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to proceed with this action?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionOpen(false)}>Cancel</Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Topic Details */}
      <Dialog open={topicOpen} onOpenChange={setTopicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Topic: {selectedTopic?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p><strong>Posts:</strong> {selectedTopic?.posts}</p>
            <p><strong>Engagement:</strong> {selectedTopic?.engagement}%</p>
            <p><strong>Trend:</strong> {selectedTopic?.trend}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTopicOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};