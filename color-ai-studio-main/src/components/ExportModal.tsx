import React, { useState } from 'react';
import { Palette } from '../types';
import { X, Copy, Check, Download, Code, FileCode, Palette as PaletteIcon, FileCheck } from 'lucide-react';

interface ExportModalProps {
  palette: Palette;
  onClose: () => void;
}

export type ExportFormat = 'css' | 'tailwind' | 'ase' | 'json' | 'svg' | 'project_guide';

export const ExportModal: React.FC<ExportModalProps> = ({ palette, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // CSS Variables File Content
  const getCssCode = () => {
    return `/* CSS Custom Properties for ${palette.title} */\n:root {\n` +
      palette.colors.map((c) => `  --color-${c.role.toLowerCase()}: ${c.hex}; /* ${c.name} */`).join('\n') +
      `\n}`;
  };

  // Tailwind Config File Content
  const getTailwindCode = () => {
    const config = palette.colors.reduce((acc, c) => {
      acc[c.role.toLowerCase()] = c.hex;
      return acc;
    }, {} as Record<string, string>);
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(config, null, 8)}\n    }\n  }\n};`;
  };

  // JSON Palette Export
  const getJsonCode = () => {
    return JSON.stringify(palette, null, 2);
  };

  // SVG Swatch Board Export
  const getSvgCode = () => {
    const swatchWidth = 120;
    const swatchHeight = 160;
    const width = palette.colors.length * swatchWidth;
    const rects = palette.colors
      .map(
        (c, i) =>
          `  <g transform="translate(${i * swatchWidth}, 0)">\n` +
          `    <rect width="${swatchWidth}" height="${swatchHeight}" fill="${c.hex}" />\n` +
          `    <rect y="110" width="${swatchWidth}" height="50" fill="rgba(0,0,0,0.6)" />\n` +
          `    <text x="10" y="130" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif">${c.role}</text>\n` +
          `    <text x="10" y="146" fill="#cbd5e1" font-size="11" font-family="monospace">${c.hex}</text>\n` +
          `  </g>`
      )
      .join('\n');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${swatchHeight}" viewBox="0 0 ${width} ${swatchHeight}">\n${rects}\n</svg>`;
  };

  // ASE (Adobe Swatch Exchange) Binary Buffer Generator
  const getAseArrayBuffer = (): ArrayBuffer => {
    const bytes: number[] = [];

    const pushUInt16BE = (val: number) => {
      bytes.push((val >> 8) & 0xff, val & 0xff);
    };

    const pushUInt32BE = (val: number) => {
      bytes.push((val >> 24) & 0xff, (val >> 16) & 0xff, (val >> 8) & 0xff, val & 0xff);
    };

    const pushFloat32BE = (val: number) => {
      const buf = new ArrayBuffer(4);
      const view = new DataView(buf);
      view.setFloat32(0, val, false);
      const u8 = new Uint8Array(buf);
      bytes.push(u8[0], u8[1], u8[2], u8[3]);
    };

    const stringToUtf16BE = (str: string): number[] => {
      const result: number[] = [];
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        result.push((code >> 8) & 0xff, code & 0xff);
      }
      result.push(0x00, 0x00); // null termination
      return result;
    };

    const hexToRgbFloats = (hex: string): [number, number, number] => {
      let clean = hex.replace('#', '');
      if (clean.length === 3) {
        clean = clean.split('').map((c) => c + c).join('');
      }
      const num = parseInt(clean, 16) || 0;
      return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
    };

    // Header: 'ASEF' + Version 1.0
    bytes.push(0x41, 0x53, 0x45, 0x46);
    bytes.push(0x00, 0x01, 0x00, 0x00);

    const paletteName = palette.title || 'Palette';
    const numBlocks = 1 + palette.colors.length + 1;
    pushUInt32BE(numBlocks);

    // Group Start Block (0xC001)
    pushUInt16BE(0xc001);
    const groupNameUtf16 = stringToUtf16BE(paletteName);
    pushUInt32BE(2 + groupNameUtf16.length);
    pushUInt16BE(paletteName.length + 1);
    bytes.push(...groupNameUtf16);

    // Color Entry Blocks (0x0001)
    for (const c of palette.colors) {
      const colorName = `${c.role} - ${c.name} (${c.hex})`;
      const nameUtf16 = stringToUtf16BE(colorName);

      pushUInt16BE(0x0001);
      const colorPayloadLen = 20 + nameUtf16.length; // nameLen(2) + name + model(4) + RGB(12) + type(2)
      pushUInt32BE(colorPayloadLen);

      pushUInt16BE(colorName.length + 1);
      bytes.push(...nameUtf16);

      // Model 'RGB '
      bytes.push(0x52, 0x47, 0x42, 0x20);

      const [r, g, b] = hexToRgbFloats(c.hex);
      pushFloat32BE(r);
      pushFloat32BE(g);
      pushFloat32BE(b);

      // Global Color Type
      pushUInt16BE(0x0000);
    }

    // Group End Block (0xC002)
    pushUInt16BE(0xc002);
    pushUInt32BE(0);

    return new Uint8Array(bytes).buffer;
  };

  const getCode = () => {
    switch (activeFormat) {
      case 'css':
        return getCssCode();
      case 'tailwind':
        return getTailwindCode();
      case 'json':
        return getJsonCode();
      case 'svg':
        return getSvgCode();
      case 'project_guide':
        return `# 📦 تعليمات تصدير مشروع Color AI Studio كاملاً

يمكنك تصدير كود المصدر الكامل للمشروع ومشاركته أو رفعه على GitHub و Vercel بالخطوات التالية:

1️⃣ التصدير المباشر من واجهة AI Studio:
- اضغط على قائمة الإعدادات (⚙️ Settings) في أعلى شاشة AI Studio.
- اختر "Export to GitHub" للرفع التلقائي لحسابك، أو اختر "Download ZIP" لتنزيل كافة ملفات المشروع كملف مضغوط.

2️⃣ تشغيل المشروع محلياً (Local Development):
npm install
npm run dev

3️⃣ النشر السريع على Vercel:
- قم برفع الكود إلى GitHub.
- افتح Vercel -> Import Repository.
- أضف المتغير البيئي: GEMINI_API_KEY = (مفتاح API الخاص بك)
- اضغط Deploy وسيتم نشر موقعك المستقل خلال ثوانٍ!`;
      case 'ase':
        return `/* Adobe Swatch Exchange (.ase) Binary Swatch */\n/* Includes ${palette.colors.length} color swatches for Photoshop, Illustrator, and Figma */\n\n` +
          palette.colors.map((c) => `Swatch: ${c.role} (${c.name}) -> ${c.hex}`).join('\n');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (activeFormat === 'project_guide') {
      const link = document.createElement('a');
      link.href = '/download-zip';
      link.download = 'color-studio-project.zip';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2200);
      return;
    }

    const safeName = (palette.title || 'palette').toLowerCase().replace(/[^a-z0-9]/g, '-');
    let blob: Blob;
    let filename = '';

    if (activeFormat === 'ase') {
      const buffer = getAseArrayBuffer();
      blob = new Blob([buffer], { type: 'application/octet-stream' });
      filename = `${safeName}.ase`;
    } else if (activeFormat === 'css') {
      blob = new Blob([getCssCode()], { type: 'text/css;charset=utf-8' });
      filename = `${safeName}.css`;
    } else if (activeFormat === 'tailwind') {
      blob = new Blob([getTailwindCode()], { type: 'text/javascript;charset=utf-8' });
      filename = `tailwind.config.js`;
    } else if (activeFormat === 'json') {
      blob = new Blob([getJsonCode()], { type: 'application/json;charset=utf-8' });
      filename = `${safeName}.json`;
    } else {
      blob = new Blob([getSvgCode()], { type: 'image/svg+xml;charset=utf-8' });
      filename = `${safeName}.svg`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <Code className="w-5 h-5 text-indigo-400" />
            <span>Export Palette: {palette.title}</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'css', label: 'CSS Variables (.css)', icon: FileCode },
            { id: 'tailwind', label: 'Tailwind Config (.js)', icon: Code },
            { id: 'ase', label: 'Adobe Swatch (.ase)', icon: PaletteIcon },
            { id: 'json', label: 'JSON (.json)', icon: FileCode },
            { id: 'svg', label: 'SVG Swatches (.svg)', icon: FileCode },
            { id: 'project_guide', label: 'تصدير المشروع كاملاً (GitHub/Vercel)', icon: Download },
          ].map((fmt) => {
            const Icon = fmt.icon;
            return (
              <button
                key={fmt.id}
                onClick={() => setActiveFormat(fmt.id as ExportFormat)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFormat === fmt.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{fmt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code View or Project ZIP Banner */}
        {activeFormat === 'project_guide' && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
                <Download className="w-5 h-5 text-indigo-400 animate-bounce" />
                <span>تحميل ملف المشروع المضغوط (ZIP) المباشر</span>
              </div>
              <a
                href="/download-zip"
                download="color-studio-project.zip"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-lg text-xs shadow-lg transition active:scale-95 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>تحميل color-studio-project.zip الآن</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              إذا كانت سياسة المتصفح تمنع التنزيل المباشر من داخل الشاشة المدمجة، يمكنك فتح رابط التحميل مباشرة في نافذة جديدة:
              <br />
              <a href="/download-zip" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-mono text-[10px]">
                /download-zip
              </a>
            </p>
          </div>
        )}

        <pre className="bg-slate-950 border border-slate-800 text-indigo-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-64 whitespace-pre-wrap select-all">
          {getCode()}
        </pre>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-400">
            {activeFormat === 'ase'
              ? 'Downloads binary .ase swatch for Photoshop, Illustrator & Figma'
              : `Ready to copy or save as .${activeFormat}`}
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg transition active:scale-95"
            >
              {downloaded ? <FileCheck className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'Downloaded File!' : 'Download File'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

