import { useNavigate } from "react-router-dom";
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  LinkIcon,
  Type,
  FileXIcon as DocxIcon,
  Presentation,
  Zap,
} from "lucide-react";
import { cn } from "../lib/utils";

export default function Home() {
  const navigate = useNavigate();

  const contentTypes = [
    {
      id: "pdf",
      label: "PDF",
      icon: FileText,
      color: "from-red-500 to-red-600",
    },
    {
      id: "image",
      label: "Image",
      icon: ImageIcon,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "video",
      label: "Video",
      icon: Video,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "audio",
      label: "Audio",
      icon: Music,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "url",
      label: "URL",
      icon: LinkIcon,
      color: "from-green-500 to-green-600",
    },
    {
      id: "text",
      label: "Text",
      icon: Type,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "document",
      label: "Document",
      icon: DocxIcon,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: "presentation",
      label: "Presentation",
      icon: Presentation,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const handleOptionClick = (typeId: string) => {
    // Clear any existing session storage when switching types
    sessionStorage.clear();
    navigate("/upload", { state: { type: typeId } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-enter">
      {/* Modern Glass Navbar */}
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
            <Link
              to="/url-shortener"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 relative group"
            >
              URL Shortener
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
            
            {/* Modern Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="relative h-10 w-10 rounded-xl bg-muted/50 hover:bg-muted/80 transition-all duration-300 hover:scale-110 group"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="relative h-9 w-9 rounded-xl bg-muted/50 hover:bg-muted/80 transition-all duration-300"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 rounded-xl bg-muted/50 hover:bg-muted/80 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-card/90 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/url-shortener"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                URL Shortener
              </Link>
              <Link
                to="/how-it-works"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                to="/about"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-6xl">
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
            Share Files with
            <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mt-2">
              Secure QR Codes
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform any file into a secure, shareable QR code with password
            protection, self-destruct options, and beautiful customization.
          </p>
        </div>

        {/* Content Type Selection */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 sm:mb-12 text-foreground">
            What would you like to share?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {contentTypes.map((type, index) => (
              <button
                key={type.id}
                onClick={() => handleOptionClick(type.id)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-6 sm:p-8 transition-all duration-300",
                  "hover:scale-105 hover:shadow-2xl card-hover",
                  "bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--primary), var(--primary))`,
                  }}
                ></div>

                <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                  <div
                    className={cn(
                      "p-3 sm:p-4 rounded-2xl bg-gradient-to-br transition-all duration-300 shadow-lg",
                      "group-hover:scale-110 group-hover:shadow-xl",
                      type.color
                    )}
                  >
                    <type.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {type.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-24">
          <div
            className="text-center p-6 sm:p-8 rounded-3xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg card-hover"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
              Lightning Fast
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Generate QR codes instantly with our optimized processing engine
              and cloud infrastructure.
            </p>
          </div>

          <div
            className="text-center p-6 sm:p-8 rounded-3xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg card-hover"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <svg
                className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
              Secure & Private
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Bank-level encryption with password protection and self-destruct
              options keep your files safe.
            </p>
          </div>

          <div
            className="text-center p-6 sm:p-8 rounded-3xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg card-hover"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <svg
                className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
              Fully Customizable
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Design your QR codes with custom frames, colors, logos, and
              professional styling options.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
