import React from 'react'
import { Element, Link as LinkScroll } from "react-scroll";
import Button from "../components/Button.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import ArticlesList from './ArticlesList.jsx';

const Articles = () => {
  const { theme } = useTheme();

  return (
    <section className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">

        <div className="container flex flex-wrap items-center gap-10">
          
          {/* Text Content - Left Side */}
          <div
            className="flex-1 max-w-512 max-lg:max-w-388 animate-fadeInUp opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <div className={`caption small-2 uppercase ${theme === "dark" ? "text-p3" : "text-light-text-400"}`}>
              Uganda's Voice
            </div>
            <h1
              className={`mb-6 h1 uppercase max-lg:mb-7 max-lg:h2
              max-md:mb-4 max-md:text-5xl max-md:leading-12 animate-fadeInUp opacity-0 ${theme === "dark" ? "text-p4" : "text-light-text-200"}`}
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              Connect. Share. Influence.
            </h1>
            
           

            <p
              className={`max-w-440 mb-14 body-1 max-md:mb-10 animate-fadeInUp opacity-0 ${theme === "dark" ? "text-p5" : "text-light-text-300"}`}
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              CIV-CON brings together Ugandans to share news,
              ask questions, and comment on issues that matter to Uganda.
            </p>

            

            
            <Button className="" icon="/images/zap.svg">Join the Conversation</Button>
            
          </div>

     
          <div
            className="flex-1 flex justify-end animate-fadeInRight opacity-0"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
         
         
          </div>

        </div>
 
        <ArticlesList />
    </section>

  );
};

export default Articles;



