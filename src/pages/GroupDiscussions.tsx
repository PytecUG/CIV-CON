import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Heart, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "https://civcon.onrender.com";

interface Post {
  post: {
    id: number;
    content: string;
    created_at: string;
    author: { first_name: string; last_name: string; profile_image?: string };
  };
  like_count: number;
  comment_count: number;
}

interface Group {
  id: number;
  name: string;
  description: string;
  member_count: number;
}

const GroupDiscussions = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  // Axios client with token
  const api = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  // Fetch group details + posts
  const fetchGroupData = async () => {
    try {
      const [groupsRes, postsRes] = await Promise.all([
        api.get("/groups/"),
        api.get(`/groups/${id}/posts`),
      ]);

      const groupData = groupsRes.data.find((g: any) => g.id === Number(id));
      if (!groupData) {
        toast.error("Group not found");
        return;
      }

      setGroup(groupData);
      setPosts(postsRes.data.data || []);

      // Check if current user is in group
      if (groupData.members?.some((m: any) => m.id === user?.id)) {
        setIsJoined(true);
      }
    } catch (error) {
      console.error("Error loading group:", error);
      toast.error("Failed to load group discussions");
    } finally {
      setLoading(false);
    }
  };

  // Join group
  const handleJoinGroup = async () => {
    try {
      await api.post(`/groups/${id}/join`);
      toast.success("Joined group successfully!");
      setIsJoined(true);
      fetchGroupData();
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.info("You're already a member of this group.");
        setIsJoined(true);
      } else {
        toast.error("Failed to join group");
      }
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    try {
      setPosting(true);
      await api.post("/posts/", {
        content: newPost,
        group_id: id,
      });
      toast.success("Post created!");
      setNewPost("");
      fetchGroupData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen text-muted-foreground">
          Loading discussions...
        </div>
      </Layout>
    );
  }

  if (!group) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen text-red-500">
          Group not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {/* Group Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              {group.name}
              {!isJoined && (
                <Button onClick={handleJoinGroup} size="sm">
                  Join Group
                </Button>
              )}
            </CardTitle>
            <p className="text-muted-foreground">{group.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {group.member_count} members
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> {posts.length} posts
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* New Post Form */}
        {isJoined && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Start a Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-3"
              />
              <Button
                onClick={handleCreatePost}
                disabled={posting}
                className="w-full"
              >
                {posting ? "Posting..." : "Post"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((item) => (
              <Card key={item.post.id} className="hover:shadow-md transition">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={item.post.author?.profile_image || "/api/placeholder/40/40"}
                    />
                    <AvatarFallback>
                      {item.post.author?.first_name?.[0]}
                      {item.post.author?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {item.post.author.first_name} {item.post.author.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.post.created_at).toLocaleString()}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">{item.post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {item.like_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> {item.comment_count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No posts yet. Be the first to start a discussion!
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GroupDiscussions;
