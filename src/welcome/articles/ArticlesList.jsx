import React, { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import articlesData from "../../services/dummyData";

function ArticlesList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const data = Array.isArray(articlesData)
      ? articlesData
      : articlesData.articles || [];
    setArticles(data);
  }, []);

  if (articles.length === 0) {
    return (
      <p className="text-center text-muted-foreground body-1 py-8 animate-fade-in">
        No articles available.
      </p>
    );
  }

  const layoutBArticles = articles.slice(0, 8);
  const layoutAArticles = articles.slice(8);

  return (
    <section className="articles-list py-12 bg-gradient-subtle">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {layoutBArticles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {layoutAArticles.map((article, index) => {
            if (index % 3 === 0) {
              return (
                <ArticleCard
                  key={article.id}
                  {...article}
                  className="lg:col-span-2"
                />
              );
            } else {
              return (
                <ArticleCard
                  key={article.id}
                  {...article}
                  isSmall
                />
              );
            }
          })}
        </div>
      </div>
    </section>
  );
}

export default ArticlesList;