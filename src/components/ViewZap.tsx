import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function getErrorMessage(errorParam: string | null) {
  if (!errorParam) return null;
  if (errorParam === "viewlimit")
    return "View limit exceeded. This file is no longer accessible.";
  if (errorParam === "expired")
    return "This link has expired. The file is no longer available.";
  if (errorParam === "notfound")
    return "This link does not exist or has expired.";
  if (errorParam === "incorrect_password")
    return "Incorrect password. Please try again.";
  return "An unexpected error occurred. Please try again later.";
}

function getErrorHeading(errorParam: string | null) {
  if (errorParam === "expired") return "Link Expired";
  if (errorParam === "viewlimit") return "View Limit Exceeded";
  if (errorParam === "notfound") return "Not Found";
  if (errorParam === "incorrect_password") return "Incorrect Password";
  return "Access Denied";
}

export default function ViewZap() {
  const { shortId } = useParams();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");
    const errorMsg = getErrorMessage(errorParam);
    if (errorMsg) {
      if (errorParam === "incorrect_password") {
        setPasswordRequired(true);
        setPasswordError(errorMsg);
        setLoading(false);
        return;
      }
      setError(errorMsg);
      setErrorType(errorParam);
      toast.error(errorMsg);
      setLoading(false);
      return;
    }
    const fetchZap = async () => {
      setLoading(true);
      setError(null);
      setErrorType(null);
      setPasswordRequired(false);
      setPasswordError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`
        );
        // If successful, the backend will redirect or serve the file.
        if (response.data) {
          window.location.href = response.data.url;
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Check if it's a password required error
          if (
            err.response.data?.message
              ?.toLowerCase()
              .includes("password required")
          ) {
            setPasswordRequired(true);
            setLoading(false);
            return;
          } else if (
            err.response.data?.message
              ?.toLowerCase()
              .includes("incorrect password")
          ) {
            setPasswordError("Incorrect password. Please try again.");
            setPasswordRequired(true);
            setLoading(false);
            return;
          }
        } else if (err.response?.status === 410) {
          setError("This link has expired. The file is no longer available.");
          setErrorType("expired");
          toast.error(
            "This link has expired. The file is no longer available."
          );
        } else if (err.response?.status === 404) {
          setError("This link does not exist or has expired.");
          setErrorType("notfound");
          toast.error("This link does not exist or has expired.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
          setErrorType(null);
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchZap();
  }, [shortId, location.search]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setPasswordError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}`,
        {
          params: { password },
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Handle successful response
      if (response.data) {
        const { type, url, content, data, name } = response.data;

        if (type === "redirect" || type === "file") {
          // Redirect to the URL
          window.location.href = url;
        } else if (type === "text" || type === "document") {
          // Escape HTML entities for security
          const escapeHtml = (unsafe: string) =>
            unsafe
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
          const escapedContent = escapeHtml(content);
          const escapedName = escapeHtml(name || "Untitled");
          // Use the backend's dark theme template
          const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${escapedName}</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #e5e7eb;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #111827;
                        min-height: 100vh;
                    }
                    .container {
                        background: #1f2937;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                        border: 1px solid #374151;
                    }
                    h1 {
                        color: #f9fafb;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #3b82f6;
                        padding-bottom: 10px;
                        font-size: 2rem;
                        font-weight: 600;
                    }
                    .content {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-size: 16px;
                        color: #d1d5db;
                        line-height: 1.7;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #374151;
                        text-align: center;
                        color: #9ca3af;
                        font-size: 14px;
                    }
                    @media (max-width: 768px) {
                        body {
                            padding: 15px;
                        }
                        .container {
                            padding: 20px;
                        }
                        h1 {
                            font-size: 1.5rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${escapedName}</h1>
                    <div class="content">${escapedContent}</div>
                    <div class="footer">
                        Powered by ZapLink
                    </div>
                </div>
            </body>
            </html>
          `;
          const newWindow = window.open("", "_blank");
          if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
          }
        } else if (type === "image") {
          // Display image
          const newWindow = window.open("", "_blank");
          if (newWindow) {
            newWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>${name || "Image"}</title>
              </head>
              <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
                <img src="${data}" alt="${
              name || "Image"
            }" style="max-width: 100%; max-height: 100vh;">
              </body>
              </html>
            `);
            newWindow.document.close();
          }
        }
      }
    } catch (err: any) {
      if (
        err.response &&
        err.response.status === 401 &&
        err.response.data?.message?.toLowerCase().includes("incorrect password")
      ) {
        setPasswordError("Incorrect password. Please try again.");
      } else if (
        err.response &&
        err.response.status === 401 &&
        err.response.data?.message?.toLowerCase().includes("password required")
      ) {
        setPasswordError("Password required.");
      } else if (
        err.response &&
        (err.response.status === 410 || err.response.status === 403)
      ) {
        setError("View limit exceeded. This file is no longer accessible.");
        setErrorType("viewlimit");
        toast.error("View limit exceeded. This file is no longer accessible.");
      } else if (err.response && err.response.status === 404) {
        setError("This link does not exist or has expired.");
        setErrorType("notfound");
        toast.error("This link does not exist or has expired.");
      } else {
        setPasswordError(
          "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Password Required
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
              disabled={verifying}
              autoFocus
            />
            {passwordError && (
              <div className="text-red-600 text-sm">{passwordError}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={verifying || !password}
            >
              {verifying ? "Verifying..." : "Unlock"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {getErrorHeading(errorType)}
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => (window.location.href = "/")} className="mt-2">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // If no error and not loading, the backend should have redirected or served the file.
  return null;
}
