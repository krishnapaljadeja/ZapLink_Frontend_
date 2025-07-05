import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Link as LinkIcon, Loader2, Zap, Copy, QrCode } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ThemeToggle } from "./ThemeToggle";

export default function URLShortener() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    shortUrl: string;
    qrCode: string;
    zapId: string;
  } | null>(null);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return string.startsWith('http://') || string.startsWith('https://');
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a name for your short link");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("originalUrl", url);
      formData.append("name", name);
      formData.append("type", "URL");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/upload`,
        formData
      );
      
      const { data } = response.data;
      setResult({
        shortUrl: data.shortUrl,
        qrCode: data.qrCode,
        zapId: data.zapId,
      });
      
      toast.success("Short link created successfully!");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        `Failed to create short link: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      toast.success("Short link copied to clipboard!");
    }
  };

  const handleCustomizeQR = () => {
    if (result) {
      navigate("/customize", {
        state: {
          zapId: result.zapId,
          shortUrl: result.shortUrl,
          qrCode: result.qrCode,
          type: "URL",
          name: name,
        },
      });
    }
  };

  const handleReset = () => {
    setResult(null);
    setUrl("");
    setName("");
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8 border border-border/30 animate-fade-in-up">
          {!result ? (
            <>
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <LinkIcon className="h-10 w-10 text-primary-foreground" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  URL Shortener
                </h1>
                <p className="text-lg text-muted-foreground">
                  Transform long URLs into short, shareable links with QR codes
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Name your short link
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter a memorable name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-focus text-base rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-14 px-6 font-medium"
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="url" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Enter URL to shorten
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/very-long-url..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="input-focus text-base rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-14 px-6"
                  />
                  <p className="text-sm text-muted-foreground pl-6">
                    Must start with http:// or https://
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !url.trim() || !name.trim()}
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Creating Short Link...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-5 w-5" />
                      Create Short Link
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success Result */}
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Short Link Created!
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your URL has been shortened and is ready to share
                </p>
              </div>

              {/* Result Display */}
              <div className="space-y-4">
                <div className="p-6 bg-card/30 rounded-2xl border border-border/30">
                  <Label className="text-sm font-medium text-muted-foreground">Short Link</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      value={result.shortUrl}
                      readOnly
                      className="flex-1 bg-background/50 border-border/50 text-foreground font-mono"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 bg-card/30 rounded-2xl border border-border/30">
                  <Label className="text-sm font-medium text-muted-foreground">Original URL</Label>
                  <p className="mt-2 text-foreground break-all">{url}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleCustomizeQR}
                  className="h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Customize QR Code
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 border-border/50 text-foreground hover:bg-muted/50 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Create Another
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}