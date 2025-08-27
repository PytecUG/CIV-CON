import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, MoreHorizontal, ArrowLeft, Send } from "lucide-react";
import { dummyPosts, dummyUsers } from "@/data/dummyData";

interface Comment {
  id: string;
  user: typeof dummyUsers[0];
  content: string;
  timestamp: string;
  likes: number;
}

const dummyComments: Comment[] = [
  {
    id: '1',
    user: dummyUsers[2],
    content: 'This is a very important issue that needs immediate attention. I completely agree with your points.',
    timestamp: '1 hour ago',
    likes: 5
  },
  {
    id: '2',
    user: dummyUsers[4],
    content: 'Great analysis! Have you considered the impact on rural communities as well?',
    timestamp: '2 hours ago',
    likes: 12
  },
  {
    id: '3',
    user: dummyUsers[1],
    content: 'Thank you for bringing this to our attention. We need more discussions like this.',
    timestamp: '3 hours ago',
    likes: 8
  }
];

const PostDetail = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(dummyComments);

  const post = dummyPosts.find(p => p.id === id);

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
              <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
              <Link to="/feed">
                <Button>Back to Feed</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: dummyUsers[2], // Current user
        content: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader':
        return 'bg-primary text-primary-foreground';
      case 'journalist':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <Link to="/feed" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>

        {/* Main Post */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {post.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-foreground">{post.user.name}</h4>
                    {post.user.verified && (
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                    )}
                    <Badge variant="secondary" className={getRoleColor(post.user.role)}>
                      {post.user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{post.user.username} • {post.timestamp}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-foreground leading-relaxed text-lg mb-4">{post.content}</p>
              {post.image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-6">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Heart className="h-5 w-5 mr-2" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {comments.length}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Share className="h-5 w-5 mr-2" />
                  {post.shares}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Comment */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={dummyUsers[2].avatar} alt={dummyUsers[2].name} />
                <AvatarFallback>{dummyUsers[2].name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-20"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{comment.user.name}</span>
                      <Badge variant="outline" className={getRoleColor(comment.user.role)}>
                        {comment.user.role}
                      </Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-foreground mb-2">{comment.content}</p>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Heart className="h-4 w-4 mr-1" />
                      {comment.likes}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;