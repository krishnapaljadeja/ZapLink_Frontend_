import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function URLShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    inputRef.current?.focus();
  }, []);

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortLink(null);
    setQrCode(null);
    if (!validateUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/shorten`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data?.message || "Failed to shorten URL. Please try again.");
      } else {
        setShortLink(data.data.shortUrl);
        setQrCode(data.data.qrCode);
      }
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border/30 space-y-6"
      >
        <div>
          <Label
            htmlFor="url"
            className="text-lg font-semibold text-foreground"
          >
            Paste a URL to shorten
          </Label>
          <Input
            id="url"
            ref={inputRef}
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2 text-base rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-12 px-4 font-medium"
            required
            autoFocus
            disabled={loading}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button
          type="submit"
          className="w-full h-12 text-lg font-semibold rounded-xl"
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten & Generate QR"}
        </Button>
        {shortLink && (
          <div className="mt-6 text-center space-y-4">
            <div>
              <span className="font-semibold text-foreground">Short Link:</span>
              <a
                href={shortLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary underline break-all"
              >
                {shortLink}
              </a>
            </div>
            {qrCode && (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-40 h-40 rounded-xl border border-border/30 shadow-lg"
                />
                <span className="text-xs text-muted-foreground">
                  Scan or share this QR code
                </span>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
