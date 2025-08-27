import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, MapPin, Calendar } from "lucide-react";
import { dummyPosts } from "@/data/dummyData";
import { Link } from "react-router-dom";

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

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="shadow-soft">
              <CardContent className="p-4 sm:p-6">
                <div className="flex space-x-3 sm:space-x-4 ">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src="/api/placeholder/40/40" alt="You" />
                    <AvatarFallback className="bg-primary-foreground text-gray-700 text-sm sm:text-base">YU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's happening in Uganda? Share your thoughts..."
                      className="min-h-[100px] border-none resize-none focus-visible:ring-0 text-sm sm:text-base"
                    />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
                        <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
                          <ImageIcon className="h-4 w-4 mr-1 sm:mr-2" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
                          <MapPin className="h-4 w-4 mr-1 sm:mr-2" />
                          Location
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
                          <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                          Event
                        </Button>
                      </div>
                      <Button variant="premium" className="hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-6">
              {dummyPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Trending Topics */}
            <Card className="shadow-soft">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Trending Topics</h3>
                <div className="flex flex-col gap-2">
                  {trendingTopics.map((trend, index) => (
                    <Link 
                      key={index} 
                      to={`/live-discussion/${index + 1}`}
                      className="flex justify-between items-center hover:bg-muted/50 p-2 rounded cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-primary">{trend.tag}</p>
                        <p className="text-sm text-muted-foreground">{trend.posts}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Leaders */}
            <Card className="shadow-soft">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Active Leaders</h3>
                <div className="space-y-3">
                  {activeLeaders.map((leader, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage src={`/api/placeholder/32/32`} alt={leader.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                            {leader.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {leader.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 border-2 border-background rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-medium">{leader.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{leader.role}</p>
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
