'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  fullName: string;
  username: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  url,
  fullName,
  username
}: QRCodeModalProps) {
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    // Generate PNG from canvas
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (!ctx) return;
      
      // Draw background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR Code centered with padding
      ctx.drawImage(img, 100, 100, 800, 800);
      
      // Trigger download
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `SignBridge-QR-${username}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName}'s SignBridge Profile`,
          text: `Connect with ${fullName} on SignBridge ID`,
          url: url,
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <span className="px-2.5 py-1 rounded-full bg-[#087CF0]/10 text-[#087CF0] text-xs font-semibold uppercase tracking-wider">
            SignBridge QR Code
          </span>
          <h3 className="text-lg font-bold mt-2 text-slate-900">
            {fullName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Scan to view digital identity profile
          </p>
        </div>

        {/* QR Code Container */}
        <div 
          ref={qrRef}
          className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner my-4"
        >
          <QRCodeSVG 
            value={url}
            size={220}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23087CF0'><circle cx='12' cy='12' r='10'/></svg>",
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true,
            }}
          />
          <p className="text-[11px] font-mono text-slate-400 mt-3 break-all text-center">
            {url}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={handleDownloadPNG}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#087CF0] text-white text-xs font-medium hover:bg-[#0668cc] transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Profile
          </button>
        </div>

        <button 
          onClick={handleCopy}
          className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied to Clipboard!' : 'Copy Direct Link'}
        </button>
      </div>
    </div>
  );
}
