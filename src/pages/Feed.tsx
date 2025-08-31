import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatePost } from "@/components/forms/CreatePost";
import { dummyPosts } from "@/data/dummyData";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

function Feed() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Button */}
            <div className="flex justify-end px-2 xs:px-3 sm:px-4">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="premium"
                    className="hover:scale-105 transition-all duration-200 text-xs xs:text-sm sm:text-base md:text-lg px-3 xs:px-4 sm:px-5 md:px-6"
                  >
                    <PlusCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-1 xs:mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] xs:max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] p-3 xs:p-4 sm:p-5">
                  <DialogHeader>
                    <DialogTitle className="text-sm xs:text-base sm:text-lg md:text-xl">
                      Create a New Post
                    </DialogTitle>
                  </DialogHeader>
                  <CreatePost />
                </DialogContent>
              </Dialog>
            </div>

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
                            {leader.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {leader.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-400 border-2 border-background rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-medium">{leader.name}</p>
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