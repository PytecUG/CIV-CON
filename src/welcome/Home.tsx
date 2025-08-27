import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Twitter, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import DownloadSection from "./DownloadSection";
import Features from "./Features";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import Button from "@/components/_all/Button";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-card/95 backdrop-blur-md shadow-soft">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link to="/articles" className="text-2xl font-bold text-primary">
            CIV-CON
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {["Features", "Pricing", "Testimonials", "Download"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-foreground hover:text-primary transition underline-offset-4 hover:underline"
              >
                {link}
              </a>
            ))}

            {/* New Buttons */}
            <Link to="/register">
              <h1 className=" text-foreground hover:text-primary transition underline-offset-4 hover:underline ">Register</h1>
            </Link>
            <Link to="/forum">
              <Button className="px-3 py-1  font-semibold bg-accent text-white hover:bg-accent/80">
                Forum
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-md shadow-soft"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {["Features", "Pricing", "Testimonials", "Download"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-foreground hover:text-primary transition"
                >
                  {link}
                </a>
              ))}
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <Button className="w-full py-2 font-semibold">Register</Button>
              </Link>
              <Link to="/forum" onClick={() => setMenuOpen(false)}>
                <Button className="w-full py-2 font-semibold bg-accent text-white hover:bg-accent/80">
                  Forum
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative bg-primary dark:bg-inherit py-32 px-6 overflow-hidden"
      >
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-primary-foreground">
              CIV-CON <span className="text-gradient">Empowers</span> Ugandan Voices
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed text-yellow-500">
              Connect with leaders, journalists, and citizens to shape Uganda's future.
            </p>
            <div className="flex  sm:flex-row gap-4">
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
              <Link to="/feed">
                <Button>Sign in</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <img src="/images/phone.png" alt="CIV-CON" className="w-full" />
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"></div>
              <div className="absolute -top-20 right-1/4 w-56 h-56 bg-accent rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse-soft"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features, Pricing, Testimonials, Download Sections */}
      <div className="py-10"><Features /></div>
      <div className="py-10"><Pricing /></div>
      <div className="py-10"><Testimonials /></div>
      <div className="py-10"><DownloadSection /></div>
    </div>
  );
};

export default Landing;
