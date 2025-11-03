import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, User, MessageSquare, Newspaper } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "https://api.civ-con.org";

interface SearchResult {
  users: any[];
  posts: any[];
  comments: any[];
  articles: any[];
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("query") || "");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult>({
    users: [],
    posts: [],
    comments: [],
    articles: [],
  });
  const [activeTab, setActiveTab] = useState("all");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const navigate = useNavigate();

  const allItems = [
    ...results.articles.map((a) => ({ ...a, _type: "article" })),
    ...results.posts.map((p) => ({ ...p, _type: "post" })),
    ...results.users.map((u) => ({ ...u, _type: "user" })),
    ...results.comments.map((c) => ({ ...c, _type: "comment" })),
  ];

  // 🪄 Highlight helper
  const highlightText = useCallback(
    (text: string | null | undefined) => {
      if (!text || !query) return text;
      const regex = new RegExp(`(${query})`, "gi");
      return text.replace(
        regex,
        "<mark class='bg-yellow-200 dark:bg-yellow-500/40 font-semibold text-foreground'>$1</mark>"
      );
    },
    [query]
  );

  // 🚀 Fetch search results
  useEffect(() => {
    if (query.length < 3) return;
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/search`, { params: { query } });
        setResults(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch search results");
      } finally {
        setLoading(false);
        setActiveIndex(-1);
      }
    };
    fetchResults();
  }, [query]);

  // 🎯 Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!allItems.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? allItems.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selected = allItems[activeIndex];
      if (!selected) return;

      // Navigate based on type
      switch (selected._type) {
        case "article":
          navigate(`/articles/${selected.id}`);
          break;
        case "post":
          navigate(`/posts/${selected.id}`);
          break;
        case "user":
          navigate(`/profile/${selected.id}`);
          break;
        case "comment":
          toast.info("Opening comment’s parent post…");
          navigate(`/posts/${selected.post_id || selected.id}`);
          break;
        default:
          break;
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 3) {
      toast.warning("Search term too short");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const hasResults =
    results.articles.length ||
    results.posts.length ||
    results.users.length ||
    results.comments.length;

  // 🧱 Reusable render blocks
  const renderArticles = () =>
    results.articles.map((a, i) => (
      <Card
        key={a.id}
        onClick={() => navigate(`/articles/${a.id}`)}
        className={cn(
          "cursor-pointer transition-all border hover:shadow-lg",
          allItems[activeIndex]?.id === a.id ? "ring-2 ring-primary" : ""
        )}
      >
        <img
          src={
            a.image?.startsWith("http")
              ? a.image
              : `https://api.civ-con.org/${a.image}`
          }
          alt={a.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <CardContent className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase">
            {a.category || "Article"}
          </p>
          <h3
            className="font-semibold text-lg leading-snug line-clamp-2"
            dangerouslySetInnerHTML={{ __html: highlightText(a.title) }}
          />
          <p
            className="text-sm text-muted-foreground line-clamp-3"
            dangerouslySetInnerHTML={{ __html: highlightText(a.summary) }}
          />
        </CardContent>
      </Card>
    ));

  const renderPosts = () =>
    results.posts.map((p, i) => (
      <Card
        key={p.id}
        onClick={() => navigate(`/posts/${p.id}`)}
        className={cn(
          "hover:shadow-lg cursor-pointer transition-all",
          allItems[activeIndex]?.id === p.id ? "ring-2 ring-primary" : ""
        )}
      >
        <CardContent className="p-4">
          <h3
            className="font-semibold mb-2"
            dangerouslySetInnerHTML={{ __html: highlightText(p.title) }}
          />
          <p
            className="text-sm text-muted-foreground line-clamp-3"
            dangerouslySetInnerHTML={{ __html: highlightText(p.content) }}
          />
        </CardContent>
      </Card>
    ));

  const renderUsers = () =>
    results.users.map((u, i) => (
      <Card
        key={u.id}
        onClick={() => navigate(`/profile/${u.id}`)}
        className={cn(
          "hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 p-4",
          allItems[activeIndex]?.id === u.id ? "ring-2 ring-primary" : ""
        )}
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={u.profile_image} alt={u.username} />
          <AvatarFallback>
            {u.first_name?.[0]}
            {u.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            className="font-semibold"
            dangerouslySetInnerHTML={{ __html: highlightText(u.username) }}
          />
          <p
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: highlightText(`${u.first_name || ""} ${u.last_name || ""}`),
            }}
          />
        </div>
      </Card>
    ));

  const renderComments = () =>
    results.comments.map((c, i) => (
      <Card
        key={c.id}
        className={cn(
          "p-4 cursor-pointer hover:shadow-md transition-all",
          allItems[activeIndex]?.id === c.id ? "ring-2 ring-primary" : ""
        )}
        onClick={() => navigate(`/posts/${c.post_id || c.id}`)}
      >
        <p
          className="text-sm text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: highlightText(c.content) }}
        />
        <p className="text-xs mt-2 text-muted-foreground">
          — {c.author?.username}
        </p>
      </Card>
    ));

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          onKeyDown={handleKeyDown}
          className="mb-6 relative max-w-lg mx-auto"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for articles, users, posts, comments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          <Button
            type="submit"
            variant="default"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            Search
          </Button>
        </form>

        {/* Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="flex flex-wrap justify-center gap-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="articles">
              <Newspaper className="h-4 w-4 mr-1" /> Articles
            </TabsTrigger>
            <TabsTrigger value="posts">
              <MessageSquare className="h-4 w-4 mr-1" /> Posts
            </TabsTrigger>
            <TabsTrigger value="users">
              <User className="h-4 w-4 mr-1" /> Users
            </TabsTrigger>
            <TabsTrigger value="comments">💬 Comments</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
          </div>
        ) : !hasResults ? (
          <p className="text-center text-muted-foreground py-16">
            No results found for “{query}”
          </p>
        ) : (
          <>
            {(activeTab === "all" || activeTab === "articles") &&
              results.articles.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    Articles
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderArticles()}
                  </div>
                </section>
              )}

            {(activeTab === "all" || activeTab === "posts") &&
              results.posts.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Posts
                  </h2>
                  {renderPosts()}
                </section>
              )}

            {(activeTab === "all" || activeTab === "users") &&
              results.users.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Users
                  </h2>
                  {renderUsers()}
                </section>
              )}

            {(activeTab === "all" || activeTab === "comments") &&
              results.comments.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    💬 Comments
                  </h2>
                  {renderComments()}
                </section>
              )}
          </>
        )}
      </div>
    </Layout>
  );
}
