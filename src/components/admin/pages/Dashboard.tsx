import { useState, useEffect } from "react";
import {
  Users,
  Newspaper,
  Users2,
  MapPin,
  MessageSquare,
  TrendingUp,
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
  totalLeaders: { value: number; change: number };
  totalJournalists: { value: number; change: number };
  totalCitizens: { value: number; change: number };
  totalDistricts: { value: number; change: number };
  postsToday: { value: number; change: number };
  articlesToday: { value: number; change: number };
  activeUsers: { value: number; change: number };
  activeDistricts: { value: number; change: number };
  totalGroups: { value: number; change: number };
  trendingTopics: { name: string; posts: number }[];
}

export const Dashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalLeaders: { value: 0, change: 0 },
    totalJournalists: { value: 0, change: 0 },
    totalCitizens: { value: 0, change: 0 },
    totalDistricts: { value: 0, change: 0 },
    postsToday: { value: 0, change: 0 },
    articlesToday: { value: 0, change: 0 },
    activeUsers: { value: 0, change: 0 },
    activeDistricts: { value: 0, change: 0 },
    totalGroups: { value: 0, change: 0 },
    trendingTopics: [],
  });

  // Placeholder API fetch
  useEffect(() => {
    const fetchAnalytics = async () => {
      const data: AnalyticsData = {
        totalLeaders: { value: 150, change: 5 }, // +5%
        totalJournalists: { value: 80, change: 0 }, // 0%
        totalCitizens: { value: 1200, change: 10 }, // +10%
        totalDistricts: { value: 15, change: -2 }, // -2%
        postsToday: { value: 245, change: 15 }, // +15%
        articlesToday: { value: 32, change: 8 }, // +8%
        activeUsers: { value: 850, change: 12 }, // +12%
        activeDistricts: { value: 12, change: -5 }, // -5%
        totalGroups: { value: 45, change: 3 }, // +3%
        trendingTopics: [
          { name: "Community Development", posts: 120 },
          { name: "Education Reform", posts: 95 },
          { name: "Health Awareness", posts: 80 },
          { name: "Local Governance", posts: 65 },
          { name: "Economic Growth", posts: 50 },
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
        Admin Dashboard
      </h1>
      <p className="text-sm xs:text-base text-muted-foreground mb-6 xs:mb-8">
        Real-time insights into platform performance and engagement.
      </p>

      {/* Four Small Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 mb-6 xs:mb-8">
        <Card className="h-24 shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardContent className="flex items-center space-x-3 pt-4">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm xs:text-base font-semibold text-primary">Leaders</p>
              <p className="text-lg xs:text-xl font-bold">{analytics.totalLeaders.value}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                {getIndicator(analytics.totalLeaders.change)} {Math.abs(analytics.totalLeaders.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-24 shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardContent className="flex items-center space-x-3 pt-4">
            <Newspaper className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm xs:text-base font-semibold text-primary">Journalists</p>
              <p className="text-lg xs:text-xl font-bold">{analytics.totalJournalists.value}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                {getIndicator(analytics.totalJournalists.change)} {Math.abs(analytics.totalJournalists.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-24 shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardContent className="flex items-center space-x-3 pt-4">
            <Users2 className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm xs:text-base font-semibold text-primary">Citizens</p>
              <p className="text-lg xs:text-xl font-bold">{analytics.totalCitizens.value}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                {getIndicator(analytics.totalCitizens.change)} {Math.abs(analytics.totalCitizens.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-24 shadow-soft hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background rounded-lg">
          <CardContent className="flex items-center space-x-3 pt-4">
            <MapPin className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm xs:text-base font-semibold text-primary">Districts</p>
              <p className="text-lg xs:text-xl font-bold">{analytics.totalDistricts.value}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                {getIndicator(analytics.totalDistricts.change)} {Math.abs(analytics.totalDistricts.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Large Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 mb-6 xs:mb-8">
        {/* Content Activity Card */}
        <Card className="shadow-soft hover:shadow-lg transition-all duration-300 bg-card rounded-lg">
          <CardHeader className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">Content Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              <div className="flex-1">
                <p className="text-sm xs:text-base font-semibold text-primary">Posts Today</p>
                <p className="text-lg xs:text-xl font-bold">{analytics.postsToday.value}</p>
                <p className="text-xs xs:text-sm text-muted-foreground flex items-center">
                  {getIndicator(analytics.postsToday.change)} {Math.abs(analytics.postsToday.change)}% from yesterday
                </p>
                <div className="mt-2 h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(analytics.postsToday.value / 300) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-1 mt-4 sm:mt-0">
                <p className="text-sm xs:text-base font-semibold text-primary">Articles Today</p>
                <p className="text-lg xs:text-xl font-bold">{analytics.articlesToday.value}</p>
                <p className="text-xs xs:text-sm text-muted-foreground flex items-center">
                  {getIndicator(analytics.articlesToday.change)} {Math.abs(analytics.articlesToday.change)}% from yesterday
                </p>
                <div className="mt-2 h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(analytics.articlesToday.value / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Engagement Card */}
        <Card className="shadow-soft hover:shadow-lg transition-all duration-300 bg-card rounded-lg">
          <CardHeader className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">Community Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              <div className="flex-1">
                <p className="text-sm xs:text-base font-semibold text-primary">Active Users</p>
                <p className="text-lg xs:text-xl font-bold">{analytics.activeUsers.value}</p>
                <p className="text-xs xs:text-sm text-muted-foreground flex items-center">
                  {getIndicator(analytics.activeUsers.change)} {Math.abs(analytics.activeUsers.change)}% today
                </p>
                <div className="mt-2 h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(analytics.activeUsers.value / 1000) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-1 mt-4 sm:mt-0">
                <p className="text-sm xs:text-base font-semibold text-primary">Active Districts</p>
                <p className="text-lg xs:text-xl font-bold">{analytics.activeDistricts.value}</p>
                <p className="text-xs xs:text-sm text-muted-foreground flex items-center">
                  {getIndicator(analytics.activeDistricts.change)} {Math.abs(analytics.activeDistricts.change)}% today
                </p>
                <div className="mt-2 h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(analytics.activeDistricts.value / 15) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-1 mt-4 sm:mt-0">
                <p className="text-sm xs:text-base font-semibold text-primary">Total Groups</p>
                <p className="text-lg xs:text-xl font-bold">{analytics.totalGroups.value}</p>
                <p className="text-xs xs:text-sm text-muted-foreground flex items-center">
                  {getIndicator(analytics.totalGroups.change)} {Math.abs(analytics.totalGroups.change)}% this week
                </p>
                <div className="mt-2 h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(analytics.totalGroups.value / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics Table */}
      <Card className="shadow-soft rounded-lg">
        <CardHeader className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm xs:text-base">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-xs sm:text-sm font-semibold text-primary">
                    Topic
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm font-semibold text-primary">
                    Posts
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.trendingTopics.map((topic, index) => (
                  <TableRow
                    key={topic.name}
                    className={cn("transition-colors", index % 2 === 0 ? "bg-background" : "bg-muted/20")}
                  >
                    <TableCell className="text-xs sm:text-sm font-medium">{topic.name}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{topic.posts}</TableCell>
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