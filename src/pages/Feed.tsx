import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePost } from "@/components/forms/CreatePost";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { postService } from "@/services/postService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const trendingTopics = [
  { tag: "#YouthEmployment", posts: "234 posts" },
  { tag: "#EducationReform", posts: "189 posts" },
  { tag: "#Infrastructure", posts: "145 posts" },
  { tag: "#ClimateAction", posts: "123 posts" },
  { tag: "#DigitalInnovation", posts: "98 posts" },
];

const activeLeaders = [
  { name: "Hon. Rebecca Kadaga", role: "Speaker of Parliament", online: true },
  { name: "Dr. Kiiza Besigye", role: "Opposition Leader", online: false },
  { name: "Hon. Robinah Nabbanja", role: "Prime Minister", online: true },
];

function Feed() {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /** 🔹 Fetch posts from backend */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postService.getAllPosts();
      if (!Array.isArray(data)) throw new Error("Invalid posts response");

      const mapped = data.map((p: any) => ({
        id: p.id,
        content: p.content || "",
        user: {
          id: p.author?.id,
          name: `${p.author?.first_name || ""} ${p.author?.last_name || ""}`.trim() || "Anonymous",
          username: p.author?.username || `user_${p.author?.id}`,
          avatar:
            p.author?.profile_image ||
            "/api/placeholder/40/40",
          role: p.author?.role || "citizen",
        },
        media: Array.isArray(p.media)
          ? p.media.map((m: any) => ({
              media_url: m.media_url?.startsWith("http")
                ? m.media_url
                : `https://civcon.onrender.com/${m.media_url}`,
              media_type: m.media_type || "image",
            }))
          : [],
        likes: p.like_count || 0,
        comments: Array.isArray(p.comments) ? p.comments.length : 0,
        shares: p.share_count || 0,
        timestamp: p.created_at
          ? new Date(p.created_at).toLocaleString()
          : "Just now",
      }));

      setPosts(mapped);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      toast.error(" Could not load posts from server.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, token]);

  /**  Handle post create / comment / delete */
const handlePostCreated = (newPost?: any) => {
  setIsModalOpen(false);
  if (newPost) {
    setPosts((prev) => [newPost, ...prev]);  // add to top
  } else {
    fetchPosts();
  }
};

  const handleCommentAdded = () => fetchPosts();
  const handlePostDeleted = (deletedId: number) =>
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* MAIN FEED */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Button */}
            <div className="flex justify-end px-2">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="premium"
                    className="hover:scale-105 transition-all duration-200"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                  </DialogHeader>
                  <CreatePost onPostCreated={(p) => handlePostCreated(p)} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {loading ? (
                <p className="text-center text-muted-foreground">
                  Loading posts...
                </p>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onCommentAdded={handleCommentAdded}
                    onPostDeleted={handlePostDeleted}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No posts available yet.
                </p>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Trending Topics */}
            <Card className="shadow-soft">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Trending Topics
                </h3>
                <div className="flex flex-col gap-2">
                  {trendingTopics.map((trend, index) => (
                    <Link
                      key={index}
                      to={`/live-discussion/${index + 1}`}
                      className="flex justify-between items-center hover:bg-muted/50 p-2 rounded cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-primary">{trend.tag}</p>
                        <p className="text-sm text-muted-foreground">
                          {trend.posts}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Leaders */}
            <Card className="shadow-soft">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Active Leaders
                </h3>
                <div className="space-y-3">
                  {activeLeaders.map((leader, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage
                            src={`/api/placeholder/32/32`}
                            alt={leader.name}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                            {leader.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {leader.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 border-2 border-background rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-medium">
                          {leader.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {leader.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Feed;
