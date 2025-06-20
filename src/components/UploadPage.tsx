import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, X, Shield, Clock, Eye, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-background page-enter">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Upload Your Content
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8 sm:space-y-10 border border-border/30 animate-fade-in-up">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <span className="text-xs sm:text-sm text-primary font-semibold bg-primary/10 px-3 py-1 sm:px-4 sm:py-2 rounded-full">
              Step 2 of 3
            </span>
            <div className="flex-1 mx-4 sm:mx-6 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="progress-bar h-full w-2/3"></div>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
              Customize
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            </span>
          </div>

          {/* QR Code Name */}
          <div className="space-y-3 sm:space-y-4 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <Label className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></span>
              Name your QR Code
            </Label>
            <Input
              id="qr-name"
              placeholder="Enter a memorable name..."
              value={qrName}
              onChange={handleQrNameChange}
              className="input-focus text-base rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-12 sm:h-14 px-4 sm:px-6 font-medium sm:text-lg"
            />
          </div>

          {/* File Upload */}
          {type === "url" ? (
            <div className="space-y-3 sm:space-y-4 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <Label htmlFor="url" className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></span>
                Enter URL
              </Label>
              <Input
                id="url"
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com"
                className="input-focus text-base rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-12 sm:h-14 px-4 sm:px-6 sm:text-lg"
              />
              <p className="text-sm text-muted-foreground pl-4 sm:pl-6">
                {TYPE_MESSAGES[type]}
              </p>
            </div>
          ) : type === "text" ? (
            <div className="space-y-3 sm:space-y-4 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <Label htmlFor="text" className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></span>
                Enter Text
              </Label>
              <textarea
                id="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter your text content here..."
                className="w-full min-h-[120px] sm:min-h-[140px] p-4 sm:p-6 text-base rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-foreground resize-vertical transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                rows={6}
                maxLength={10000}
              />
              <div className="flex justify-between items-center px-2">
                <p className="text-sm text-muted-foreground">
                  {TYPE_MESSAGES[type]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {textValue.length}/10,000 characters
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="file" className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></span>
                  Upload File
                </Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept={TYPE_EXTENSIONS[type].join(",")}
                    className="cursor-pointer h-12 sm:h-14 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm file:mr-4 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all duration-200"
                  />
                </div>
                <p className="text-sm text-muted-foreground pl-4 sm:pl-6">
                  {TYPE_MESSAGES[type]}
                </p>
              </div>

              {uploadedFile && (
                <div className="p-4 sm:p-6 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm animate-scale-in">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-xl">
                      <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-base sm:text-lg">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 sm:p-3 hover:bg-destructive/10 rounded-xl transition-colors duration-200 group"
                      title="Remove file"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-destructive" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Options */}
          <div className="space-y-6 sm:space-y-8 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2 sm:gap-3">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Security Options
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-xl bg-card/30 border border-border/30 hover:border-primary/30 transition-all duration-200">
                <Checkbox
                  id="password-protect"
                  checked={passwordProtect}
                  onCheckedChange={handlePasswordProtectChange}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary w-4 h-4 sm:w-5 sm:h-5"
                />
                <Label
                  htmlFor="password-protect"
                  className="text-sm sm:text-base font-medium text-foreground cursor-pointer flex items-center gap-2 sm:gap-3"
                >
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Password Protection
                </Label>
              </div>

              {passwordProtect && (
                <div className="pl-6 sm:pl-10 animate-scale-in">
                  <Input
                    type="password"
                    placeholder="Enter a secure password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-focus rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-12"
                  />
                </div>
              )}

              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 rounded-xl bg-card/30 border border-border/30 hover:border-primary/30 transition-all duration-200">
                <Checkbox
                  id="self-destruct"
                  checked={selfDestruct}
                  onCheckedChange={handleSelfDestructChange}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary w-4 h-4 sm:w-5 sm:h-5"
                />
                <Label
                  htmlFor="self-destruct"
                  className="text-sm sm:text-base font-medium text-foreground cursor-pointer flex items-center gap-2 sm:gap-3"
                >
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  Self Destruct
                </Label>
              </div>

              {selfDestruct && (
                <div className="pl-6 sm:pl-10 space-y-4 sm:space-y-6 animate-scale-in">
                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-card/20 border border-border/20">
                    <Checkbox
                      id="destruct-views"
                      checked={destructViews}
                      onCheckedChange={(checked) =>
                        setDestructViews(checked === true)
                      }
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <Label
                      htmlFor="destruct-views"
                      className="text-sm sm:text-base font-medium text-foreground cursor-pointer flex items-center gap-2 sm:gap-3"
                    >
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                      After Views
                    </Label>
                  </div>

                  {destructViews && (
                    <div className="pl-6 sm:pl-8 animate-scale-in">
                      <Input
                        type="number"
                        placeholder="Number of views"
                        value={viewsValue}
                        onChange={handleViewsValueChange}
                        className="input-focus rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-12"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-card/20 border border-border/20">
                    <Checkbox
                      id="destruct-time"
                      checked={destructTime}
                      onCheckedChange={(checked) =>
                        setDestructTime(checked === true)
                      }
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <Label
                      htmlFor="destruct-time"
                      className="text-sm sm:text-base font-medium text-foreground cursor-pointer flex items-center gap-2 sm:gap-3"
                    >
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                      After Time
                    </Label>
                  </div>

                  {destructTime && (
                    <div className="pl-6 sm:pl-8 animate-scale-in">
                      <Input
                        type="number"
                        placeholder="Hours until expiration"
                        value={timeValue}
                        onChange={handleTimeValueChange}
                        className="input-focus rounded-xl border-border/50 bg-background/50 backdrop-blur-sm h-12"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-6 sm:pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={handleGenerateAndContinue}
              disabled={!canGenerate || loading}
              className="w-full h-14 sm:h-16 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-lg sm:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                  Generating QR Code...
                </>
              ) : (
                <>
                  <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}