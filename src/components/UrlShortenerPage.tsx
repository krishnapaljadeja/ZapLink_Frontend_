/*
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LinkIcon } from "lucide-react";

export default function UrlShortenerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    shortUrl: string;
    qrCode: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (!/^https?:\/\//.test(url)) {
      toast.error("Please enter a valid http:// or https:// URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/url-shortener`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );
      if (!res.ok) throw new Error("Failed to shorten URL");
      const data = await res.json();
      setResult({ shortUrl: data.shortUrl, qrCode: data.qrCode });
    } catch (err) {
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card/50 rounded-2xl shadow-xl p-8 border border-border/30">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 rounded-full p-4 mb-2">
            <LinkIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center">URL Shortener</h1>
          <p className="text-muted-foreground text-center text-sm mb-2">
            Quickly create a short link and QR code for any URL. No login
            required.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="Enter your URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full"
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Shortening..." : "Shorten & Generate QR"}
          </Button>
        </form>
        {result && (
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center">
              <img
                src={result.qrCode}
                alt="QR Code"
                className="w-40 h-40 mx-auto"
              />
            </div>
            <div>
              <span className="font-semibold">Short Link: </span>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline break-all"
              >
                {result.shortUrl}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
*/
