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
} from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useTheme } from "../lib/theme-provider";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const contentTypes = [
    { id: "pdf", label: "PDF", icon: FileText },
    { id: "image", label: "Image", icon: ImageIcon },
    { id: "video", label: "Video", icon: Video },
    { id: "audio", label: "Audio", icon: Music },
    { id: "url", label: "URL", icon: LinkIcon },
    { id: "text", label: "Text", icon: Type },
    { id: "docx", label: "DOCX", icon: DocxIcon },
    { id: "pptx", label: "PPTX", icon: Presentation },
  ];

  const handleOptionClick = (typeId: string) => {
    navigate("/upload", { state: { type: typeId } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="font-bold text-xl flex items-center gap-2 text-foreground"
          >
            <img src="/zaplink.png" alt="ZapLink Logo" className="h-8 w-auto" />
            <span>ZapLink</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-muted-foreground hover:text-foreground"
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

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
          What do you want to create a QR code for?
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleOptionClick(type.id)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-all",
                "hover:border-primary hover:shadow-sm",
                "border-border bg-card"
              )}
            >
              <type.icon className="h-8 w-8 text-muted-foreground transition-colors" />
              <span className="text-sm font-medium text-foreground">
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
