import { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  TrendingUp,
  MapPin,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  userGrowth: { value: number; change: number };
  engagementRate: { value: string; change: number };
  postCategories: { name: string; count: number }[];
  topDistricts: { name: string; users: number }[];
  postAnalytics: { topic: string; role: string; posts: number; engagement: number }[];
}

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: { value: 0, change: 0 },
    engagementRate: { value: "0%", change: 0 },
    postCategories: [],
    topDistricts: [],
    postAnalytics: [],
  });

  // Placeholder API fetch
  useEffect(() => {
    const fetchAnalytics = async () => {
      const data: AnalyticsData = {
        userGrowth: { value: 1234, change: 12 }, // +12%
        engagementRate: { value: "85%", change: 5 }, // +5%
        postCategories: [
          { name: "Community", count: 500 },
          { name: "Education", count: 300 },
          { name: "Health", count: 200 },
          { name: "Governance", count: 150 },
        ],
        topDistricts: [
          { name: "Kampala", users: 400 },
          { name: "Gulu", users: 250 },
          { name: "Jinja", users: 200 },
          { name: "Mbale", users: 150 },
        ],
        postAnalytics: [
          { topic: "Community Development", role: "Citizen", posts: 120, engagement: 80 },
          { topic: "Education Reform", role: "Journalist", posts: 95, engagement: 70 },
          { topic: "Health Awareness", role: "Leader", posts: 80, engagement: 65 },
          { topic: "Local Governance", role: "Student", posts: 65, engagement: 50 },
          { topic: "Economic Growth", role: "Citizen", posts: 50, engagement: 40 },
        ],
      };
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  const getIndicator = (change: number) => {
    if (change > 0) {
      return <ArrowUp className="h-4 w-4 text-yellow-500" />;
    } else if (change < 0) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="container py-4 xs:py-6 sm:py-8">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-4 xs:mb-6">
        Analytics Overview
      </h1>
      <p className="text-sm xs:text-base text-muted-foreground mb-6 xs:mb-8">
        Detailed insights into user engagement, content trends, and regional activity.
      </p>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 mb-6 xs:mb-8">
        <Card className="shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardHeader className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg xs:text-xl font-bold">{analytics.userGrowth.value}</p>
            <p className="text-xs xs:text-sm text-muted-foreground flex items-center">
              {getIndicator(analytics.userGrowth.change)} {Math.abs(analytics.userGrowth.change)}% this month
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(analytics.userGrowth.value / 1500) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardHeader className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg xs:text-xl font-bold">{analytics.engagementRate.value}</p>
            <p className="text-xs xs:text-sm text-muted-foreground flex items-center">
              {getIndicator(analytics.engagementRate.change)} {Math.abs(analytics.engagementRate.change)}% this month
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${parseFloat(analytics.engagementRate.value)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardHeader className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">Post Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.postCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <p className="text-xs xs:text-sm">{category.name}</p>
                  <p className="text-xs xs:text-sm font-semibold">{category.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardHeader className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">Top Districts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.topDistricts.map((district) => (
                <div key={district.name} className="flex items-center justify-between">
                  <p className="text-xs xs:text-sm">{district.name}</p>
                  <p className="text-xs xs:text-sm font-semibold">{district.users} users</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post Analytics Table */}
      <Card className="shadow-soft rounded-lg">
        <CardHeader className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm xs:text-base">Post Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-xs sm:text-sm font-semibold text-primary">Topic</TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-primary">Role</TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-primary">Posts</TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-primary">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.postAnalytics.map((item, index) => (
                  <TableRow
                    key={`${item.topic}-${item.role}`}
                    className={cn("transition-colors", index % 2 === 0 ? "bg-background" : "bg-muted/20")}
                  >
                    <TableCell className="text-xs sm:text-sm font-medium">{item.topic}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{item.role}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{item.posts}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{item.engagement}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};