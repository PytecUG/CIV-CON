
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";

const DownloadSection = () => {
  return (
    <section
      id="download"
      className="py-24 px-6 bg-primary text-white text-center rounded-t-md"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4 md:text-5xl text-white"
      >
        Get the CIV-CON App
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl mb-8 text-yellow-300 max-w-2xl mx-auto md:text-2xl"
      >
        Available on Android and iOS. Stay connected wherever you go.
      </motion.p>
      <div className="flex  sm:flex-row justify-center gap-4 max-w-3xl mx-auto">
        <div
          role="button"
          tabIndex={0}
          onClick={() => window.open("https://play.google.com/store", "_blank")}
          onKeyDown={(e) => e.key === "Enter" && window.open("https://play.google.com/store", "_blank")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-md shadow-soft hover:opacity-90 hover:shadow-strong transition-all duration-300 animate-scale-in cursor-pointer"
          aria-label="Download for Android"
        >
          <Smartphone className="w-5 h-5" />
          <span className="font-semibold text-lg">Download for Android</span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => window.open("https://www.apple.com/app-store", "_blank")}
          onKeyDown={(e) => e.key === "Enter" && window.open("https://www.apple.com/app-store", "_blank")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-md shadow-soft hover:opacity-90 hover:shadow-strong transition-all duration-300 animate-scale-in cursor-pointer"
          aria-label="Download for iOS"
        >
          <Smartphone className="w-5 h-5" />
          <span className="font-semibold text-lg">Download for iOS</span>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
