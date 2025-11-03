import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Share2,
  Bookmark,
} from "lucide-react";
import { articleService } from "@/services/articleService";
import { toast } from "sonner";

interface Author {
  id: number;
  name: string;
  avatar?: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  image: string;
  tags: string[];
  author: Author;
  read_time: string;
  published_at: string;
}

const SCROLL_KEY = "articles_scroll_position";

const ArticleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevArticle, setPrevArticle] = useState<Article | null>(null);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);

  /** Fetch article and related content */
  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await articleService.getArticleById(Number(id));
      const normalized = {
        ...data,
        image: data.image?.startsWith("http")
          ? data.image
          : `https://api.civ-con.org/${data.image}`,
        author: {
          ...data.author,
          avatar: data.author?.avatar?.startsWith("http")
            ? data.author.avatar
            : `https://api.civ-con.org/${data.author?.avatar}`,
        },
      };
      setArticle(normalized);

      const relatedData = await articleService.getAllArticles({
        category: data.category,
        limit: 3,
      });
      setRelated(relatedData.filter((a: any) => a.id !== data.id));

      const all = await articleService.getAllArticles({ limit: 50 });
      const currentIndex = all.findIndex((a: any) => a.id === data.id);
      if (currentIndex > 0) setPrevArticle(all[currentIndex - 1]);
      if (currentIndex < all.length - 1) setNextArticle(all[currentIndex + 1]);
    } catch (err) {
      console.error("Failed to fetch article:", err);
      toast.error("Could not load article details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  /** Smooth back navigation with scroll restoration */
  const handleBack = () => {
    const savedScroll = sessionStorage.getItem(SCROLL_KEY);
    navigate(-1);
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScroll, 10),
          behavior: "smooth",
        });
        sessionStorage.removeItem(SCROLL_KEY);
      }, 150);
    }
  };

  /** Navigate to next or previous article */
  const handleNavigate = (targetId: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/articles/${targetId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10 text-center text-muted-foreground flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p>Loading article...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10 text-center text-muted-foreground">
          <p>Article not found.</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Back + Actions */}
        <div className="mb-6 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 text-foreground tracking-tight">
          {article.title}
        </h1>
        <div className="flex items-center space-x-3 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={article.author.avatar} alt={article.author.name} />
            <AvatarFallback>
              {article.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {article.published_at} • {article.read_time}
            </p>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[420px] object-cover"
          />
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {article.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-sm bg-muted/70 text-foreground border border-border hover:bg-muted transition px-3 py-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Main Content */}
        <article className="max-w-[720px] mx-auto prose prose-lg prose-neutral dark:prose-invert leading-relaxed text-foreground mb-16">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mb-16">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Related Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map((r) => (
                <Card
                  key={r.id}
                  className="shadow-soft hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                  onClick={() => handleNavigate(r.id)}
                >
                  <img
                    src={
                      r.image?.startsWith("http")
                        ? r.image
                        : `https://api.civ-con.org/${r.image}`
                    }
                    alt={r.title}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <CardContent className="p-5">
                    <h4 className="text-lg font-semibold line-clamp-2 mb-2">
                      {r.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {r.summary}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {r.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Keep Reading Section */}
        {(prevArticle || nextArticle) && (
          <section className="mt-12 border-t border-border pt-8">
            <h3 className="text-2xl font-semibold mb-8 text-center">
              Keep Reading
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {prevArticle && (
                <Card
                  onClick={() => handleNavigate(prevArticle.id)}
                  className="cursor-pointer group overflow-hidden shadow-soft hover:shadow-lg transition-all"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        prevArticle.image?.startsWith("http")
                          ? prevArticle.image
                          : `https://api.civ-con.org/${prevArticle.image}`
                      }
                      alt={prevArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs uppercase mb-1 opacity-90">
                        Previous Article
                      </p>
                      <h4 className="text-lg font-semibold line-clamp-2">
                        {prevArticle.title}
                      </h4>
                    </div>
                  </div>
                </Card>
              )}

              {nextArticle && (
                <Card
                  onClick={() => handleNavigate(nextArticle.id)}
                  className="cursor-pointer group overflow-hidden shadow-soft hover:shadow-lg transition-all"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        nextArticle.image?.startsWith("http")
                          ? nextArticle.image
                          : `https://api.civ-con.org/${nextArticle.image}`
                      }
                      alt={nextArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs uppercase mb-1 opacity-90">
                        Next Article
                      </p>
                      <h4 className="text-lg font-semibold line-clamp-2">
                        {nextArticle.title}
                      </h4>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ArticleDetails;
