import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { postService } from "@/services/postService";

interface CommentFormProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  onCommentAdded?: () => void; // refresh callback for feed or post
}

export const CommentForm = ({
  postId,
  isOpen,
  onClose,
  placeholder = "Write a comment...",
  onCommentAdded,
}: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    setError("");

    try {
      await postService.createComment(postId, comment.trim());
      setComment("");
      if (onCommentAdded) onCommentAdded();
      onClose();
    } catch (err: any) {
      console.error("Failed to post comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4 border border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/32/32" alt="You" />
            <AvatarFallback className="bg-gray-200 text-gray-600">YU</AvatarFallback>
          </Avatar>

          <form onSubmit={handleSubmit} className="flex-1">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={placeholder}
              className="min-h-[80px] resize-none border-gray-200 focus:ring-gray-400"
              autoFocus
            />

            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}

            <div className="flex items-center justify-between mt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={!comment.trim() || loading}
                className="bg-white text-primary border-primary border-2 hover:bg-primary/90 hover:text-primary-foreground"
              >
                {loading ? "Posting..." : <><Send className="h-4 w-4 mr-2" /> Post Comment</>}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
