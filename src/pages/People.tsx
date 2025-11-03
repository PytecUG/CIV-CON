import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import { followService } from "@/services/followService";
import { useNavigate } from "react-router-dom";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";


interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  region?: string;
  role?: string;
  profile_image?: string;
  followers_count?: number;
  verified?: boolean;
  isFollowing?: boolean;
}

const regions = ["All", "Central", "Eastern", "Northern", "Western"];

const People = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, selectedRegion]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";
      const params: any = {};
      if (searchQuery.trim()) params.search = searchQuery;
      if (selectedRegion !== "All") params.region = selectedRegion;

      const res = await axios.get(`${API_URL}/users/`, { params });
      let usersData: User[] = res.data;

      if (token && currentUser) {
        const followingRes = await axios.get(`${API_URL}/follow/${currentUser.id}/following`);
        const followingIds = followingRes.data.map((u: any) => u.id);
        usersData = usersData.map((u) => ({
          ...u,
          isFollowing: followingIds.includes(u.id),
        }));
      }

      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUser: User) => {
    if (!token || !currentUser) {
      toast.warning("You must sign in to follow users.");
      return;
    }

    try {
      if (targetUser.isFollowing) {
        await followService.unfollow(targetUser.id, token);
        toast.info(`Unfollowed ${targetUser.first_name}`);
        targetUser.isFollowing = false;
        targetUser.followers_count = Math.max(0, (targetUser.followers_count || 0) - 1);
      } else {
        await followService.follow(targetUser.id, token);
        toast.success(`Now following ${targetUser.first_name}`);
        targetUser.isFollowing = true;
        targetUser.followers_count = (targetUser.followers_count || 0) + 1;
      }
      setUsers([...users]);
    } catch (err: any) {
      console.error("Follow toggle failed:", err);
      toast.error(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">People on CivCon</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search people..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "outline"}
              onClick={() => setSelectedRegion(region)}
              className="rounded-full text-sm"
            >
              {region}
            </Button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-center">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card
                key={user.id}
                className="shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/user/${user.username}`)}
              >
                <CardHeader className="flex flex-col items-center text-center pt-6 pb-2">
                  <Avatar className="h-16 w-16 mb-2 ring-1 ring-muted/30">
                    <AvatarImage src={user.profile_image} alt={user.username} />
                    <AvatarFallback>
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-semibold flex items-center gap-1">
                    {user.first_name} {user.last_name}
                    {user.verified && (
                      <VerifiedBadge />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {user.role || "citizen"}
                  </Badge>
                </CardHeader>

                <CardContent className="pb-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Region: <span className="font-medium">{user.region || "—"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.followers_count} followers
                  </p>
                  {currentUser?.id !== user.id && (
                    <Button
                      variant={user.isFollowing ? "secondary" : "outline"}
                      size="sm"
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(user);
                      }}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default People;
