import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Download, Copy, Share2, Palette, Sparkles, ChevronDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

type FrameOption = "none" | "rounded" | "square" | "circle" | "modern";

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
  const [frameText, setFrameText] = useState("Scan me!");
  const [frameColor, setFrameColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [transparentBackground, setTransparentBackground] = useState(false);

  const qrValue = state?.shortUrl || "https://zaplink.example.com/demo123";

  const frameOptions = [
    { id: "none", label: "No frame", preview: "○" },
    { id: "rounded", label: "Rounded", preview: "⬜" },
    { id: "square", label: "Square", preview: "■" },
    { id: "circle", label: "Circle", preview: "●" },
    { id: "modern", label: "Modern", preview: "◆" },
  ];

  const getFrameStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      background: transparentBackground ? "transparent" : backgroundColor,
      padding: frameStyle === "none" ? 0 : 24,
      position: "relative",
    };

    switch (frameStyle) {
      case "rounded":
        return {
          ...baseStyle,
          borderRadius: 24,
          border: `3px solid ${frameColor}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        };
      case "square":
        return {
          ...baseStyle,
          border: `3px solid ${frameColor}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        };
      case "circle":
        return {
          ...baseStyle,
          borderRadius: "50%",
          border: `3px solid ${frameColor}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        };
      case "modern":
        return {
          ...baseStyle,
          borderRadius: 20,
          background: `linear-gradient(135deg, ${frameColor}, ${frameColor}dd)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        };
      default:
        return baseStyle;
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = frameText && frameStyle !== "none" ? 450 : 400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Set background
      if (!transparentBackground) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw QR code
      ctx.drawImage(img, 0, 0, 400, 400);
      
      // Add frame text if applicable
      if (frameText && frameStyle !== "none") {
        ctx.fillStyle = textColor;
        ctx.font = "bold 24px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(frameText, canvas.width / 2, canvas.height - 20);
      }
      
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
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Customize Your QR Code
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-border/30 animate-fade-in-up">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-12">
            <span className="text-sm text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full">
              Step 3 of 3
            </span>
            <div className="flex-1 mx-6 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="progress-bar h-full w-full"></div>
            </div>
            <span className="text-sm text-primary font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Ready!
            </span>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* QR Preview */}
            <div className="flex flex-col items-center justify-center animate-scale-in">
              <div className="bg-gradient-to-br from-card to-card/30 p-12 rounded-3xl border border-border/30 shadow-2xl backdrop-blur-sm">
                <div
                  ref={qrRef}
                  className="flex flex-col items-center justify-center transition-all duration-500 hover:scale-105"
                  style={getFrameStyle()}
                >
                  <QRCodeSVG
                    value={qrValue}
                    size={280}
                    bgColor={transparentBackground ? "transparent" : backgroundColor}
                    fgColor="#000"
                    level="H"
                    includeMargin
                  />
                  {frameText && frameStyle !== "none" && (
                    <div 
                      className="mt-4 text-center font-semibold text-lg"
                      style={{ color: textColor }}
                    >
                      {frameText}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customization Controls */}
            <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Customize Design</h2>
              </div>

              {/* QR Code Frame */}
              <div className="space-y-6">
                <Label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  QR code frame
                </Label>
                
                <div className="grid grid-cols-5 gap-4">
                  {frameOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFrameStyle(option.id as FrameOption)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                        frameStyle === option.id
                          ? "border-primary bg-primary/10"
                          : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="w-12 h-12 bg-muted/30 rounded-lg flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl">{option.preview}</span>
                      </div>
                      <span className="text-xs font-medium text-foreground">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Text */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">Frame text</Label>
                  <Input
                    value={frameText}
                    onChange={(e) => setFrameText(e.target.value)}
                    placeholder="Scan me!"
                    className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">Text color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="color-picker"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Frame Color */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">Frame color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="color-picker"
                    />
                    <Input
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">Background color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="color-picker"
                      disabled={transparentBackground}
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm font-mono"
                      disabled={transparentBackground}
                    />
                  </div>
                </div>
              </div>

              {/* Transparent Background */}
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-card/30 border border-border/30">
                <Checkbox
                  id="transparent-bg"
                  checked={transparentBackground}
                  onCheckedChange={(checked) => setTransparentBackground(checked === true)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="transparent-bg" className="text-base font-medium text-foreground cursor-pointer">
                  Transparent background
                </Label>
              </div>

              {/* Actions */}
              <div className="space-y-6 pt-8 border-t border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Export & Share</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    onClick={handleDownload}
                    className="h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
                      Copy Link
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