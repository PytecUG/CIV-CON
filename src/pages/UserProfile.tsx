import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { followService } from "@/services/followService";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";


interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image?: string;
  bio?: string;
  occupation?: string;
  district_id?: string;
  region?: string;
  role?: string;
  political_interest?: string;
  community_role?: string;
  followers_count?: number;
  following_count?: number;
  isFollowing?: boolean;
  verified?: boolean;
}

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutualFollowers, setMutualFollowers] = useState<User[]>([]);
  const [mutualInterests, setMutualInterests] = useState<string[]>([]);
  const { user: currentUser, token } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";

  useEffect(() => {
    if (username) fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users/by-username/${username}`);
      const profile = res.data;

      if (token && currentUser) {
        const followingRes = await axios.get(`${API_URL}/follow/${currentUser.id}/following`);
        const followingIds = followingRes.data.map((f: any) => f.id);
        profile.isFollowing = followingIds.includes(profile.id);
      }

      setUser(profile);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      toast.error("User not found or could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMutuals = async () => {
      if (!token || !user || !currentUser) return;
      try {
        const data = await followService.getMutualFollowers(user.id, token);
        setMutualFollowers(data);
      } catch (err) {
        console.error("Failed to fetch mutual followers:", err);
      }
    };
    fetchMutuals();
  }, [token, user, currentUser]);

  useEffect(() => {
    const fetchMutualInterests = async () => {
      if (!user || !token || !currentUser) return;
      try {
        const data = await followService.getMutualInterests(user.id, token);
        setMutualInterests(data.mutual_interests || data);
      } catch (err) {
        console.error("Failed to fetch mutual interests:", err);
      }
    };
    fetchMutualInterests();
  }, [user, token, currentUser]);

  const handleFollowToggle = async () => {
    if (!token || !user) {
      toast.warning("Sign in to follow people.");
      return;
    }

    try {
      if (user.isFollowing) {
        await followService.unfollow(user.id, token);
        setUser({ ...user, isFollowing: false, followers_count: (user.followers_count || 1) - 1 });
        toast.info(`Unfollowed ${user.first_name}`);
      } else {
        await followService.follow(user.id, token);
        setUser({ ...user, isFollowing: true, followers_count: (user.followers_count || 0) + 1 });
        toast.success(`Now following ${user.first_name}`);
      }
    } catch (err) {
      console.error("Follow toggle failed:", err);
      toast.error("Something went wrong while updating follow status.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-muted-foreground animate-pulse">Loading user profile...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-muted-foreground">User not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card className="shadow-soft mb-8 border-t-4 border-t-primary/70">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary/30">
              <AvatarImage src={user.profile_image} alt={user.username} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>

            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              {user.first_name} {user.last_name}
              {user.verified && (
                <VerifiedBadge />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">@{user.username}</p>

            {currentUser && currentUser.id !== user.id && mutualFollowers.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Followed by{" "}
                {mutualFollowers.slice(0, 2).map((m, i) => (
                  <span key={m.id} className="font-medium">
                    {m.first_name}
                    {i === 0 && mutualFollowers.length > 1 ? ", " : ""}
                  </span>
                ))}
                {mutualFollowers.length > 2 && <> and {mutualFollowers.length - 2} others</>}
              </p>
            )}

            <Badge variant="secondary" className="mt-3 capitalize">
              {user.role || "citizen"}
            </Badge>

            {currentUser?.id !== user.id && (
              <Button
                className={`mt-4 w-32 transition-all ${
                  user.isFollowing
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                onClick={handleFollowToggle}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </CardHeader>

          <CardContent className="text-center space-y-2">
            {user.bio && <p className="text-muted-foreground">{user.bio}</p>}

            <div className="grid grid-cols-2 gap-3 text-sm mt-4">
              <div>
                <p className="text-muted-foreground">Region</p>
                <p className="font-medium">{user.region || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">District</p>
                <p className="font-medium">{user.district_id || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Occupation</p>
                <p className="font-medium">{user.occupation || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Followers</p>
                <p className="font-medium">{user.followers_count || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {mutualInterests.length > 0 && (
          <Card className="shadow-soft border-l-4 border-l-primary/70">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                You both share these interests
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mutualInterests.map((interest, i) => (
                <Badge key={i} variant="outline" className="capitalize">
                  {interest}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
