import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  LinkIcon,
  Type,
  FileXIcon as DocxIcon,
  Presentation,
  Moon,
  Sun,
  Zap,
  ArrowRight,
} from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useTheme } from "../lib/theme-provider";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const contentTypes = [
    { id: "pdf", label: "PDF", icon: FileText, color: "from-red-500 to-red-600" },
    { id: "image", label: "Image", icon: ImageIcon, color: "from-blue-500 to-blue-600" },
    { id: "video", label: "Video", icon: Video, color: "from-purple-500 to-purple-600" },
    { id: "audio", label: "Audio", icon: Music, color: "from-pink-500 to-pink-600" },
    { id: "url", label: "URL", icon: LinkIcon, color: "from-green-500 to-green-600" },
    { id: "text", label: "Text", icon: Type, color: "from-yellow-500 to-yellow-600" },
    { id: "document", label: "Document", icon: DocxIcon, color: "from-indigo-500 to-indigo-600" },
    { id: "presentation", label: "Presentation", icon: Presentation, color: "from-orange-500 to-orange-600" },
  ];

  const handleOptionClick = (typeId: string) => {
    navigate("/upload", { state: { type: typeId } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="font-bold text-xl flex items-center gap-3 text-foreground group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              ZapLink
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105"
            >
              How it Works
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105"
            >
              About Us
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Share Files with
            <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              QR Magic
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform any file into a secure, shareable QR code. 
            Password protection, self-destruct, and beautiful customization included.
          </p>
        </div>

        {/* Content Type Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
            What would you like to share?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {contentTypes.map((type, index) => (
              <button
                key={type.id}
                onClick={() => handleOptionClick(type.id)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
                  "hover:scale-105 hover:shadow-2xl",
                  "bg-card border border-border/50 hover:border-primary/30",
                  "animate-fade-in-up"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                     style={{ backgroundImage: `linear-gradient(135deg, var(--primary), var(--primary))` }}></div>
                
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className={cn(
                    "p-4 rounded-xl bg-gradient-to-br transition-all duration-300",
                    "group-hover:scale-110 group-hover:shadow-lg",
                    type.color
                  )}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {type.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Lightning Fast</h3>
            <p className="text-muted-foreground">Generate QR codes instantly with our optimized processing engine.</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Secure & Private</h3>
            <p className="text-muted-foreground">Password protection and self-destruct options keep your files safe.</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Fully Customizable</h3>
            <p className="text-muted-foreground">Design your QR codes with custom frames, colors, and logos.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}