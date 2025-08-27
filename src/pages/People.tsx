import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Dummy Data
const users = [
  { id: 1, name: "Hon. Rebecca Kadaga", region: "Eastern", role: "Leader", avatar: "/api/placeholder/80/80" },
  { id: 2, name: "Charles Onyango-Obbo", region: "Northern", role: "Journalist", avatar: "/api/placeholder/80/80" },
  { id: 3, name: "Dr. Kiiza Besigye", region: "Central", role: "Politician", avatar: "/api/placeholder/80/80" },
  { id: 4, name: "Sarah Namatovu", region: "Western", role: "Citizen", avatar: "/api/placeholder/80/80" },
  { id: 5, name: "Andrew Mwenda", region: "Central", role: "Journalist", avatar: "/api/placeholder/80/80" },
  { id: 6, name: "Robert Kyagulanyi", region: "Central", role: "Politician", avatar: "/api/placeholder/80/80" },
  { id: 7, name: "Jane Achan", region: "Northern", role: "Citizen", avatar: "/api/placeholder/80/80" },
  { id: 8, name: "David Okello", region: "Eastern", role: "Leader", avatar: "/api/placeholder/80/80" },
];

const regions = ["All", "Central", "Eastern", "Northern", "Western"];

const People = () => {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      (selectedRegion === "All" || user.region === selectedRegion) &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Connect with People</h1>
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

        {/* Region Filter */}
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

        {/* Grid of User Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="relative shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
              >
                {/* Avatar top-right corner */}
                <div className="absolute top-3 right-3">
                  <Avatar className="h-14 w-14 ring-2 ring-background shadow-md">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1 w-fit">
                    {user.role}
                  </Badge>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    Region: <span className="font-medium">{user.region}</span>
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center col-span-full">
              No users found in this region.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default People;
