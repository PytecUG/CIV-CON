import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Users, 
  MessageSquare, 
  Search, 
  Star, 
  TrendingUp, 
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Share2,
  Plus
} from "lucide-react";

interface DiscussionGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  image: string;
  category: string;
  isJoined: boolean;
  isPopular: boolean;
  recentActivity: string;
  location?: string;
}

interface FeaturedDiscussion {
  id: string;
  title: string;
  description: string;
  participants: number;
  isLive: boolean;
  tags: string[];
  moderator: string;
  startTime: string;
}

const featuredGroups: DiscussionGroup[] = [
  {
    id: '1',
    name: 'Youth Voice Uganda',
    description: 'Empowering young Ugandans to participate in democratic processes and leadership',
    members: 2847,
    posts: 456,
    image: '/api/placeholder/80/80',
    category: 'Youth Empowerment',
    isJoined: false,
    isPopular: true,
    recentActivity: '5 minutes ago',
    location: 'Nationwide'
  },
  {
    id: '2',
    name: 'Education Reform Now',
    description: 'Discussing sustainable solutions for Uganda\'s education challenges',
    members: 1923,
    posts: 324,
    image: '/api/placeholder/80/80',
    category: 'Education',
    isJoined: false,
    isPopular: true,
    recentActivity: '12 minutes ago',
    location: 'Central Region'
  },
  {
    id: '3',
    name: 'Climate Action Uganda',
    description: 'Environmental conservation and climate change adaptation strategies',
    members: 1456,
    posts: 278,
    image: '/api/placeholder/80/80',
    category: 'Environment',
    isJoined: false,
    isPopular: true,
    recentActivity: '23 minutes ago',
    location: 'All Regions'
  },
  {
    id: '4',
    name: 'Healthcare for All',
    description: 'Advocating for accessible and quality healthcare across Uganda',
    members: 1834,
    posts: 389,
    image: '/api/placeholder/80/80',
    category: 'Healthcare',
    isJoined: false,
    isPopular: false,
    recentActivity: '1 hour ago',
    location: 'Rural Focus'
  }
];

const liveDiscussions: FeaturedDiscussion[] = [
  {
    id: '1',
    title: 'Youth Employment Crisis: Solutions from the Ground Up',
    description: 'Join young entrepreneurs and policy makers discussing practical solutions',
    participants: 234,
    isLive: true,
    tags: ['Employment', 'Youth', 'Policy'],
    moderator: 'Hon. Sarah Opendi',
    startTime: 'Live Now'
  },
  {
    id: '2',
    title: 'Digital Uganda: Technology and Innovation',
    description: 'How technology can transform Uganda\'s future',
    participants: 0,
    isLive: false,
    tags: ['Technology', 'Innovation', 'Digital'],
    moderator: 'Dr. Moses Musaazi',
    startTime: 'Tomorrow 3:00 PM'
  }
];

const JoinDiscussions = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");

  const handleJoinGroup = (groupId: string) => {
    console.log(`Joining group: ${groupId}`);
    // Here you would handle the join logic
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Join the Conversation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with fellow Ugandans, share your views, and be part of meaningful discussions that shape our nation's future.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12.5K+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">450+</div>
              <div className="text-sm text-muted-foreground">Discussion Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Live Discussions</div>
            </div>
          </div>
        </div>

        {/* Live Discussions Banner */}
        <Card className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                    Live Discussions Happening Now
                  </h3>
                  <p className="text-red-700 dark:text-red-200">
                    Join {liveDiscussions.filter(d => d.isLive).length} active discussions with {liveDiscussions.filter(d => d.isLive).reduce((acc, d) => acc + d.participants, 0)} participants
                  </p>
                </div>
              </div>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Join Live Discussion
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search discussions, topics, or groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="featured">Featured Groups</TabsTrigger>
            <TabsTrigger value="live">Live Discussions</TabsTrigger>
            <TabsTrigger value="popular">Popular Topics</TabsTrigger>
            <TabsTrigger value="local">Local Groups</TabsTrigger>
          </TabsList>

          {/* Featured Groups */}
          <TabsContent value="featured" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {featuredGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={group.image} alt={group.name} />
                          <AvatarFallback className="text-lg">{group.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            {group.isPopular && (
                              <Badge variant="destructive" className="bg-yellow-400">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="mb-2">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{group.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{group.members.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>{group.posts} posts</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{group.recentActivity}</span>
                      </div>
                    </div>

                    {group.location && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{group.location}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        onClick={() => handleJoinGroup(group.id)}
                        className="flex-1 bg-white border-1 border-red text-primary hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Join Discussion
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Discussions */}
          <TabsContent value="live" className="space-y-6">
            {liveDiscussions.map((discussion) => (
              <Card key={discussion.id} className={`${discussion.isLive ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold">{discussion.title}</h3>
                        {discussion.isLive && (
                          <Badge variant="destructive" className="bg-red-500 animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{discussion.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{discussion.participants} participants</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{discussion.startTime}</span>
                          </div>
                        </div>
                        <span>Moderated by {discussion.moderator}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      to={`/live-discussion/${discussion.id}`}
                      className="flex-1"
                    >
                      <Button className={`w-full ${discussion.isLive ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}>
                        {discussion.isLive ? 'Join Live Discussion' : 'Set Reminder'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Popular Topics */}
          <TabsContent value="popular" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { topic: "#YouthEmployment", posts: 2847, trend: "+15%" },
                { topic: "#EducationReform", posts: 1923, trend: "+8%" },
                { topic: "#HealthcareAccess", posts: 1456, trend: "+12%" },
                { topic: "#ClimateAction", posts: 1234, trend: "+5%" },
                { topic: "#DigitalUganda", posts: 1098, trend: "+20%" },
                { topic: "#WomenRights", posts: 987, trend: "+7%" }
              ].map((item) => (
                <Card key={item.topic} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-primary text-lg mb-2">{item.topic}</h3>
                    <p className="text-2xl font-bold mb-1">{item.posts.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">discussions</p>
                    <Badge variant="secondary" className="mt-2 text-green-600">
                      {item.trend} this week
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Local Groups */}
          <TabsContent value="local" className="space-y-6">
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect with Your Community</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Find discussion groups and events happening in your region, district, or local community.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <MapPin className="h-4 w-4 mr-2" />
                Find Local Groups
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Make Your Voice Heard?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of Ugandans already participating in meaningful discussions about our nation's future. 
              Every voice matters, and yours could be the one that sparks positive change.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Create community
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                 Join More Communities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinDiscussions;