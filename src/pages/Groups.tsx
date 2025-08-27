import { useState } from "react";
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

const dummyGroups = [
  {
    id: '1',
    name: 'Youth Entrepreneurs Uganda',
    description: 'A community for young business owners and aspiring entrepreneurs',
    members: 1247,
    posts: 89,
    image: '/api/placeholder/60/60',
    category: 'Business',
    isJoined: true
  },
  {
    id: '2',
    name: 'Education Reform Advocates',
    description: 'Discussing and advocating for better education policies',
    members: 892,
    posts: 156,
    image: '/api/placeholder/60/60',
    category: 'Education',
    isJoined: false
  },
  {
    id: '3',
    name: 'Climate Action Uganda',
    description: 'Environmental activists working for a sustainable future',
    members: 634,
    posts: 203,
    image: '/api/placeholder/60/60',
    category: 'Environment',
    isJoined: true
  },
  {
    id: '4',
    name: 'Tech Innovation Hub',
    description: 'Connecting tech enthusiasts and innovators across Uganda',
    members: 2156,
    posts: 342,
    image: '/api/placeholder/60/60',
    category: 'Technology',
    isJoined: false
  }
];

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: ''
  });

  const filteredGroups = dummyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    console.log('Creating group:', newGroup);
    setShowCreateForm(false);
    setNewGroup({ name: '', description: '', category: '' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Discussion Groups</h1>
            <p className="text-muted-foreground">Join communities that matter to you</p>
          </div>
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
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    placeholder="Describe your group's purpose"
                  />
                </div>
                <div>
                  <Label htmlFor="groupCategory">Category</Label>
                  <Input
                    id="groupCategory"
                    value={newGroup.category}
                    onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                    placeholder="e.g., Business, Education, Technology"
                  />
                </div>
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={group.image} alt={group.name} />
                    <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {group.category}
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
                    {group.members.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {group.posts} posts
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={group.isJoined ? "outline" : "default"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.location.href = '/join-discussions'}
                  >
                    {group.isJoined ? "View Discussions" : "Join Discussions"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Groups;