import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaEye, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

function ArticleCard({
  mediaType = "image",
  mediaSrc,
  title,
  author,
  content,
  createdAt,
  reads,
  category,
  isSmall = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="card rounded-lg shadow-soft hover:shadow-strong transition-shadow duration-300 overflow-hidden">
        {/* Media */}
        <div className="relative overflow-hidden">
          {mediaType === "image" ? (
            <img
              src={mediaSrc}
              alt={title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <video
              src={mediaSrc}
              controls
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {category && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1.5 rounded-md animate-fade-in">
              {category}
            </span>
          )}
        </div>

        {isSmall ? (
          <div className="p-4">
            <h3
              onClick={() => navigate(`/article/${title.toLowerCase().replace(/\s+/g, '-')}`)}
              className="h6 text-foreground hover:text-primary cursor-pointer transition-colors duration-300"
            >
              {title}
            </h3>
          </div>
        ) : (
          <>
            <div className="px-4 pt-3 text-xs text-muted-foreground flex items-center gap-1">
              <FaUser size={12} />
              By {author || "Unknown"}
            </div>
            <div className="p-4 space-y-3">
              <h3
                onClick={() => navigate(`/article/${title.toLowerCase().replace(/\s+/g, '-')}`)}
                className="h6 text-foreground hover:text-primary cursor-pointer transition-colors duration-300"
              >
                {title}
              </h3>
              <p
                className={`text-muted-foreground body-3 transition-all duration-300 ${
                  expanded ? "line-clamp-4" : "line-clamp-2"
                }`}
              >
                {content}
              </p>
              {content && content.split(" ").length > 20 && (
                <button
                  className="btn btn-secondary flex items-center gap-1 text-sm"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <>
                      Read Less <FaChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Read More <FaChevronDown size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="border-t border-border mx-4" />
            <div className="flex justify-between items-center text-sm text-muted-foreground px-4 py-3">
              <span className="flex items-center gap-1">
                <FaCalendarAlt size={12} /> {createdAt}
              </span>
              <span className="flex items-center gap-1">
                <FaEye size={12} /> {reads} reads
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ArticleCard;