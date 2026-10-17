import React, { useState } from 'react';
import { Palette } from '../types';
import { generateShareableUrl } from '../utils/colorUtils';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  QrCode,
  Sparkles,
  Link2,
  MessageCircle,
  Send,
  Twitter,
  Mail,
  Code,
} from 'lucide-react';

interface ShareModalProps {
  palette: Palette;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ palette, isOpen, onClose }) => {
  if (!isOpen) return null;

  const [linkMode, setLinkMode] = useState<'compact' | 'full'>('compact');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedAppUrl, setCopiedAppUrl] = useState<boolean>(false);
  const [copiedHexes, setCopiedHexes] = useState<boolean>(false);
  const [copiedCSS, setCopiedCSS] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [activeQrUrl, setActiveQrUrl] = useState<string>('');

  const fullAppUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const shareUrl = generateShareableUrl(palette, linkMode);

  // Quick social sharing text
  const shareText = `تحقق من منصة Color AI Studio ولوحة الألوان المبتكرة "${palette.title}":`;
  const encodedShareText = encodeURIComponent(`${shareText}\n${shareUrl}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(fullAppUrl);
    setCopiedAppUrl(true);
    setTimeout(() => setCopiedAppUrl(false), 2000);
  };

  const handleCopyHexes = () => {
    const hexList = palette.colors.map((c) => c.hex).join(', ');
    navigator.clipboard.writeText(hexList);
    setCopiedHexes(true);
    setTimeout(() => setCopiedHexes(false), 2000);
  };

  const handleCopyCSSVars = () => {
    const cssVars = palette.colors
      .map((c, idx) => `  --color-${c.role.toLowerCase() || idx + 1}: ${c.hex};`)
      .join('\n');
    const cssBlock = `:root {\n${cssVars}\n}`;
    navigator.clipboard.writeText(cssBlock);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  // QR code image URL generator via QuickChart API
  const qrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(shareUrl)}&size=220&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in dir-rtl" dir="rtl">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                مشاركة لوحة الألوان برابط مختصر
              </h2>
              <p className="text-xs text-slate-400">
                شارك مشروع "{palette.title}" مع المصممين والعملاء برابط ذكي ومباشر
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Full Application & Project Share Link */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5 space-x-reverse">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              <span>الرابط الكامل للمشروع والتطبيق (Full Project Link):</span>
            </label>
            <span className="text-[10px] text-slate-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              عام ومباشر للجميع
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={fullAppUrl}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 pl-9 text-xs font-mono text-indigo-200 focus:outline-none focus:border-indigo-500 dir-ltr select-all"
              />
              <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            </div>

            <button
              onClick={handleCopyAppUrl}
              className={`flex items-center space-x-1.5 space-x-reverse px-4 py-2.5 rounded-xl font-bold text-xs transition active:scale-95 shrink-0 ${
                copiedAppUrl
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {copiedAppUrl ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم نسخ رابط المشروع!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ رابط المشروع</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Palette Colors Preview Swatches */}
        <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">معاينة ألوان اللوحة ({palette.colors.length}):</span>
            <span className="font-mono text-[11px] text-amber-400">{palette.title}</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {palette.colors.map((col, idx) => (
              <div key={idx} className="space-y-1 text-center">
                <div
                  className="h-10 rounded-xl border border-white/10 shadow-xs flex items-end justify-center p-1"
                  style={{ backgroundColor: col.hex }}
                >
                  <span className="text-[9px] font-mono font-bold bg-black/60 text-white px-1 rounded backdrop-blur-xs">
                    {col.hex}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">{col.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Short Link Output Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 space-x-reverse">
              <Link2 className="w-4 h-4" />
              <span>الرابط المختصر للمشاركة (Short URL):</span>
            </label>

            {/* Link Mode Switcher */}
            <div className="flex items-center space-x-1 space-x-reverse bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setLinkMode('compact')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  linkMode === 'compact'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                مختصر جداً (?c=HEX)
              </button>
              <button
                onClick={() => setLinkMode('full')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  linkMode === 'full'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                مشفر كلياً Base64
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3.5 pl-10 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 dir-ltr select-all"
              />
              <Link2 className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
            </div>

            <button
              onClick={handleCopyLink}
              className={`flex items-center space-x-1.5 space-x-reverse px-5 py-3 rounded-xl font-bold text-xs transition active:scale-95 shrink-0 ${
                copiedLink
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم نسخ الرابط!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Direct Social Media Sharing Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">مشاركة سريعة عبر المنصات:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodedShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 space-x-reverse p-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 space-x-reverse p-2.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition"
            >
              <Send className="w-4 h-4" />
              <span>تليجرام</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 space-x-reverse p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
            >
              <Twitter className="w-4 h-4" />
              <span>منصة X</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(`لوحة ألوان: ${palette.title}`)}&body=${encodedShareText}`}
              className="flex items-center justify-center space-x-2 space-x-reverse p-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition"
            >
              <Mail className="w-4 h-4" />
              <span>البريد</span>
            </a>
          </div>
        </div>

        {/* QR Code & Code Copy Options */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{showQR ? 'إخفاء QR Code' : 'إظهار رمز QR Code'}</span>
            </button>

            <button
              onClick={handleCopyHexes}
              className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition"
            >
              {copiedHexes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{copiedHexes ? 'تم نسخ الأكواد!' : 'نسخ أكواد HEX'}</span>
            </button>

            <button
              onClick={handleCopyCSSVars}
              className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition"
            >
              {copiedCSS ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5 text-purple-400" />}
              <span>{copiedCSS ? 'تم نسخ CSS!' : 'نسخ متغيرات CSS'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
          >
            إغلاق
          </button>
        </div>

        {/* QR Code Canvas Popup Display */}
        {showQR && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <span className="text-xs font-bold text-slate-300">امسح رمز QR بملتقط كاميرا الجوال لفتح الرابط مباشرة:</span>
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <img src={qrImageUrl} alt="QR Code Share" className="w-40 h-40 object-contain" />
            </div>
            <span className="text-[11px] text-slate-500 font-mono dir-ltr truncate max-w-xs">{shareUrl}</span>
          </div>
        )}
      </div>
    </div>
  );
};
