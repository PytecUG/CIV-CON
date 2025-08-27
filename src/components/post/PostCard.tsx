import { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/data/dummyData";
import { Link } from "react-router-dom";
import { CommentForm } from "@/components/forms/CommentForm";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader':
        return 'bg-gray-300 text-primary-foreground';
      case 'journalist':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'interview') {
      return <Play className="h-4 w-4" />;
    }
    return null;
  };

  const handleCommentSubmit = (comment: string) => {
    console.log("New comment:", comment);
    // This would normally be sent to backend
  };

  return (
    <Card className="mb-6 shadow-soft hover:shadow-strong transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600">
                {post.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-foreground">{post.user.name}</h4>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs">✓</span>
                  </div>
                )}
                <Badge variant="secondary" className={getRoleColor(post.user.role)}>
                  {post.user.role}
                </Badge>
              </div>
              <p className="text-sm  text-muted-foreground">@{post.user.username} • {post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <Link to={`/post/${post.id}`} className="hover:underline">
            <p className="text-foreground leading-relaxed cursor-pointer">{post.content}</p>
          </Link>
          {post.image && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          {post.type === 'interview' && (
            <div className="mt-3 p-4 bg-red-500 rounded-lg border border-red-600">
              <div className="flex items-center space-x-2 text-white">
                <Play className="h-5 w-5" />
                <span className="font-medium">Live Interview</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Heart className="h-4 w-4 mr-2" />
              {post.likes}
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
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Share className="h-4 w-4 mr-2" />
              {post.shares}
            </Button>
          </div>
        </div>
        
        {/* Comment Form */}
        <CommentForm
          isOpen={showCommentForm}
          onClose={() => setShowCommentForm(false)}
          onSubmit={handleCommentSubmit}
          placeholder="Share your thoughts on this post..."
        />
      </CardContent>
    </Card>
  );
};