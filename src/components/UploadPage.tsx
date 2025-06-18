import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

type FileType =
  | "image"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "audio"
  | "video"
  | "url"
  | "text";

const TYPE_MESSAGES: Record<FileType, string> = {
  image: "Supports: .jpg, .jpeg, .png, .webp",
  pdf: "Supports: .pdf only",
  document: "Supports: .doc, .docx, .txt, .rtf",
  spreadsheet: "Supports: .xls, .xlsx, .csv",
  presentation: "Supports: .ppt, .pptx",
  archive: "Supports: .zip, .rar, .7z, .tar, .gz",
  audio: "Supports: .mp3, .wav, .ogg, .m4a",
  video: "Supports: .mp4, .avi, .mov, .wmv, .flv",
  url: "Enter a valid http:// or https:// link",
  text: "Enter text content",
};

const TYPE_EXTENSIONS: Record<FileType, string[]> = {
  image: [".jpg", ".jpeg", ".png", ".webp"],
  pdf: [".pdf"],
  document: [".doc", ".docx", ".txt", ".rtf"],
  spreadsheet: [".xls", ".xlsx", ".csv"],
  presentation: [".ppt", ".pptx"],
  archive: [".zip", ".rar", ".7z", ".tar", ".gz"],
  audio: [".mp3", ".wav", ".ogg", ".m4a"],
  video: [".mp4", ".avi", ".mov", ".wmv", ".flv"],
  url: [],
  text: [],
};

