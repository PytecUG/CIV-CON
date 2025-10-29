import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Play,
  Edit,
  Trash2,
  CornerDownRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CommentForm } from "@/components/forms/CommentForm";
import { postService } from "@/services/postService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    profile_image?: string;
  };
  created_at: string;
  replies?: Comment[];
}

interface PostMedia {
  media_url: string;
  media_type: string;
}

interface PostUser {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  role: string;
  verified?: boolean;
}

export interface Post {
  id: number;
  content: string;
  user: PostUser;
  media?: PostMedia[];
  type?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  author_id?: number;
  like_count?: number;
  is_liked?: boolean;
}

interface PostCardProps {
  post: Post;
  onCommentAdded?: () => void;
  onPostDeleted?: (id: number) => void;
}

export const PostCard = ({
  post,
  onCommentAdded,
  onPostDeleted,
}: PostCardProps) => {
  const { user, token } = useAuth();
  const [likes, setLikes] = useState(post.like_count || post.likes || 0);
  const [liked, setLiked] = useState(post.is_liked || false);
  const [shares, setShares] = useState(post.shares || 0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [activeReply, setActiveReply] = useState<number | null>(null);

  useEffect(() => {
    setLikes(post.like_count || post.likes || 0);
    setLiked(post.is_liked || false);
    setShares(post.shares || 0);
  }, [post.id, post.like_count, post.is_liked, post.shares]);

  /** 🔹 Fetch comments */
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await postService.getComments(post.id);
      setComments(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load comments:", err);
      toast.error("Could not load comments for this post.");
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showCommentForm) fetchComments();
  }, [showCommentForm]);

  /** 🔹 Like / Unlike */
  const handleLike = async () => {
    if (!token) return toast.error("Please sign in to like posts.");
    try {
      const res = await postService.toggleLike(post.id);
      setLikes(res.like_count ?? likes + (liked ? -1 : 1));
      setLiked(res.liked ?? !liked);
    } catch (err) {
      console.error("Error liking post:", err);
      toast.error("Failed to update like status.");
    }
  };

  /** 🔹 Share post */
  const handleShare = async () => {
    if (!token) return toast.error("Please sign in to share posts.");
    try {
      const res = await postService.sharePost(post.id);
      setShares(res.share_count ?? shares + 1);
      toast.success("Post shared successfully!");
    } catch (err) {
      console.error("Error sharing post:", err);
      toast.error("Failed to share post.");
    }
  };

  /** 🔹 Delete post */
  const handleDelete = async () => {
    if (!token) return toast.error("Please sign in.");
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await postService.deletePost(post.id);
      toast.success("Post deleted successfully!");
      onPostDeleted?.(post.id);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete post.");
    }
  };

  /** 🔹 Submit top-level comment */
  const handleCommentSubmit = async (comment: string) => {
    try {
      const newComment = await postService.addComment(post.id, comment);
      setComments((prev) => [newComment, ...prev]);
      toast.success("Comment added!");
      onCommentAdded?.();
    } catch (err) {
      console.error("Error submitting comment:", err);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  /** 🔹 Role badge colors */
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "leader":
        return "bg-blue-500 text-white";
      case "journalist":
        return "bg-amber-500 text-white";
      case "mp":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  /** 🔹 Recursive renderer for nested comments */
  const renderComments = (commentList: Comment[], depth = 0) => {
    return commentList.map((c) => (
      <div key={c.id} className={`mt-3 ${depth > 0 ? "ml-8" : ""}`}>
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={c.author?.profile_image} alt={c.author?.username} />
            <AvatarFallback>{c.author?.first_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-muted/30 p-2 rounded-lg">
            <p className="text-sm font-medium">
              {c.author?.first_name} {c.author?.last_name}
              {user?.id === c.author?.id && (
                <span className="text-xs text-green-600 ml-1">(You)</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {c.content}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-gray-400">
                {new Date(c.created_at).toLocaleString()}
              </p>
              <button
                onClick={() =>
                  setActiveReply(activeReply === c.id ? null : c.id)
                }
                className="text-xs text-blue-500 hover:underline flex items-center"
              >
                <CornerDownRight className="h-3 w-3 mr-1" /> Reply
              </button>
            </div>
          </div>
        </div>

        {/* Reply form inline */}
        {activeReply === c.id && (
          <CommentForm
            postId={post.id}
            isOpen={true}
            parentId={c.id}
            onClose={() => setActiveReply(null)}
            onCommentAdded={fetchComments}
            placeholder={`Replying to ${c.author?.first_name}...`}
          />
        )}

        {/* Nested replies */}
        {c.replies && c.replies.length > 0 && renderComments(c.replies, depth + 1)}
      </div>
    ));
  };

  return (
    <Card className="mb-6 shadow-soft hover:shadow-strong transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {post.user.avatar ? (
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
              ) : (
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {post.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-foreground">
                  {post.user.name}
                  {user?.id === post.user.id && (
                    <span className="text-xs text-green-600 ml-2">(You)</span>
                  )}
                </h4>
                <Badge
                  variant="secondary"
                  className={getRoleColor(post.user.role)}
                >
                  {post.user.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                @{post.user.username} • {post.timestamp}
              </p>
            </div>
          </div>

          {/* Owner actions */}
          {user && user.id === post.user.id ? (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast.info("Edit feature coming soon ✏️")}
              >
                <Edit className="h-4 w-4 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <Link to={`/post/${post.id}`} className="hover:underline">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </Link>

          {post.media?.length ? (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.media.map((m, idx) =>
                m.media_type.startsWith("image") ? (
                  <img
                    key={idx}
                    src={m.media_url}
                    alt={`Post media ${idx + 1}`}
                    className="w-full max-h-[550px] object-contain rounded-xl border border-border shadow-sm hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : m.media_type.startsWith("video") ? (
                  <video
                    key={idx}
                    src={m.media_url}
                    controls
                    className="w-full max-h-[500px] object-cover rounded-lg"
                  />
                ) : null
              )}
            </div>
          ) : null}

          {post.type === "interview" && (
            <div className="mt-3 p-4 bg-red-500 rounded-lg border border-red-600 flex items-center space-x-2 text-white">
              <Play className="h-5 w-5" />
              <span className="font-medium">Live Interview</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`${liked ? "text-red-500" : "text-muted-foreground"} hover:text-red-600`}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  liked ? "fill-current text-red-500" : "text-muted-foreground"
                }`}
              />
              {likes}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-muted-foreground hover:text-primary"
            >
              <Share className="h-4 w-4 mr-2" />
              {shares}
            </Button>
          </div>
        </div>

        {/* Comment Section */}
        {showCommentForm && (
          <div className="mt-4 border-t pt-3 space-y-3">
            <CommentForm
              postId={post.id}
              isOpen={true}
              onClose={() => setShowCommentForm(false)}
              onCommentAdded={fetchComments}
              placeholder="Share your thoughts on this post..."
            />

            {loadingComments ? (
              <p className="text-sm text-muted-foreground">
                Loading comments...
              </p>
            ) : comments.length > 0 ? (
              <div>{renderComments(comments)}</div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

