import { useEffect, useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Search,
  Calendar,
  Heart,
  Share2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { groupService } from "@/services/groupService";
import { liveFeedService } from "@/services/liveFeedService";
import { useAuth } from "@/context/AuthContext";

const JoinDiscussion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [liveFeeds, setLiveFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroup, setJoiningGroup] = useState<number | null>(null);

  /** 🧭 Load Groups & Live Feeds */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupsData, feedsData] = await Promise.all([
        groupService.getAll(),
        liveFeedService.getAll(),
      ]);
      setGroups(groupsData);
      setLiveFeeds(feedsData);
    } catch (err) {
      console.error("❌ Failed to fetch discussions:", err);
      toast.error("Unable to load discussions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /** 🤝 Join Group */
  const handleJoinGroup = async (groupId: number, isJoined: boolean) => {
    if (isJoined) {
      navigate(`/groups/${groupId}`);
      return;
    }
    try {
      setJoiningGroup(groupId);
      await groupService.join(groupId);
      toast.success("🎉 You’ve joined the discussion!");
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, is_joined: true } : g))
      );
    } catch (err) {
      console.error("Join group failed:", err);
      toast.error("Failed to join this group. Please try again.");
    } finally {
      setJoiningGroup(null);
    }
  };

  /** 🔍 Filter Groups */
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** 🧱 Render */
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* 🏠 Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Join the Conversation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow Ugandans, share your views, and join live
            discussions shaping our nation’s future.
          </p>
        </div>

        {/* 🔴 Live Banner */}
        {liveFeeds.length > 0 && (
          <Card className="mb-10 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-red-900 dark:text-red-100">
                    Live Discussions Happening Now
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {liveFeeds.length} active sessions across Uganda
                  </p>
                </div>
              </div>
              <Link to="/live-discussions">
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Join Live
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* 🔍 Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search discussions, topics, or groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>

        {/* 🗂 Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="featured">Featured Groups</TabsTrigger>
            <TabsTrigger value="live">Live Discussions</TabsTrigger>
            <TabsTrigger value="popular">Popular Topics</TabsTrigger>
          </TabsList>

          {/* ⭐ Featured Groups */}
          <TabsContent value="featured" className="space-y-6">
            {loading ? (
              <div className="text-center text-muted-foreground py-10">
                Loading discussions...
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No matching groups found.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-all duration-300 border border-border/50"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-14 w-14">
                            <AvatarImage
                              src={group.image || "/api/placeholder/80/80"}
                              alt={group.name}
                            />
                            <AvatarFallback>
                              {group.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {group.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {group.category || "General"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {group.description}
                      </p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {group.member_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {group.post_count || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleJoinGroup(group.id, group.is_joined)
                          }
                          disabled={joiningGroup === group.id}
                          variant={group.is_joined ? "outline" : "default"}
                          className="flex-1"
                        >
                          {joiningGroup === group.id
                            ? "Joining..."
                            : group.is_joined
                            ? "View Discussion"
                            : "Join Discussion"}
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 🔴 Live Feeds */}
          <TabsContent value="live" className="space-y-6">
            {liveFeeds.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No live discussions right now.
              </div>
            ) : (
              liveFeeds.map((feed) => (
                <Card
                  key={feed.id}
                  className="border-red-300 bg-red-50/50 dark:bg-red-950/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {feed.title}
                          </h3>
                          {feed.is_active && (
                            <Badge
                              variant="destructive"
                              className="bg-red-500 animate-pulse"
                            >
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {feed.description}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Journalist:{" "}
                            {feed.journalist?.first_name || "Unknown"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(feed.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to={`/live-discussion/${feed.id}`} className="block">
                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                          Join Live Discussion
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 🔥 Popular Topics */}
          <TabsContent value="popular" className="text-center text-muted-foreground py-10">
            Coming soon — trending topics and top civic discussions!
          </TabsContent>
        </Tabs>

        {/* 🚀 CTA */}
        <Card className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of Ugandans engaging in civic discussions and live
              updates from journalists. Every voice counts!
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Create Account
                </Button>
              </Link>
              <Link to="/groups">
                <Button variant="outline" size="lg">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Explore More Groups
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinDiscussion;
