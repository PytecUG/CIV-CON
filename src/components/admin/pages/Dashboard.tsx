import { useState, useEffect } from "react";
import {
  Users,
  Newspaper,
  Users2,
  MapPin,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
  totalSubscriptions: { value: number; change: number };
  revenueGenerated: { value: number; change: number };
  subscriptionPlans: { plan: string; subscribers: number; revenue: number }[];
}

export const Dashboard = () => {
  // 🔹 Analytics data
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
    totalSubscriptions: { value: 0, change: 0 },
    revenueGenerated: { value: 0, change: 0 },
    subscriptionPlans: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data: AnalyticsData = {
        totalLeaders: { value: 150, change: 5 },
        totalJournalists: { value: 80, change: 0 },
        totalCitizens: { value: 1200, change: 10 },
        totalDistricts: { value: 15, change: -2 },
        postsToday: { value: 245, change: 15 },
        articlesToday: { value: 32, change: 8 },
        activeUsers: { value: 850, change: 12 },
        activeDistricts: { value: 12, change: -5 },
        totalGroups: { value: 45, change: 3 },
        trendingTopics: [
          { name: "Community Development", posts: 120 },
          { name: "Education Reform", posts: 95 },
          { name: "Health Awareness", posts: 80 },
          { name: "Local Governance", posts: 65 },
          { name: "Economic Growth", posts: 50 },
        ],
        totalSubscriptions: { value: 230, change: 8 },
        revenueGenerated: { value: 1250000, change: 12 }, // In UGX
        subscriptionPlans: [
          { plan: "Basic Leader", subscribers: 120, revenue: 600000 },
          { plan: "Premium Leader", subscribers: 80, revenue: 480000 },
          { plan: "Enterprise", subscribers: 30, revenue: 170000 },
        ],
      };
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);

  const getIndicator = (change: number) => {
    if (change > 0)
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0)
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-blue-500" />;
  };

  // 🔹 Chart Data
  const [postGrowth] = useState([
    { name: "Jan", posts: 15 },
    { name: "Feb", posts: 25 },
    { name: "Mar", posts: 20 },
    { name: "Apr", posts: 28 },
    { name: "May", posts: 18 },
    { name: "Jun", posts: 30 },
  ]);

  const [commentTrend] = useState([
    { day: 1, approved: 5, pending: 8, spam: 2 },
    { day: 5, approved: 25, pending: 15, spam: 10 },
    { day: 10, approved: 30, pending: 12, spam: 8 },
    { day: 15, approved: 20, pending: 25, spam: 5 },
  ]);

  const [revenueTrend] = useState([
    { month: "Jan", revenue: 80000 },
    { month: "Feb", revenue: 95000 },
    { month: "Mar", revenue: 120000 },
    { month: "Apr", revenue: 110000 },
    { month: "May", revenue: 140000 },
    { month: "Jun", revenue: 150000 },
  ]);

  const [latestPosts] = useState([
    { title: "Road Infrastructure in Kampala", status: "Published", date: "Oct 30, 2025" },
    { title: "Youth Employment in Gulu", status: "Draft", date: "Oct 29, 2025" },
    { title: "Healthcare Access in Mbale", status: "Published", date: "Oct 28, 2025" },
    { title: "Education Reform Proposal", status: "Published", date: "Oct 27, 2025" },
  ]);

  const [recentComments] = useState([
    { author: "Aisha N.", comment: "This proposal could transform our district!", date: "Oct 30, 2025" },
    { author: "James O.", comment: "Need more data on budget allocation.", date: "Oct 30, 2025" },
    { author: "Sarah M.", comment: "Great discussion on local governance.", date: "Oct 29, 2025" },
    { author: "David K.", comment: "How can citizens get involved?", date: "Oct 29, 2025" },
  ]);

  const [recentSubscriptions] = useState([
    { user: "Hon. Jane Doe", plan: "Premium Leader", date: "Oct 30, 2025", amount: 50000 },
    { user: "John Reporter", plan: "Basic Leader", date: "Oct 29, 2025", amount: 25000 },
    { user: "MP Uganda", plan: "Enterprise", date: "Oct 28, 2025", amount: 200000 },
    { user: "Local Leader", plan: "Premium Leader", date: "Oct 27, 2025", amount: 50000 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "text-green-600";
      case "Draft":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const COLORS = ["#10b981", "#059669", "#047857", "#065f46"];

  return (
    <div className="container py-6 space-y-6 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary">
        CIVCON Admin Dashboard
      </h1>
      <p className="text-muted-foreground">
        Real-time insights into platform performance, engagement, and revenue for Uganda's civic platform.
      </p>

      {/* 🔹 Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <Users className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Leaders</p>
              <p className="text-xl font-bold">{analytics.totalLeaders.value}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getIndicator(analytics.totalLeaders.change)}
                {Math.abs(analytics.totalLeaders.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <Newspaper className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Journalists</p>
              <p className="text-xl font-bold">{analytics.totalJournalists.value}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getIndicator(analytics.totalJournalists.change)}
                {Math.abs(analytics.totalJournalists.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <Users2 className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Citizens</p>
              <p className="text-xl font-bold">{analytics.totalCitizens.value}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getIndicator(analytics.totalCitizens.change)}
                {Math.abs(analytics.totalCitizens.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <MapPin className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Districts</p>
              <p className="text-xl font-bold">{analytics.totalDistricts.value}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getIndicator(analytics.totalDistricts.change)}
                {Math.abs(analytics.totalDistricts.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 Revenue and Subscription Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <CreditCard className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Total Subscriptions</p>
              <p className="text-xl font-bold">{analytics.totalSubscriptions.value}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getIndicator(analytics.totalSubscriptions.change)}
                {Math.abs(analytics.totalSubscriptions.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <DollarSign className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Revenue Generated</p>
              <p className="text-xl font-bold">UGX {analytics.revenueGenerated.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getIndicator(analytics.revenueGenerated.change)}
                {Math.abs(analytics.revenueGenerated.change)}% this week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 Subscription Plans Pie Chart */}
      <Card className="shadow-soft bg-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Subscription Plans Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.subscriptionPlans}
                dataKey="subscribers"
                nameKey="plan"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analytics.subscriptionPlans.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} subscribers`, "Subscribers"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🔹 Content Activity */}
      <Card className="shadow-soft bg-card hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-500" />
          <CardTitle className="text-base">Content Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <p className="font-semibold text-green-600">Posts Today</p>
            <p className="text-xl font-bold">{analytics.postsToday.value}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {getIndicator(analytics.postsToday.change)}
              {Math.abs(analytics.postsToday.change)}% from yesterday
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(analytics.postsToday.value / 300) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-600">Articles Today</p>
            <p className="text-xl font-bold">{analytics.articlesToday.value}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {getIndicator(analytics.articlesToday.change)}
              {Math.abs(analytics.articlesToday.change)}% from yesterday
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(analytics.articlesToday.value / 50) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Growth (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={postGrowth}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments Trend (Last 15 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={commentTrend}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#fbbf24" strokeWidth={2} />
                <Line type="monotone" dataKey="spam" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Latest Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestPosts.map((post, i) => (
              <div key={i} className="flex justify-between items-center p-2 border-b border-muted last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentComments.map((comment, i) => (
              <div key={i} className="flex justify-between items-start p-2 border-b border-muted last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium truncate">{comment.author}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">{comment.comment}</p>
                  <p className="text-xs text-muted-foreground">{comment.date}</p>
                </div>
                <button className="text-green-600 hover:underline flex items-center gap-1 text-xs">
                  <Eye className="h-3 w-3" /> View
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentSubscriptions.map((sub, i) => (
              <div key={i} className="flex justify-between items-center p-2 border-b border-muted last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium truncate">{sub.user}</p>
                  <p className="text-xs text-muted-foreground">{sub.plan}</p>
                  <p className="text-xs text-green-600 font-medium">UGX {sub.amount.toLocaleString()}</p>
                </div>
                <p className="text-xs text-muted-foreground">{sub.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};