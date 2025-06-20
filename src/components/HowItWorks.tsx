import { Link } from "react-router-dom";
import { ArrowLeft, Upload, QrCode, Download, Zap, Shield, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background page-enter">
      <header className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl p-12 space-y-16 border border-border/30 animate-fade-in-up">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold">How ZapLink Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Create QR Codes in Three Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              ZapLink makes it incredibly easy to create secure, customizable QR codes for any type of content. 
              Follow these simple steps to transform your files into shareable QR codes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-6 bg-card/30 p-8 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in-up card-hover" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  1. Upload Your Content
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from 8 different content types including PDFs, images, videos, URLs, and text. 
                  Simply drag and drop your file or paste your content. We support all major file formats 
                  with secure cloud storage.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm font-medium">PDF</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">Images</span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm font-medium">Videos</span>
                <span className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full text-sm font-medium">URLs</span>
              </div>
            </div>

            <div className="space-y-6 bg-card/30 p-8 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in-up card-hover" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  2. Secure & Configure
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Add password protection and set up self-destruct options. Choose to expire your QR code 
                  after a certain number of views or time period. Your content stays secure with 
                  enterprise-grade encryption.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm font-medium">Password</span>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-medium">Self-Destruct</span>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-sm font-medium">View Limits</span>
              </div>
            </div>

            <div className="space-y-6 bg-card/30 p-8 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in-up card-hover" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  3. Customize & Share
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Design your QR code with custom frames, add your logo, and choose from various styles. 
                  Download in high resolution or share directly. Your QR code is ready to use anywhere, 
                  from business cards to presentations.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-pink-500/10 text-pink-600 rounded-full text-sm font-medium">Custom Frames</span>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-sm font-medium">Logo Upload</span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-medium">HD Download</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border/30">
            <div className="space-y-4 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <QrCode className="h-6 w-6 text-primary" />
                Why Choose ZapLink?
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">Lightning Fast:</strong> Generate QR codes in seconds with our optimized processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">Bank-Level Security:</strong> End-to-end encryption keeps your files safe</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">Universal Compatibility:</strong> Works on all devices and QR code scanners</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">No Registration Required:</strong> Start creating QR codes immediately</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4 animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Download className="h-6 w-6 text-primary" />
                Perfect For
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">Business:</strong> Share presentations, portfolios, and documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">Education:</strong> Distribute course materials and assignments</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">Events:</strong> Share schedules, maps, and contact information</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-foreground">Personal:</strong> Share photos, videos, and personal content</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-border/30">
            <div className="text-center space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-3xl font-bold text-foreground">
                Ready to Create Your First QR Code?
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who trust ZapLink for their QR code needs. 
                Get started now and experience the magic of instant file sharing.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link to="/">
                  <Zap className="mr-2 h-5 w-5" />
                  Create QR Code Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}