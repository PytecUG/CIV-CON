import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bookmark, Share, Clock, ArrowRight, Search, TrendingUp, Eye } from "lucide-react";
import { dummyArticles } from "@/data/dummyData";

const Articles = () => {
  const featuredArticle = dummyArticles[0];
  const otherArticles = dummyArticles.slice(1);
  const breakingNews = dummyArticles.slice(0, 3);
  const trendingTopics = ["#YouthEmployment", "#EducationReform", "#ClimateAction", "#TechInnovation"];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Latest Articles</h1>
          <p className="text-muted-foreground">In-depth analysis and reporting on Uganda's most important issues</p>
        </div>

        {/* Featured Article */}
        <Card className="mb-8 shadow-strong overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <CardContent className="md:w-1/2 p-8">
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                <Badge variant="secondary">{featuredArticle.category}</Badge>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {featuredArticle.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={featuredArticle.author.avatar} alt={featuredArticle.author.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {featuredArticle.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{featuredArticle.author.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{featuredArticle.readTime}</span>
                      <span>•</span>
                      <span>{featuredArticle.publishedAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArticles.map((article) => (
            <Card key={article.id} className="shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3 leading-tight line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={article.author.avatar} alt={article.author.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {article.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{article.author.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Articles;