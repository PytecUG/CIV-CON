import { useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Share, Clock, Loader2, PlusCircle, Pin, ArrowDownUp } from "lucide-react";
import { articleService } from "@/services/articleService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "use-debounce";

interface Author {
  id: number;
  name: string;
  avatar?: string;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  image: string;
  tags: string[];
  author: Author;
  read_time: string;
  published_at: string;
  is_featured?: boolean;
}

const categories = [
  { name: "All", value: "" },
  { name: "Politics", value: "Politics" },
  { name: "Education", value: "Education" },
  { name: "Health", value: "Health" },
  { name: "Technology", value: "Technology" },
  { name: "Environment", value: "Environment" },
  { name: "Economy", value: "Economy" },
  { name: "Youth", value: "Youth" },
  { name: "Innovation", value: "Innovation" },
];

const sortOptions = [
  { label: "Most Recent", value: "latest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Relevant", value: "relevance" },
];

const SCROLL_KEY = "articles_scroll_position";

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [initialLoad, setInitialLoad] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const LIMIT = 6;
  const { token } = useAuth();
  const navigate = useNavigate();

  /** Restore scroll position */
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(SCROLL_KEY);
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem(SCROLL_KEY);
    }
  }, []);

  /** Save scroll position before navigation */
  const handleNavigate = (url: string) => {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    navigate(url);
  };

  /** Fetch articles (with pagination, filters, search & sort) */
  const fetchArticles = useCallback(
    async (reset = false) => {
      if (loading) return;
      try {
        setLoading(true);
        const skip = reset ? 0 : page * LIMIT;
        const params: Record<string, any> = { skip, limit: LIMIT };

        if (filterCategory) params.category = filterCategory;
        if (filterTag) params.tag = filterTag;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (sortBy) params.sort = sortBy;

        const data = await articleService.getAllArticles(params);

        const normalized = data.map((a: any) => ({
          ...a,
          image: a.image?.startsWith("http")
            ? a.image
            : `https://api.civ-con.org/${a.image}`,
          author: {
            ...a.author,
            avatar: a.author?.avatar?.startsWith("http")
              ? a.author.avatar
              : `https://api.civ-con.org/${a.author?.avatar}`,
          },
        }));

        if (reset) {
          setArticles(normalized);
          setPage(1);
        } else {
          setArticles((prev) => [...prev, ...normalized]);
          setPage((prev) => prev + 1);
        }
        setHasMore(normalized.length >= LIMIT);
      } catch (err) {
        console.error("Error fetching articles:", err);
        toast.error("Could not load articles from the server.");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [filterCategory, filterTag, debouncedSearch, sortBy, page, loading]
  );

  /** Infinite Scroll */
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchArticles(false);
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchArticles, hasMore, loading]);

  /** Reset feed on filters, search, or sort change */
  useEffect(() => {
    setArticles([]);
    setPage(0);
    setHasMore(true);
    setInitialLoad(true);
    fetchArticles(true);
  }, [filterCategory, filterTag, debouncedSearch, sortBy]);

  /** Featured Article */
  const featuredArticle =
    articles.find((a) => a.is_featured) ||
    articles.find((a) => a.tags?.includes("featured") || a.image?.startsWith("http")) ||
    null;

  const otherArticles = featuredArticle
    ? articles.filter((a) => a.id !== featuredArticle.id)
    : articles;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 relative">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Latest Articles</h1>
          <p className="text-muted-foreground">
            In-depth analysis and reporting on Uganda’s key issues
          </p>
        </div>

        {/* Create Article */}
        {token && (
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => handleNavigate("/create-article")}
              variant="premium"
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <PlusCircle className="h-4 w-4" />
              Create Article
            </Button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="relative mb-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 border-b border-border">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={filterCategory === cat.value ? "default" : "ghost"}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all",
                  filterCategory === cat.value
                    ? "bg-primary text-primary-foreground shadow"
                    : "hover:bg-muted"
                )}
                onClick={() => setFilterCategory(cat.value)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 sm:w-60"
            />
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm"
              onClick={() => setSearch("")}
            >
              <ArrowDownUp className="w-4 h-4" />
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-border rounded-md p-2 text-sm bg-background"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="border border-border rounded-md p-2 text-sm bg-background"
            >
              <option value="">All Tags</option>
              <option value="featured">#Featured</option>
              <option value="Youth">#Youth</option>
              <option value="Innovation">#Innovation</option>
              <option value="Climate">#Climate</option>
              <option value="Reform">#Reform</option>
            </select>
          </div>
        </div>

        {/* Search Info */}
        {debouncedSearch && !loading && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for “{debouncedSearch}”
          </p>
        )}

        {/* Featured Article */}
        {!initialLoad && featuredArticle && (
          <Card
            onClick={() => handleNavigate(`/articles/${featuredArticle.id}`)}
            className="mb-8 shadow-strong overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="md:flex">
              <div className="md:w-1/2 bg-black/10">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="md:w-1/2 p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-yellow-500 text-black flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Featured
                  </Badge>
                  <Badge variant="secondary">{featuredArticle.category}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-4 leading-tight line-clamp-2">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                  {featuredArticle.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={featuredArticle.author.avatar}
                        alt={featuredArticle.author.name}
                      />
                      <AvatarFallback>
                        {featuredArticle.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {featuredArticle.author.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{featuredArticle.read_time}</span>
                        <span>•</span>
                        <span>{featuredArticle.published_at}</span>
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
        )}

        {/* Articles Grid */}
        {!initialLoad && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.length > 0 ? (
              otherArticles.map((article) => (
                <Card
                  key={article.id}
                  onClick={() => handleNavigate(`/articles/${article.id}`)}
                  className="shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 group-hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={article.author.avatar}
                            alt={article.author.name}
                          />
                          <AvatarFallback>
                            {article.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {article.author.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{article.read_time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              !loading && (
                <p className="text-center text-muted-foreground col-span-full mt-10">
                  No articles found matching your search.
                </p>
              )
            )}

            {/* Infinite Scroll Sentinel */}
            <div
              ref={observerRef}
              className="h-12 mt-10 flex justify-center items-center col-span-full"
            >
              {loading && !initialLoad && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Loading more articles...</span>
                </div>
              )}
            </div>

            {!hasMore && !loading && !initialLoad && (
              <p className="text-center text-muted-foreground mt-8 col-span-full">
                You've reached the end of the list.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Articles;
