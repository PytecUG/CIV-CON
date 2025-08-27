import React from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaEye } from "react-icons/fa";
import articlesData from "../../services/dummyData";

function Article() {
  const { slug } = useParams();

  const articlesArray = articlesData.articles ? articlesData.articles : articlesData;

  const article = articlesArray.find(
    (a) => a.title.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!article) {
    return (
      <p className="text-center text-muted-foreground body-1 py-8 animate-fade-in">
        Article not found.
      </p>
    );
  }

  return (
    <div className="container py-12">
      <div className="relative rounded-lg overflow-hidden shadow-elegant mb-6 animate-scale-in">
        {article.mediaType === "image" ? (
          <img
            src={article.mediaSrc}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        ) : (
          <video
            src={article.mediaSrc}
            controls
            className="w-full h-auto object-cover"
          />
        )}
      </div>
      <h1 className="h2 text-gradient mb-4">{article.title}</h1>
      <div className="flex items-center gap-4 text-muted-foreground base mb-6">
        <span className="flex items-center gap-1">
          <FaUser className="text-accent-foreground" size={14} />
          {article.author || "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <FaCalendarAlt className="text-accent-foreground" size={14} />
          {article.createdAt}
        </span>
        <span className="flex items-center gap-1">
          <FaEye className="text-accent-foreground" size={14} />
          {article.reads} reads
        </span>
      </div>
      <p className="body-1 text-foreground leading-relaxed">{article.content}</p>
    </div>
  );
}

export default Article;