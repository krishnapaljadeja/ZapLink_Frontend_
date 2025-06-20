import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Download, Copy, Share2, X, Palette, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { toast } from "sonner";

type FrameOption =
  | "none"
  | "rounded"
  | "circle"
  | "shadow"
  | "gradient"
  | "border";

type CustomizePageState = {
  zapId: string;
  shortUrl: string;
  qrCode: string;
  type: string;
  name: string;
};

export default function CustomizePage() {
  const location = useLocation();
  const state = (location.state as CustomizePageState) || null;
  const qrRef = useRef<HTMLDivElement>(null);

  const [frameStyle, setFrameStyle] = useState<FrameOption>("none");
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qrValue = state?.shortUrl || "https://zaplink.example.com/demo123";

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setLogo(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getFrameStyle = (): React.CSSProperties => {
    switch (frameStyle) {
      case "rounded":
        return {
          borderRadius: 24,
          padding: 24,
          background: "hsl(var(--card))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid hsl(var(--border))",
        };
      case "circle":
        return {
          borderRadius: "50%",
          padding: 24,
          background: "hsl(var(--card))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid hsl(var(--border))",
        };
      case "shadow":
        return {
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          padding: 24,
          background: "hsl(var(--card))",
          borderRadius: 16,
        };
      case "gradient":
        return {
          padding: 24,
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
          borderRadius: 20,
          boxShadow: "0 8px 32px rgba(34, 197, 94, 0.3)",
        };
      case "border":
        return {
          padding: 24,
          border: "3px solid hsl(var(--primary))",
          borderRadius: 16,
          background: "hsl(var(--card))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        };
      default:
        return {};
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `zaplink-qr-${state?.name || "code"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      URL.revokeObjectURL(svgUrl);
      toast.success("Your QR code has been downloaded successfully.");
    };
    img.src = svgUrl;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue);
    toast.success("Short link has been copied to clipboard.");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My QR Code",
          text: "Check out my QR code",
          url: qrValue,
        })
        .catch(() => toast.error("Error sharing, please try again."));
    } else {
      toast.error("Sharing is not supported on this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Customize Your QR Code
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 space-y-8 border border-border/30 animate-fade-in-up">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs sm:text-sm text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
              Step 3 of 3
            </span>
            <div className="flex-1 mx-4 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="progress-bar h-full w-full"></div>
            </div>
            <span className="text-xs sm:text-sm text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Ready!
            </span>
          </div>

          {/* Two-column layout: Preview on left, Controls on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* QR Preview Card */}
            <div className="flex flex-col items-center justify-center animate-scale-in order-2 lg:order-1">
              <div className="bg-gradient-to-br from-card to-card/50 p-6 sm:p-8 rounded-3xl border border-border/50 shadow-2xl backdrop-blur-sm">
                <div
                  ref={qrRef}
                  className="flex items-center justify-center transition-all duration-500 hover:scale-105"
                  style={getFrameStyle()}
                >
                  <QRCodeSVG
                    value={qrValue}
                    size={240}
                    bgColor="#fff"
                    fgColor="#000"
                    level="H"
                    includeMargin
                    imageSettings={
                      logo
                        ? { src: logo, height: 50, width: 50, excavate: true }
                        : undefined
                    }
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Scan to preview your QR code
              </p>
            </div>

            {/* Customization Controls */}
            <div className="space-y-6 animate-slide-in-left order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Design Options</h2>
              </div>

              {/* Frame Style Selector */}
              <div className="space-y-4">
                <Label
                  htmlFor="frame-style"
                  className="text-base font-semibold text-foreground flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Frame Style
                </Label>
                <Select
                  value={frameStyle}
                  onValueChange={(value: string) =>
                    setFrameStyle(value as FrameOption)
                  }
                >
                  <SelectTrigger
                    id="frame-style"
                    className="w-full h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm text-foreground font-medium"
                  >
                    <SelectValue placeholder="Select a frame style" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border/50 bg-card/90 backdrop-blur-sm text-foreground shadow-2xl">
                    <SelectItem value="none" className="rounded-lg">None</SelectItem>
                    <SelectItem value="rounded" className="rounded-lg">Rounded Corners</SelectItem>
                    <SelectItem value="circle" className="rounded-lg">Circle</SelectItem>
                    <SelectItem value="shadow" className="rounded-lg">Shadow</SelectItem>
                    <SelectItem value="gradient" className="rounded-lg">Gradient</SelectItem>
                    <SelectItem value="border" className="rounded-lg">Accent Border</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <Label
                  htmlFor="logo-upload"
                  className="text-base font-semibold text-foreground flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Upload Logo (Optional)
                </Label>
                <div
                  className="relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer border-border/50 bg-background/30 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                    accept="image/*"
                  />
                  {logo ? (
                    <div className="flex items-center justify-center space-x-3">
                      <img
                        src={logo}
                        alt="Logo Preview"
                        className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-lg"
                      />
                      <span className="text-foreground font-medium">Logo uploaded</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogo(null);
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-6 pt-6 border-t border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-green-500" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Actions</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    onClick={handleDownload}
                    className="h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download QR Code
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="h-12 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] bg-background/50 backdrop-blur-sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Copy Link</span>
                      <span className="sm:hidden">Copy</span>
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="h-12 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] bg-background/50 backdrop-blur-sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}