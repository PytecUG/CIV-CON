import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  MessageSquare,
  Search,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { topicService } from "@/services/topicService";
import { connectTopicSocket, disconnectTopicSocket } from "@/services/topicWS";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Topic {
  id: number;
  title: string;
  description: string;
  category: string;
  posts: number;
  trending: boolean;
}


const categories = [
  "Economy",
  "Education",
  "Health",
  "Infrastructure",
  "Environment",
  "Technology",
  "Politics",
  "Agriculture",
];

const SCROLL_KEY = "topics_scroll_position";

const Topics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    category: "",
  });

  const observerRef = useRef<HTMLDivElement | null>(null);
  const LIMIT = 9;

  /** Restore scroll position */
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(SCROLL_KEY);
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  /** Fetch topics from backend */
  const fetchTopics = useCallback(
    async (reset = false) => {
      if (loading) return;
      try {
        setLoading(true);
        const skip = reset ? 0 : page * LIMIT;
        const params: Record<string, any> = { skip, limit: LIMIT };
        if (filterCategory !== "All") params.category = filterCategory;
        if (search) params.search = search;

        const data = await topicService.getAll(params);

        if (reset) {
          setTopics(data);
          setPage(1);
        } else {
          setTopics((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
        }

        setHasMore(data.length >= LIMIT);
      } catch (err) {
        console.error("Failed to load topics:", err);
        toast.error("Failed to load topics from the server");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [filterCategory, search, page, loading]
  );

  /** Infinite scroll */
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchTopics(false);
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchTopics, hasMore, loading]);

  /** Refetch on filters */
  useEffect(() => {
    setTopics([]);
    setPage(0);
    setHasMore(true);
    fetchTopics(true);
  }, [filterCategory, search]);

  /**  WebSocket: Real-time topic updates */
  useEffect(() => {
    const ws = connectTopicSocket((data) => {
      if (data.event === "new_topic") {
        setTopics((prev) => [data.topic, ...prev]);
        toast.success(`🔥 New topic: ${data.topic.title}`);
      }
    });
    return () => disconnectTopicSocket();
  }, []);

  const trendingTopics = topics.filter((t) => t.trending).slice(0, 6);

  /** Handle create topic */
  const handleCreateTopic = async () => {
    if (!newTopic.title.trim() || !newTopic.description.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      setLoading(true);
      const created = await topicService.create(newTopic);
      toast.success("Topic created successfully!");
      setTopics((prev) => [created, ...prev]);
      setNewTopic({ title: "", description: "", category: "" });
      setOpenCreateModal(false);
    } catch (err) {
      console.error("Error creating topic:", err);
      toast.error("Failed to create topic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Discussion Topics
            </h1>
            <p className="text-muted-foreground">
              Explore conversations that matter to Uganda
            </p>
          </div>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="shadow-md w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Start Topic
          </Button>
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/50 border-none focus-visible:ring-primary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {["All", ...categories].map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "rounded-full text-sm px-4 py-1",
                  filterCategory === cat
                    ? "bg-primary text-primary-foreground shadow"
                    : "hover:bg-muted"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        {trendingTopics.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                Hot Topics
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Hot
                      </Badge>
                      <Badge variant="outline">{topic.category}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {topic.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{topic.posts}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Topics */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            All Topics
          </h2>
          <div className="grid gap-4">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className="shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{topic.title}</h3>
                        {topic.trending && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Trending
                          </Badge>
                        )}
                        <Badge variant="outline">{topic.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {topic.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {topic.posts} posts
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Infinite Scroll Sentinel */}
          <div
            ref={observerRef}
            className="h-12 mt-10 flex justify-center items-center"
          >
            {loading && !initialLoad && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Loading more topics...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*  Create Topic Modal */}
      <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Input
              placeholder="Topic title"
              value={newTopic.title}
              onChange={(e) =>
                setNewTopic((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Textarea
              placeholder="Brief description..."
              value={newTopic.description}
              onChange={(e) =>
                setNewTopic((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
            <Select
              value={newTopic.category}
              onValueChange={(value) =>
                setNewTopic((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              onClick={handleCreateTopic}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                "Create Topic"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Topics;
