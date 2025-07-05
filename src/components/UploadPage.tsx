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
  image: "Supports: .jpg, .jpeg, .png, .webp • Max 10MB",
  pdf: "Supports: .pdf only • Max 10MB",
  document: "Supports: .doc, .docx, .txt, .rtf • Max 10MB",
  spreadsheet: "Supports: .xls, .xlsx, .csv • Max 10MB",
  presentation: "Supports: .ppt, .pptx • Max 10MB",
  archive: "Supports: .zip, .rar, .7z, .tar, .gz • Max 10MB",
  audio: "Supports: .mp3, .wav, .ogg, .m4a • Max 10MB",
  video: "Supports: .mp4, .avi, .mov, .wmv, .flv • Max 100MB",
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
  // ... rest of the component code ...

  return (
    <div className="min-h-screen bg-background page-enter">
      {/* ... rest of the JSX ... */}
    </div>
  );
}
