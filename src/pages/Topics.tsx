import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, MessageSquare, Search, Plus, ArrowUp } from "lucide-react";
import { dummyTopics } from "@/data/dummyData";
import { Topic } from '../data/dummyData';

const Topics = () => {
  const trendingTopics = dummyTopics.filter(topic => topic.trending);
  const allTopics = dummyTopics;
  const hotTopics = trendingTopics.slice(0, 6);

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Discussion Topics
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Explore conversations that matter to Uganda
            </p>
          </div>
          <Button className="shadow-md w-full sm:w-auto bg-inherit dark:hover:text-gray-950 dark:text-white border-gray-400 border-2 hover:bg-white text-black  hover:text-black">
            <Plus className="h-4 w-4 mr-2" />
            Start Topic
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 sm:mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search topics..."
            className="pl-10 bg-muted/50 border-none focus-visible:ring-primary w-full"
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Hot Topics</h2>
          </div>
        </div>

        {/* Hot Topics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {hotTopics.map((topic, index) => (
            <Card
              key={topic.id}
              className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-l-gray-500"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">

                    <Badge className="bg-primary-foreground text-black text-xs sm:text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {topic.category}
                  </Badge>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                  {topic.title}
                </h3>

                <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {topic.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 text-xs sm:text-sm text-muted-foreground">
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
                    className="text-primary hover:text-primary/80 w-full sm:w-auto"
                  >
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
            Browse by Category
          </h2>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "Economy",
              "Education",
              "Health",
              "Infrastructure",
              "Environment",
              "Technology",
              "Politics",
              "Agriculture",
            ].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="rounded-full text-xs sm:text-sm whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>


        {/* Trending Topics */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {trendingTopics.map((topic) => (
              <Card
                key={topic.id}
                className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-primary/20"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <Badge className="bg-primary-foreground text-black text-xs sm:text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {topic.category}
                    </Badge>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    {topic.title}
                  </h3>

                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {topic.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{topic.posts} posts</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80 w-full sm:w-auto"
                    >
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Topics */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
            All Topics
          </h2>
          <div className="grid gap-3 sm:gap-4">
            {allTopics.map((topic) => (
              <Card
                key={topic.id}
                className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">
                          {topic.title}
                        </h3>
                        {topic.trending && (
                          <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs sm:text-sm">
                          {topic.category}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                        {topic.description}
                      </p>

                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{topic.posts} posts</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        View Posts
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary w-full sm:w-auto"
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


      </div>
    </Layout>
  );
};

export default Topics;
