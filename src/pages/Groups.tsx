import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, MessageSquare, Plus, Search, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { groupService } from "@/services/groupService";
import { useAuth } from "@/context/AuthContext";

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [creating, setCreating] = useState(false);

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getAll();
      setGroups(data);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      toast.error("Failed to load groups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Create group
  const handleCreateGroup = async () => {
    if (!newGroup.name || !newGroup.description) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setCreating(true);
      const group = await groupService.create(newGroup);
      toast.success("Group created successfully!");
      setGroups((prev) => [group, ...prev]);
      setShowCreateForm(false);
      setNewGroup({ name: "", description: "", category: "" });
    } catch (err) {
      console.error("Failed to create group:", err);
      toast.error("Could not create group");
    } finally {
      setCreating(false);
    }
  };

  // Join or leave group
  const handleJoinToggle = async (groupId: number, isJoined: boolean) => {
    try {
      if (isJoined) {
        await groupService.leave(groupId);
        toast.info("You left the group");
      } else {
        await groupService.join(groupId);
        toast.success("You joined the group!");
      }
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, is_joined: !isJoined } : g
        )
      );
    } catch (err) {
      console.error("Join/Leave failed:", err);
      toast.error("Action failed. Please try again.");
    }
  };

  // Filter groups
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Discussion Groups
            </h1>
            <p className="text-muted-foreground">
              Join communities that matter to you
            </p>
          </div>

          {/* Create Group Dialog */}
          {user && (
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      value={newGroup.name}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, name: e.target.value })
                      }
                      placeholder="Enter group name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupDescription">Description</Label>
                    <Textarea
                      id="groupDescription"
                      value={newGroup.description}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, description: e.target.value })
                      }
                      placeholder="Describe your group's purpose"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupCategory">Category</Label>
                    <Input
                      id="groupCategory"
                      value={newGroup.category}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, category: e.target.value })
                      }
                      placeholder="e.g., Business, Education, Technology"
                    />
                  </div>
                  <Button
                    onClick={handleCreateGroup}
                    className="w-full"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Group"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center text-muted-foreground py-10">
            Loading groups...
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No groups found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          group.image ||
                          group.cover_image ||
                          "/api/placeholder/60/60"
                        }
                        alt={group.name}
                      />
                      <AvatarFallback>
                        {group.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {group.category || "General"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {group.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.member_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {group.post_count || 0} posts
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={group.is_joined ? "outline" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleJoinToggle(group.id, group.is_joined)
                      }
                    >
                      {group.is_joined
                        ? "View Discussions"
                        : "Join Discussions"}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Groups;
