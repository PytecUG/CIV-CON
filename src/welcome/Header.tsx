import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Button from "../components/_all/Button";


const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { to: "/", title: "Explore" },
    { to: "/top-articles", title: "Top Articles" },
    { to: "/about", title: "Latest News" },
    { to: "/trending", title: "Trending Topics" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 bg-card/95 text-foreground ${
        hasScrolled ? "py-2 glass-effect shadow-elegant" : "py-3"
      } animate-fade-in`}
    >
      {/* Mobile Top Bar */}
      <div className="container flex h-14 items-center justify-between relative lg:hidden">
        {/* Mobile: Menu Toggle */}
        <button
          className="lg:hidden w-10 h-10 rounded-full flex justify-center items-center border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <FaTimes className="w-5 h-5" />
          ) : (
            <FaBars className="w-5 h-5" />
          )}
        </button>

        {/* Mobile: Logo */}
        <NavLink
          to="/"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2"
        >
          <h2 className="h6 text-gradient font-bold tracking-wide">CIV-CON</h2>
        </NavLink>

        {/* Mobile: Button */}
        <Button
          href="/Welcome"
          className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft"
        >
          The Forum
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-14 left-0 w-full transition-all duration-300 overflow-hidden bg-sidebar-background text-sidebar-foreground ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } shadow-soft`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-3">
          {menuItems.map(({ to, title }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `py-2 uppercase font-semibold transition-colors duration-300 ${
                  isActive
                    ? "text-primary text-gradient"
                    : "text-sidebar-foreground hover:text-sidebar-primary"
                }`
              }
            >
              {title}
            </NavLink>
          ))}
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex container w-full items-center justify-between py-3">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <NavLink to="/" className="nav-logo">
            <h2 className="h6 text-gradient font-bold tracking-wide">CIV-CON</h2>
          </NavLink>

          {/* Nav Links */}
          <nav className="flex items-center gap-8" aria-label="Desktop navigation">
            {menuItems.map(({ to, title }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative font-medium transition-all duration-300 cursor-pointer hover:text-primary ${
                    isActive ? "text-gradient" : "text-foreground"
                  } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-primary after:transition-all after:duration-300 hover:after:w-full ${
                    isActive ? "after:w-full" : ""
                  }`
                }
              >
                {title}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Theme toggle + Button */}
        <div className="flex items-center gap-6">
          <ThemeToggle className="px-3 py-2" />
          <Button
            href="/Welcome"
            className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft"
          >
            The Forum
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;