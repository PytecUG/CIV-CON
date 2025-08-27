import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Send, X } from "lucide-react";

interface CommentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  placeholder?: string;
}

export const CommentForm = ({ isOpen, onClose, onSubmit, placeholder = "Write a comment..." }: CommentFormProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="mt-4 border border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/32/32" alt="You" />
            <AvatarFallback className="bg-gray-200 text-gray-600">yu</AvatarFallback>
          </Avatar>
          <form onSubmit={handleSubmit} className="flex-1">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={placeholder}
              className="min-h-[80px] resize-none border-gray-200 focus:ring-gray-400"
              autoFocus
            />
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
                disabled={!comment.trim()}
                className="bg-white text-primary border-primary border-2 hover:bg-primary/90 hover:text-primary-foreground"
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};