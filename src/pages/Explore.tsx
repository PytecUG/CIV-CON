import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  MessageSquare,
  ArrowUp,
} from "lucide-react";

// Optional: if your dummyData file has data, keep this import
// import { dummyTopics, dummyPosts } from "@/data/dummyData";

/** 🔹 Local fallback mock data (used if dummyData not available) */
const hotTopics = [
  {
    id: 1,
    title: "Youth Empowerment in Local Governance",
    description:
      "Discuss how youth are shaping civic engagement and policy influence in Uganda.",
    category: "Governance",
    posts: 120,
  },
  {
    id: 2,
    title: "Climate Resilience in Rural Communities",
    description:
      "Explore innovative approaches towards sustainability and climate action.",
    category: "Environment",
    posts: 95,
  },
  {
    id: 3,
    title: "Education Reforms & Digital Learning",
    description:
      "How are digital tools revolutionizing learning and accessibility in schools?",
    category: "Education",
    posts: 88,
  },
];

const recentPosts = [
  {
    id: 1,
    user: { name: "Eron Laban", role: "Civic Leader" },
    timestamp: "2 hours ago",
    content: "We’re starting a new campaign on clean energy adoption!",
    likes: 24,
    comments: 6,
    shares: 3,
  },
  {
    id: 2,
    user: { name: "Grace Namara", role: "Environmentalist" },
    timestamp: "5 hours ago",
    content:
      "Uganda's youth are redefining civic responsibility through innovation 🌱",
    likes: 38,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    user: { name: "Daniel Okello", role: "Educator" },
    timestamp: "1 day ago",
    content:
      "The rise of digital classrooms in rural schools is inspiring real change.",
    likes: 42,
    comments: 10,
    shares: 8,
  },
];

const Explore = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join the Conversation
          </h1>
          <p className="text-muted-foreground">
            Discover the most discussed issues happening in your region
          </p>
        </div>

        {/* Available Community Groups */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              Available Community Groups
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotTopics.map((topic, index) => (
              <Card
                key={topic.id}
                className="shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-l-primary"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <Badge className="bg-transparent text-primary-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    </div>
                    <Badge variant="outline">{topic.category}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {topic.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {topic.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{topic.posts}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="h-4 w-4 text-red-400" />
                        <span className="text-green-500">+12%</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary-hover"
                    >
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Hot Posts */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recent Hot Posts
            </h2>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-soft hover:shadow-strong transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">
                          {post.user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">
                            {post.user.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {post.user.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {post.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-2 mb-2">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                          <span>{post.shares} shares</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Analytics */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Trending Analytics
            </h2>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Most Active Categories
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "Economy", percentage: 85, posts: 234 },
                        { name: "Education", percentage: 72, posts: 189 },
                        { name: "Infrastructure", percentage: 68, posts: 145 },
                        { name: "Technology", percentage: 45, posts: 98 },
                      ].map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-muted-foreground">
                              {category.posts} posts
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Peak Activity Hours
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Most active:{" "}
                        <span className="text-primary font-medium">
                          2:00 PM - 4:00 PM
                        </span>
                      </p>
                      <p>
                        Weekend peak:{" "}
                        <span className="text-primary font-medium">
                          10:00 AM - 12:00 PM
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