export default function UploadPage() {
  const location = useLocation();
  const initialType = (location.state?.type as FileType) || "pdf";
  const navigate = useNavigate();
  const [qrName, setQrName] = useState(
    () => sessionStorage.getItem("qrName") || ""
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState("");
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [destructViews, setDestructViews] = useState(() =>
    JSON.parse(sessionStorage.getItem("destructViews") || "false")
  );
  const [destructTime, setDestructTime] = useState(() =>
    JSON.parse(sessionStorage.getItem("destructTime") || "false")
  );
  const [viewsValue, setViewsValue] = useState(
    () => sessionStorage.getItem("viewsValue") || ""
  );
  const [timeValue, setTimeValue] = useState(
    () => sessionStorage.getItem("timeValue") || ""
  );
  const [loading, setLoading] = useState(false);
  const [type] = useState<FileType>(initialType);
  const [urlValue, setUrlValue] = useState("");
  const [textValue, setTextValue] = useState("");

  // Persist state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("qrName", qrName);
  }, [qrName]);

  useEffect(() => {
    sessionStorage.setItem("passwordProtect", JSON.stringify(passwordProtect));
  }, [passwordProtect]);

  useEffect(() => {
    sessionStorage.setItem("selfDestruct", JSON.stringify(selfDestruct));
    if (!selfDestruct) {
      setDestructViews(false);
      setDestructTime(false);
      setViewsValue("");
      setTimeValue("");
    }
  }, [selfDestruct]);

  useEffect(() => {
    sessionStorage.setItem("destructViews", JSON.stringify(destructViews));
    if (!destructViews) setViewsValue("");
  }, [destructViews]);

  useEffect(() => {
    sessionStorage.setItem("destructTime", JSON.stringify(destructTime));
    if (!destructTime) setTimeValue("");
  }, [destructTime]);

  useEffect(() => {
    sessionStorage.setItem("viewsValue", viewsValue);
  }, [viewsValue]);

  useEffect(() => {
    sessionStorage.setItem("timeValue", timeValue);
  }, [timeValue]);

  const handlePasswordProtectChange = (checked: boolean | "indeterminate") => {
    setPasswordProtect(checked === true);
  };

  const handleSelfDestructChange = (checked: boolean | "indeterminate") => {
    setSelfDestruct(checked === true);
  };

  const handleViewsValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setViewsValue(value);
    }
  };

  const handleTimeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setTimeValue(value);
    }
  };

  const validateFileType = (file: File) => {
    if (
      type === "url" ||
      type === "text" ||
      type === "document" ||
      type === "presentation"
    )
      return true;
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const allowed = TYPE_EXTENSIONS[type] || [];
    return allowed.length === 0 || allowed.includes(ext);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "text") {
      toast.error(
        "Text type does not require file upload. Please use the text input below."
      );
      e.target.value = "";
      return;
    }
    if (type === "document" || type === "presentation") {
      // Allow these types to proceed with file upload
    } else if (!validateFileType(file)) {
      toast.error(TYPE_MESSAGES[type] || "Invalid file type.");
      e.target.value = "";
      return;
    }
    setUploadedFile(file);
    setQrName(qrName ? qrName : file.name);
    toast.success(`File "${file.name}" selected successfully!`);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    toast.info("File removed");
  };

  const handleQrNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQrName(value);
  };

  const canGenerate =
    qrName.trim() &&
    (type === "url"
      ? urlValue.trim()
      : type === "text"
      ? textValue.trim()
      : uploadedFile) &&
    (!passwordProtect || password.trim()) &&
    (!selfDestruct ||
      (destructViews && viewsValue.trim()) ||
      (destructTime && timeValue.trim()));

  const handleGenerateAndContinue = async () => {
    if (type === "url") {
      if (!urlValue || !/^https?:\/\//.test(urlValue)) {
        toast.error("Please enter a valid http:// or https:// link");
        return;
      }
      if (!qrName) {
        toast.error("Please enter a name for your QR code");
        return;
      }
      const formData = new FormData();
      formData.append("originalUrl", urlValue);
      formData.append("name", qrName);
      formData.append("type", "URL");
      if (passwordProtect && password.trim()) {
        formData.append("password", password);
      }
      if (selfDestruct && destructViews && viewsValue.trim()) {
        formData.append("viewLimit", viewsValue);
      }
      if (selfDestruct && destructTime && timeValue.trim()) {
        const expirationTime = new Date();
        const hours = parseInt(timeValue);
        if (!isNaN(hours)) {
          expirationTime.setTime(
            expirationTime.getTime() + hours * 60 * 60 * 1000
          );
          formData.append("expiresAt", expirationTime.toISOString());
        }
      }

      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/upload`,
          formData
        );
        const { data } = response.data;

        navigate("/customize", {
          state: {
            zapId: data.zapId,
            shortUrl: data.shortUrl,
            qrCode: data.qrCode,
            type: data.type.toUpperCase(),
            name: data.name,
          },
        });
      } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          `Upload failed: ${err.response?.data?.message || err.message}`
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === "text") {
      if (!textValue.trim()) {
        toast.error("Please enter some text content");
        return;
      }
      if (!qrName) {
        toast.error("Please enter a name for your QR code");
        return;
      }
      const formData = new FormData();
      formData.append("textContent", textValue);
      formData.append("name", qrName);
      formData.append("type", "TEXT");
      if (passwordProtect && password.trim()) {
        formData.append("password", password);
      }
      if (selfDestruct && destructViews && viewsValue.trim()) {
        formData.append("viewLimit", viewsValue);
      }
      if (selfDestruct && destructTime && timeValue.trim()) {
        const expirationTime = new Date();
        const hours = parseInt(timeValue);
        if (!isNaN(hours)) {
          expirationTime.setTime(
            expirationTime.getTime() + hours * 60 * 60 * 1000
          );
          formData.append("expiresAt", expirationTime.toISOString());
        }
      }

      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/zaps/upload`,
          formData
        );
        const { data } = response.data;

        navigate("/customize", {
          state: {
            zapId: data.zapId,
            shortUrl: data.shortUrl,
            qrCode: data.qrCode,
            type: data.type.toUpperCase(),
            name: data.name,
          },
        });
      } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          `Upload failed: ${err.response?.data?.message || err.message}`
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("name", qrName);
    formData.append("type", type.toUpperCase());
    if (passwordProtect && password.trim()) {
      formData.append("password", password);
    }
    if (selfDestruct && destructViews && viewsValue.trim()) {
      formData.append("viewLimit", viewsValue);
    }
    if (selfDestruct && destructTime && timeValue.trim()) {
      const expirationTime = new Date();
      const hours = parseInt(timeValue);
      if (!isNaN(hours)) {
        expirationTime.setTime(
          expirationTime.getTime() + hours * 60 * 60 * 1000
        );
        formData.append("expiresAt", expirationTime.toISOString());
      }
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/upload`,
        formData
      );
      const { data } = response.data;

      navigate("/customize", {
        state: {
          zapId: data.zapId,
          shortUrl: data.shortUrl,
          qrCode: data.qrCode,
          type: data.type.toUpperCase(),
          name: data.name,
        },
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        `Upload failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Upload Your Content
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-xl">
        <div className="bg-card rounded-xl shadow-lg p-8 space-y-8 border border-border">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">
              Step 2 of 3
            </span>
            <div className="flex-1 mx-4 h-0.5 bg-border">
              <div className="h-0.5 bg-blue-600 w-2/3" />
            </div>
            <span className="text-sm text-muted-foreground">Customize →</span>
          </div>

          {/* QR Code Name */}
          <div className="space-y-2">
            <Label className="text-base font-medium text-foreground">
              Name your QR Code
            </Label>
            <Input
              id="qr-name"
              placeholder="Enter a name for your QR code"
              value={qrName}
              onChange={handleQrNameChange}
              className="text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
            />
          </div>

          {/* File Upload */}
          {type === "url" ? (
            <div className="space-y-2">
              <Label htmlFor="url">Enter URL</Label>
              <Input
                id="url"
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                {TYPE_MESSAGES[type]}
              </p>
            </div>
          ) : type === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="text">Enter Text</Label>
              <textarea
                id="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter your text content here..."
                className="w-full min-h-[120px] p-3 text-base rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground resize-vertical"
                rows={5}
                maxLength={10000}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {TYPE_MESSAGES[type]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {textValue.length}/10,000 characters
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept={TYPE_EXTENSIONS[type].join(",")}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  {TYPE_MESSAGES[type]}
                </p>
              </div>

              {uploadedFile && (
                <div className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                      title="Remove file"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="password-protect"
                checked={passwordProtect}
                onCheckedChange={handlePasswordProtectChange}
                className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
              />
              <Label
                htmlFor="password-protect"
                className="text-sm font-medium text-foreground"
              >
                Password Protect
              </Label>
            </div>

            {passwordProtect && (
              <div className="pl-6">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="self-destruct"
                checked={selfDestruct}
                onCheckedChange={handleSelfDestructChange}
                className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
              />
              <Label
                htmlFor="self-destruct"
                className="text-sm font-medium text-foreground"
              >
                Self Destruct
              </Label>
            </div>

            {selfDestruct && (
              <div className="pl-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destruct-views"
                    checked={destructViews}
                    onCheckedChange={(checked) =>
                      setDestructViews(checked === true)
                    }
                    className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                  />
                  <Label
                    htmlFor="destruct-views"
                    className="text-sm font-medium text-foreground"
                  >
                    After Views
                  </Label>
                </div>

                {destructViews && (
                  <div className="pl-6">
                    <Input
                      type="number"
                      placeholder="Number of views"
                      value={viewsValue}
                      onChange={handleViewsValueChange}
                      className="text-sm rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="destruct-time"
                    checked={destructTime}
                    onCheckedChange={(checked) =>
                      setDestructTime(checked === true)
                    }
                    className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                  />
                  <Label
                    htmlFor="destruct-time"
                    className="text-sm font-medium text-foreground"
                  >
                    After Time
                  </Label>
                </div>

                {destructTime && (
                  <div className="pl-6">
                    <Input
                      type="number"
                      placeholder="Hours"
                      value={timeValue}
                      onChange={handleTimeValueChange}
                      className="text-sm rounded-md border border-border focus:border-blue-500 focus:ring focus:ring-blue-200 bg-background text-foreground"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateAndContinue}
            disabled={!canGenerate || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
