import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Users, MessageSquare, TrendingUp, Pin } from "lucide-react";
import { dummyTopics, dummyUsers, dummyPosts } from "@/data/dummyData";

interface DiscussionPost {
  id: string;
  user: typeof dummyUsers[0];
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isPinned?: boolean;
}

const discussionPosts: DiscussionPost[] = [
  {
    id: '1',
    user: dummyUsers[0],
    content: 'The government should prioritize creating more technical and vocational training programs. Young people need practical skills that match current market demands.',
    timestamp: '2 hours ago',
    likes: 45,
    replies: 12,
    isPinned: true
  },
  {
    id: '2',
    user: dummyUsers[3],
    content: 'I believe entrepreneurship education should be mandatory in all schools. We need to nurture the business mindset from an early age.',
    timestamp: '4 hours ago',
    likes: 32,
    replies: 8
  },
  {
    id: '3',
    user: dummyUsers[2],
    content: 'What about creating youth employment centers in every district? This would help connect young people with opportunities.',
    timestamp: '6 hours ago',
    likes: 28,
    replies: 15
  }
];

const DiscussionRoom = () => {
  const { topicId } = useParams();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState(discussionPosts);

  const topic = dummyTopics.find(t => t.id === topicId);

  if (!topic) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Topic Not Found</h2>
              <p className="text-muted-foreground mb-4">The discussion topic you're looking for doesn't exist.</p>
              <Link to="/topics">
                <Button>Back to Topics</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleAddPost = () => {
    if (newPost.trim()) {
      const post: DiscussionPost = {
        id: Date.now().toString(),
        user: dummyUsers[2], // Current user
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        replies: 0
      };
      setPosts([post, ...posts]);
      setNewPost("");
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
        <Link to="/topics" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Topics
        </Link>

        {/* Topic Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{topic.title}</CardTitle>
                <p className="text-muted-foreground mb-4">{topic.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {topic.posts} posts
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Active discussion
                  </div>
                  {topic.trending && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {topic.category}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* New Post Form */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={dummyUsers[2].avatar} alt={dummyUsers[2].name} />
                <AvatarFallback>{dummyUsers[2].name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Share your thoughts on this topic..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-24"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddPost} disabled={!newPost.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discussion Posts */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Discussion ({posts.length} posts)</h3>
          {posts.map((post) => (
            <Card key={post.id} className={post.isPinned ? "border-primary bg-primary/5" : ""}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                      <span className="font-semibold">{post.user.name}</span>
                      {post.user.verified && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-xs">✓</span>
                        </div>
                      )}
                      <Badge variant="outline" className={getRoleColor(post.user.role)}>
                        {post.user.role}
                      </Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <p className="text-foreground mb-3">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        ❤️ {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post.replies} replies
                      </Button>
                    </div>
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

export default DiscussionRoom;