import { Link} from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Zap } from "lucide-react";

export default function Navbar() {
//   const location = useLocation();

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
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group"
          >
            How it Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group"
          >
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {/* Comment out the URL Shortener nav link
          <Link
            to="/url-shortener"
            className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group ${path === "/url-shortener" ? "text-primary pointer-events-none" : ""}`}
          >
            URL Shortener
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
