import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine which links to show based on route
  const isHome = location.pathname === "/";
  const isHowItWorks = location.pathname === "/how-it-works";
  const isAbout = location.pathname === "/about";
  const isShortener = location.pathname === "/shorten";

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium transition-all duration-200 relative group px-2 py-1 ${
      active
        ? "text-primary after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full after:transition-all after:duration-300"
        : "text-muted-foreground hover:text-foreground after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-primary after:rounded-full group-hover:after:w-full after:transition-all after:duration-300"
    }`;

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-xl flex items-center gap-3 text-foreground group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2.5 rounded-xl shadow-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-semibold">
            ZapLink
          </span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={navLinkClass(isHome)}>
            Home
          </Link>
          <Link to="/how-it-works" className={navLinkClass(isHowItWorks)}>
            How it Works
          </Link>
          <Link to="/about" className={navLinkClass(isAbout)}>
            About Us
          </Link>
          <Link to="/shorten" className={navLinkClass(isShortener)}>
            URL Shortener
          </Link>
          <ThemeToggle />
        </nav>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 rounded-xl bg-muted/50 hover:bg-muted/80 transition-all duration-300"
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className={navLinkClass(isHome)}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={navLinkClass(isHowItWorks)}
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              to="/about"
              className={navLinkClass(isAbout)}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/shorten"
              className={navLinkClass(isShortener)}
              onClick={() => setMobileMenuOpen(false)}
            >
              URL Shortener
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
