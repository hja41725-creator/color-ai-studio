import React, { useState, useEffect } from 'react';
import { Palette, UIPreviewMode, UIScreenshot } from '../types';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Maximize2,
  Download,
  Copy,
  Check,
  X,
  LayoutDashboard,
  Smartphone,
  Globe,
  ShoppingBag,
  CreditCard,
  User,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Eye,
  Layers,
  Sparkle
} from 'lucide-react';

interface LiveUIPreviewProps {
  palette: Palette;
}

export const LiveUIPreview: React.FC<LiveUIPreviewProps> = ({ palette }) => {
  const [activeTab, setActiveTab] = useState<'screenshots' | 'interactive' | 'typography'>('screenshots');
  const [selectedFontPair, setSelectedFontPair] = useState<'modern' | 'serif' | 'arabic' | 'mono'>('modern');
  const [interactiveMode, setInteractiveMode] = useState<UIPreviewMode>('dashboard');
  const [screenshots, setScreenshots] = useState<UIScreenshot[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedScreenshot, setExpandedScreenshot] = useState<UIScreenshot | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Get colors by role with safe fallbacks
  const getRoleColor = (roleName: string, fallbackIndex: number) => {
    const found = palette.colors.find((c) => c.role.toLowerCase() === roleName.toLowerCase());
    return found ? found.hex : palette.colors[fallbackIndex % palette.colors.length]?.hex || '#1E293B';
  };

  const primary = getRoleColor('Primary', 0);
  const secondary = getRoleColor('Secondary', 1);
  const accent = getRoleColor('Accent', 2);
  const mono = getRoleColor('Monochromatic', 3);
  const bg = getRoleColor('Background', 1);
  const surface = getRoleColor('Surface', 0);
  const text = getRoleColor('Text', 0);

  // Client-side instant vector screenshot generator for zero-delay previews
  const createVectorSVG = (type: 'mobile' | 'dashboard' | 'landing') => {
    const name = palette.projectName || palette.title || 'Studio App';

    if (type === 'mobile') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="100%" height="100%">
        <defs>
          <linearGradient id="mobGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}" />
            <stop offset="100%" stop-color="${mono}" />
          </linearGradient>
        </defs>
        <rect width="360" height="640" fill="${secondary}" rx="28" />
        <rect x="18" y="24" width="324" height="592" fill="#090D16" rx="20" />
        <rect x="130" y="36" width="100" height="12" fill="#1E293B" rx="6" />
        <rect x="35" y="75" width="160" height="14" fill="#F8FAFC" rx="4" />
        <rect x="35" y="98" width="100" height="8" fill="#64748B" rx="3" />
        <circle cx="305" cy="88" r="18" fill="${primary}" />
        <rect x="35" y="125" width="290" height="160" fill="url(#mobGrad)" rx="18" />
        <text x="55" y="155" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1">DAILY STREAK</text>
        <text x="55" y="195" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="30" font-weight="800">28 Days 🔥</text>
        <rect x="55" y="225" width="250" height="8" fill="rgba(255,255,255,0.25)" rx="4" />
        <rect x="55" y="225" width="200" height="8" fill="${accent}" rx="4" />
        <rect x="35" y="305" width="135" height="125" fill="#1E293B" rx="14" stroke="${mono}" stroke-width="1.5" />
        <rect x="50" y="325" width="34" height="34" fill="${accent}" rx="10" />
        <rect x="50" y="370" width="85" height="10" fill="#F8FAFC" rx="3" />
        <rect x="50" y="390" width="60" height="8" fill="#64748B" rx="3" />
        <rect x="190" y="305" width="135" height="125" fill="#1E293B" rx="14" stroke="${primary}" stroke-width="1.5" />
        <rect x="205" y="325" width="34" height="34" fill="${primary}" rx="10" />
        <rect x="205" y="370" width="85" height="10" fill="#F8FAFC" rx="3" />
        <rect x="205" y="390" width="60" height="8" fill="#64748B" rx="3" />
        <rect x="35" y="450" width="290" height="52" fill="${accent}" rx="14" />
        <text x="180" y="482" fill="#000000" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle">START DAILY SESSION</text>
        <rect x="35" y="520" width="290" height="75" fill="#131B2E" rx="14" />
        <rect x="50" y="538" width="40" height="40" fill="${mono}" rx="10" />
        <rect x="105" y="545" width="130" height="10" fill="#F8FAFC" rx="3" />
        <rect x="105" y="565" width="80" height="8" fill="#64748B" rx="3" />
      </svg>`;
    }

    if (type === 'dashboard') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" height="100%">
        <rect width="960" height="540" fill="${secondary}" />
        <rect x="0" y="0" width="210" height="540" fill="#070A12" />
        <rect x="20" y="25" width="34" height="34" fill="${primary}" rx="10" />
        <text x="66" y="48" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="800">${name}</text>
        <rect x="20" y="85" width="170" height="38" fill="${primary}" rx="10" />
        <text x="55" y="109" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Dashboard</text>
        <text x="55" y="155" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Analytics Console</text>
        <text x="55" y="195" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">User Campaigns</text>
        <rect x="210" y="0" width="750" height="64" fill="#131B2E" />
        <text x="240" y="38" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="800">SaaS Growth &amp; Performance Console</text>
        <rect x="790" y="16" width="140" height="34" fill="${accent}" rx="10" />
        <text x="860" y="38" fill="#000000" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">+ Export Data</text>
        <rect x="240" y="85" width="220" height="110" fill="#131B2E" rx="14" stroke="${mono}" stroke-width="1.5" />
        <text x="260" y="112" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" font-weight="600">TOTAL REVENUE</text>
        <text x="260" y="150" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="26" font-weight="800">$148,920</text>
        <text x="260" y="178" fill="${accent}" font-family="system-ui, sans-serif" font-size="11" font-weight="700">↑ +24.8% vs last month</text>
        <rect x="480" y="85" width="220" height="110" fill="#131B2E" rx="14" stroke="${primary}" stroke-width="1.5" />
        <text x="500" y="112" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" font-weight="600">ACTIVE USERS</text>
        <text x="500" y="150" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="26" font-weight="800">28,450</text>
        <text x="500" y="178" fill="${mono}" font-family="system-ui, sans-serif" font-size="11" font-weight="700">↑ +18.2% conversion</text>
        <rect x="720" y="85" width="210" height="110" fill="#131B2E" rx="14" />
        <text x="740" y="112" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" font-weight="600">CONVERSION RATE</text>
        <text x="740" y="150" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="26" font-weight="800">5.84%</text>
        <text x="740" y="178" fill="${accent}" font-family="system-ui, sans-serif" font-size="11" font-weight="700">★ Top Performer</text>
        <rect x="240" y="215" width="690" height="295" fill="#131B2E" rx="16" />
        <text x="270" y="250" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="14" font-weight="700">Revenue &amp; Engagement Trend</text>
        <path d="M 270 450 Q 390 350, 510 390 T 750 290 T 900 310" fill="none" stroke="${primary}" stroke-width="4" />
        <path d="M 270 450 Q 390 350, 510 390 T 750 290 T 900 310 L 900 470 L 270 470 Z" fill="${primary}" opacity="0.2" />
        <circle cx="750" cy="290" r="7" fill="${accent}" />
      </svg>`;
    }

    // landing page
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" height="100%">
      <defs>
        <linearGradient id="landBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${secondary}" />
          <stop offset="100%" stop-color="#05080E" />
        </linearGradient>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="960" height="540" fill="url(#landBg)" />
      <rect x="60" y="32" width="38" height="38" fill="${primary}" rx="10" />
      <text x="110" y="58" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="800">${name}</text>
      <text x="600" y="56" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13">Features</text>
      <text x="680" y="56" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13">Solutions</text>
      <text x="760" y="56" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13">Pricing</text>
      <rect x="830" y="34" width="90" height="38" fill="${primary}" rx="10" />
      <text x="875" y="58" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Get Started</text>
      <rect x="60" y="125" width="200" height="28" fill="#131B2E" rx="14" stroke="${mono}" stroke-width="1.5" />
      <text x="160" y="143" fill="${mono}" font-family="system-ui, sans-serif" font-size="10" font-weight="700" text-anchor="middle">✨ POWERED BY AI STUDIO 3.0</text>
      <text x="60" y="200" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="36" font-weight="800">Build Modern Products</text>
      <text x="60" y="248" fill="url(#brandGrad)" font-family="system-ui, sans-serif" font-size="36" font-weight="800">With Perfect AI Palette</text>
      <text x="60" y="290" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14">Automate your brand palette design, contrast compliance, and live UI previewing.</text>
      <rect x="60" y="330" width="165" height="50" fill="${primary}" rx="14" />
      <text x="142" y="360" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle">Start Free Trial →</text>
      <rect x="240" y="330" width="145" height="50" fill="#131B2E" rx="14" stroke="#334155" stroke-width="1" />
      <text x="312" y="360" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Watch Demo</text>
      <rect x="520" y="115" width="380" height="380" fill="#131B2E" rx="22" stroke="${mono}" stroke-width="2" />
      <rect x="540" y="135" width="340" height="40" fill="#090D16" rx="10" />
      <circle cx="560" cy="155" r="5" fill="${accent}" />
      <circle cx="575" cy="155" r="5" fill="${primary}" />
      <circle cx="590" cy="155" r="5" fill="${mono}" />
      <rect x="540" y="190" width="340" height="150" fill="${primary}" rx="14" opacity="0.9" />
      <text x="560" y="225" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="800">${name} Platform</text>
      <rect x="560" y="250" width="180" height="38" fill="${accent}" rx="10" />
      <text x="650" y="274" fill="#000000" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">Deploy Solution</text>
      <rect x="540" y="355" width="160" height="120" fill="#090D16" rx="12" />
      <rect x="555" y="370" width="32" height="32" fill="${accent}" rx="8" />
      <rect x="710" y="355" width="170" height="120" fill="#090D16" rx="12" />
      <rect x="725" y="370" width="32" height="32" fill="${mono}" rx="8" />
    </svg>`;
  };

  // Generate initial vector screenshots on mount or palette update
  useEffect(() => {
    const buildLocalScreenshots = (): UIScreenshot[] => {
      const pName = palette.projectName || palette.title || 'App';
      return [
        {
          id: `mobile-local-${palette.id}`,
          title: `${pName} - Mobile App UI`,
          type: 'mobile',
          aspectRatio: '9:16',
          imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(createVectorSVG('mobile'))}`,
          prompt: `Mobile app UI mockup for ${pName} featuring primary brand accent ${primary} and dark theme container ${secondary}.`,
          description: `iOS mobile layout with streak counter, action buttons, and dark user cards.`,
          appliedColors: [
            { role: 'Primary', hex: primary, name: 'Primary Accent' },
            { role: 'Secondary', hex: secondary, name: 'Dark Container' },
            { role: 'Accent', hex: accent, name: 'CTA Highlight' },
            { role: 'Monochromatic', hex: mono, name: 'Tint Overlay' }
          ]
        },
        {
          id: `dashboard-local-${palette.id}`,
          title: `${pName} - SaaS Analytics Dashboard`,
          type: 'dashboard',
          aspectRatio: '16:9',
          imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(createVectorSVG('dashboard'))}`,
          prompt: `SaaS web application analytics console UI screenshot for ${pName} styled with ${primary}, ${secondary}, and ${accent}.`,
          description: `Full-screen web console with revenue growth charts, metric cards, and sidebar navigation.`,
          appliedColors: [
            { role: 'Primary', hex: primary, name: 'Primary Accent' },
            { role: 'Secondary', hex: secondary, name: 'Dark Container' },
            { role: 'Accent', hex: accent, name: 'Growth Metric' },
            { role: 'Monochromatic', hex: mono, name: 'Card Border' }
          ]
        },
        {
          id: `landing-local-${palette.id}`,
          title: `${pName} - Hero Landing Page`,
          type: 'landing',
          aspectRatio: '16:9',
          imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(createVectorSVG('landing'))}`,
          prompt: `Landing page hero section UI screenshot for ${pName} featuring hero headline, CTA buttons in ${primary}, and brand frame.`,
          description: `High-conversion hero landing page with headline, free trial button, and product preview.`,
          appliedColors: [
            { role: 'Primary', hex: primary, name: 'Primary Accent' },
            { role: 'Secondary', hex: secondary, name: 'Background' },
            { role: 'Accent', hex: accent, name: 'Conversion Highlight' },
            { role: 'Monochromatic', hex: mono, name: 'Subtle Badge' }
          ]
        }
      ];
    };

    setScreenshots(buildLocalScreenshots());
  }, [palette]);

  // Handle AI Image Generation API request
  const handleGenerateAIScreenshots = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ui-screenshots/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ palette, screenshotTypes: ['mobile', 'dashboard', 'landing'] }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const resData = await res.json();
      if (!resData.success || !Array.isArray(resData.screenshots)) {
        throw new Error(resData.error || 'Failed to generate AI screenshots.');
      }

      setScreenshots(resData.screenshots);
    } catch (err: any) {
      console.error('Error generating AI UI screenshots:', err);
      setErrorMsg(err?.message || 'Failed to connect to AI image generator.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const views: { id: UIPreviewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'SaaS Dashboard', icon: LayoutDashboard },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
    { id: 'landing', label: 'Hero Landing', icon: Globe },
    { id: 'ecommerce', label: 'E-Commerce Store', icon: ShoppingBag },
    { id: 'cards', label: 'UI Cards & Widgets', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Top Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <div className="flex items-center space-x-1.5 overflow-x-auto p-1">
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'screenshots'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI UI Screenshots (3 Presets)</span>
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'interactive'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Interactive UI Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'typography'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Typography & Color Pairing</span>
          </button>
        </div>

        {activeTab === 'interactive' && (
          <div className="flex items-center space-x-1 overflow-x-auto px-2 pb-1 sm:pb-0">
            {views.map((v) => {
              const Icon = v.icon;
              const isActive = interactiveMode === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setInteractiveMode(v.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isActive ? 'bg-indigo-600/40 border border-indigo-500 text-indigo-200' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TAB 1: AI GENERATED UI SCREENSHOTS */}
      {activeTab === 'screenshots' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-3xl space-y-4 relative z-10">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-widest">
                <Sparkle className="w-4 h-4 text-pink-400" />
                <span>Imagen 3 Color Studio</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI UI Screenshots Styled with Your Palette
              </h2>

              <p className="text-slate-400 text-sm">
                Generate 3 high-quality UI screenshots (Mobile App, SaaS Dashboard, Landing Page) using Imagen AI image generation model, tailored specifically to{' '}
                <strong className="text-slate-200">{palette.projectName || palette.title}</strong>.
              </p>

              {/* Active Palette Roles Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xs text-slate-400 font-semibold">Active Color Roles:</span>
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primary }} />
                  <span className="font-mono text-slate-300">Primary ({primary})</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: secondary }} />
                  <span className="font-mono text-slate-300">Secondary ({secondary})</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="font-mono text-slate-300">Accent ({accent})</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mono }} />
                  <span className="font-mono text-slate-300">Mono ({mono})</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleGenerateAIScreenshots}
                  disabled={isGenerating}
                  className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating 3 AI Screenshots...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-300" />
                      <span>Generate AI UI Screenshots</span>
                    </>
                  )}
                </button>

                {errorMsg && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                    {errorMsg}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Grid of 3 Screenshots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {screenshots.map((shot) => (
              <div
                key={shot.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between group"
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {shot.type === 'mobile' && <Smartphone className="w-4 h-4 text-indigo-400" />}
                    {shot.type === 'dashboard' && <LayoutDashboard className="w-4 h-4 text-cyan-400" />}
                    {shot.type === 'landing' && <Globe className="w-4 h-4 text-pink-400" />}
                    <h3 className="font-bold text-sm text-white truncate">{shot.title}</h3>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
                    {shot.aspectRatio}
                  </span>
                </div>

                {/* Screenshot Image View */}
                <div className="relative bg-slate-950 p-3 flex items-center justify-center overflow-hidden min-h-[280px]">
                  <img
                    src={shot.imageUrl}
                    alt={shot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[360px] object-contain rounded-xl shadow-md transition transform group-hover:scale-[1.02]"
                  />

                  {/* Expand Overlay Button */}
                  <button
                    onClick={() => setExpandedScreenshot(shot)}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white space-x-2 font-semibold text-xs rounded-xl"
                  >
                    <Maximize2 className="w-4 h-4 text-indigo-400" />
                    <span>View Full High-Res</span>
                  </button>
                </div>

                {/* Info & Action Footer */}
                <div className="p-4 space-y-3 bg-slate-900 border-t border-slate-800">
                  <p className="text-xs text-slate-400 line-clamp-2">{shot.description}</p>

                  {/* Applied Palette Badges */}
                  <div className="flex flex-wrap gap-1">
                    {shot.appliedColors.map((ac) => (
                      <span
                        key={ac.role}
                        className="inline-flex items-center space-x-1 text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ac.hex }} />
                        <span>{ac.role}</span>
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => handleCopyPrompt(shot.prompt, shot.id)}
                      className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 transition"
                    >
                      {copiedId === shot.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Prompt!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>

                    <a
                      href={shot.imageUrl}
                      download={`${shot.type}-ui-screenshot.png`}
                      className="flex items-center space-x-1 px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE UI CANVAS */}
      {activeTab === 'interactive' && (
        <div
          style={{ backgroundColor: bg, color: text }}
          className="rounded-2xl p-6 sm:p-8 transition-colors duration-300 min-h-[500px] shadow-2xl border border-black/10 overflow-hidden"
        >
          {/* VIEW 1: SaaS Dashboard */}
          {interactiveMode === 'dashboard' && (
            <div className="space-y-6">
              <div
                style={{ backgroundColor: surface }}
                className="flex items-center justify-between p-4 rounded-xl shadow-sm border border-black/5"
              >
                <div className="flex items-center space-x-3">
                  <div style={{ backgroundColor: primary }} className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    AI
                  </div>
                  <span className="font-bold text-sm">Analytics Console</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button style={{ backgroundColor: primary, color: '#FFFFFF' }} className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow">
                    + New Campaign
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div style={{ backgroundColor: surface }} className="p-4 rounded-xl border border-black/5 space-y-2">
                  <span className="text-xs opacity-70">Total Revenue</span>
                  <p className="text-2xl font-bold">$124,500</p>
                  <span style={{ color: secondary }} className="text-xs font-semibold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.4% vs last month
                  </span>
                </div>

                <div style={{ backgroundColor: surface }} className="p-4 rounded-xl border border-black/5 space-y-2">
                  <span className="text-xs opacity-70">Active Users</span>
                  <p className="text-2xl font-bold">14,280</p>
                  <span style={{ color: secondary }} className="text-xs font-semibold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12.1% new signups
                  </span>
                </div>

                <div style={{ backgroundColor: surface }} className="p-4 rounded-xl border border-black/5 space-y-2">
                  <span className="text-xs opacity-70">Conversion Rate</span>
                  <p className="text-2xl font-bold">4.82%</p>
                  <span style={{ color: accent }} className="text-xs font-semibold">
                    ★ Top performer
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Mobile App Frame */}
          {interactiveMode === 'mobile' && (
            <div className="max-w-sm mx-auto">
              <div style={{ backgroundColor: surface }} className="rounded-3xl p-6 shadow-2xl border border-black/10 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-lg">Good Morning, Alex</h3>
                    <p className="text-xs opacity-70">Your daily health & streak summary</p>
                  </div>
                  <div style={{ backgroundColor: primary }} className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    <User className="w-5 h-5" />
                  </div>
                </div>

                <div style={{ backgroundColor: primary, color: '#FFFFFF' }} className="p-5 rounded-2xl shadow-lg space-y-3">
                  <span className="text-xs font-semibold uppercase opacity-80">Daily Focus Streak</span>
                  <h4 className="text-3xl font-extrabold">24 Days 🔥</h4>
                  <p className="text-xs opacity-90">Keep going! You are in the top 5% of active members.</p>
                </div>

                <button style={{ backgroundColor: secondary, color: '#FFFFFF' }} className="w-full py-3 rounded-xl font-bold text-xs shadow-md">
                  Start Today's Session
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: Hero Landing Section */}
          {interactiveMode === 'landing' && (
            <div className="text-center max-w-2xl mx-auto py-12 space-y-6">
              <span style={{ backgroundColor: surface, color: primary }} className="px-3 py-1 rounded-full text-xs font-semibold inline-block border border-black/10">
                🚀 Introducing Color AI Studio 2.0
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Design Harmonious Colors for Modern Products
              </h2>
              <p className="text-sm opacity-80 max-w-lg mx-auto">
                Automate palette generation, contrast checks, and image extraction with deep neural intelligence.
              </p>
              <div className="flex justify-center items-center space-x-3 pt-2">
                <button style={{ backgroundColor: primary, color: '#FFFFFF' }} className="px-6 py-3 rounded-xl font-bold text-sm shadow-xl">
                  Get Started Free
                </button>
                <button style={{ backgroundColor: surface }} className="px-6 py-3 rounded-xl font-bold text-sm border border-black/10">
                  Live Demo
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: E-Commerce Store */}
          {interactiveMode === 'ecommerce' && (
            <div className="max-w-md mx-auto">
              <div style={{ backgroundColor: surface }} className="rounded-2xl p-6 shadow-xl border border-black/5 space-y-4">
                <div style={{ backgroundColor: bg }} className="h-48 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <ShoppingBag className="w-16 h-16 opacity-30" />
                  <span style={{ backgroundColor: accent, color: '#FFFFFF' }} className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    NEW ARRIVAL
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">Aesthetic Studio Headphones</h3>
                    <p className="text-xs opacity-70">Wireless Noise-Canceling Acoustic Master</p>
                  </div>
                  <span style={{ color: primary }} className="text-xl font-black">
                    $299
                  </span>
                </div>
                <button style={{ backgroundColor: primary, color: '#FFFFFF' }} className="w-full py-3 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 5: Cards & Components */}
          {interactiveMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{ backgroundColor: surface }} className="p-5 rounded-2xl border border-black/5 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle style={{ color: secondary }} className="w-5 h-5" />
                  <h4 className="font-bold text-sm">System Status Normal</h4>
                </div>
                <p className="text-xs opacity-80">All cloud services operational with 99.99% uptime guarantees.</p>
              </div>

              <div style={{ backgroundColor: surface }} className="p-5 rounded-2xl border border-black/5 space-y-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck style={{ color: primary }} className="w-5 h-5" />
                  <h4 className="font-bold text-sm">Enterprise Security</h4>
                </div>
                <p className="text-xs opacity-80">End-to-end encrypted storage and role-based permissions.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TYPOGRAPHY & COLOR PAIRING GUIDE */}
      {activeTab === 'typography' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Typography & Color Rules Guide</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                دليل تناسق الخطوط والألوان للمصممين والمطورين
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed" dir="rtl">
                اختيار الألوان والخطوط المناسبة هو أساس تصميم الواجهات الاحترافية. إليك أهم القواعد والممارسات العالمية لدمج الخطوط مع نظام الألوان الخاص بك:
              </p>

              {/* Interactive Typography Category Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <button
                  onClick={() => setSelectedFontPair('modern')}
                  className={`p-3 rounded-xl border text-right transition ${
                    selectedFontPair === 'modern'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-purple-300">Modern Sans (تطبيقات حديثة)</span>
                  <span className="text-[11px] opacity-70">Plus Jakarta / Inter</span>
                </button>

                <button
                  onClick={() => setSelectedFontPair('arabic')}
                  className={`p-3 rounded-xl border text-right transition ${
                    selectedFontPair === 'arabic'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-purple-300">Arabic Modern (خطوط عربية)</span>
                  <span className="text-[11px] opacity-70">Cairo / Tajawal / IBM Plex</span>
                </button>

                <button
                  onClick={() => setSelectedFontPair('serif')}
                  className={`p-3 rounded-xl border text-right transition ${
                    selectedFontPair === 'serif'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-purple-300">Editorial Serif (مجلات وفخامة)</span>
                  <span className="text-[11px] opacity-70">Playfair / Merriweather</span>
                </button>

                <button
                  onClick={() => setSelectedFontPair('mono')}
                  className={`p-3 rounded-xl border text-right transition ${
                    selectedFontPair === 'mono'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block text-purple-300">Technical Mono (برمجة وبيانات)</span>
                  <span className="text-[11px] opacity-70">Fira Code / JetBrains</span>
                </button>
              </div>
            </div>
          </div>

          {/* Typography Live Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <span>معاينة حية لتنسيق الخطوط مع ألوان اللوحة الحالية</span>
            </h3>

            <div
              style={{ backgroundColor: secondary, color: text }}
              className="p-6 sm:p-8 rounded-2xl space-y-6 border border-white/10 shadow-xl"
            >
              {/* Heading styled with Primary Color */}
              <div>
                <span
                  style={{ color: accent }}
                  className="text-xs font-mono font-bold tracking-widest uppercase block mb-1"
                >
                  {selectedFontPair === 'arabic' ? 'عنوان فرعي - CATEGORY TAG' : 'FEATURED HEADING'}
                </span>
                <h2
                  style={{ color: primary }}
                  className={`text-3xl sm:text-4xl font-extrabold leading-tight ${
                    selectedFontPair === 'arabic'
                      ? 'font-sans'
                      : selectedFontPair === 'serif'
                      ? 'font-serif'
                      : selectedFontPair === 'mono'
                      ? 'font-mono'
                      : 'font-sans'
                  }`}
                  dir={selectedFontPair === 'arabic' ? 'rtl' : 'ltr'}
                >
                  {selectedFontPair === 'arabic'
                    ? 'التصميم الاحترافي يبدأ بالتناسق الدقيق بين الألوان والخطوط'
                    : 'Crafting Visually Stunning Interfaces with Mathematical Precision'}
                </h2>
              </div>

              {/* Body text styled for high readability */}
              <p
                className="text-sm opacity-90 leading-relaxed max-w-2xl"
                dir={selectedFontPair === 'arabic' ? 'rtl' : 'ltr'}
              >
                {selectedFontPair === 'arabic'
                  ? 'يساهم التباين الواضح بين لون الخلفية ولون النص في تحسين تجربة المستخدم وسهولة القراءة (WCAG Compliance). استخدم دائماً اللون الأولي (Primary) للعناوين الرئيسية، واللون الفرعي (Secondary) للخلفيات، والألوان البارزة (Accent) للأزرار والتنبيهات.'
                  : 'High contrast ratio between text and background ensures maximum legibility and WCAG AA compliance. Use your Primary color for high-impact titles, Secondary tones for stable surfaces, and Accent hues for call-to-action triggers.'}
              </p>

              {/* Button & Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  style={{ backgroundColor: primary, color: '#FFFFFF' }}
                  className="px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition transform hover:scale-105"
                >
                  {selectedFontPair === 'arabic' ? 'زر التفاعل الرئيسي (CTA)' : 'Primary Action Button'}
                </button>

                <span
                  style={{ backgroundColor: mono, color: secondary }}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold border border-black/10"
                >
                  {selectedFontPair === 'arabic' ? 'شارة Monochromatic' : 'Monochromatic Tint Badge'}
                </span>
              </div>
            </div>

            {/* Structured Rules Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2" dir="rtl">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">قاعدة 60-30-10 للتوزيع</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  استخدم 60% من اللوحة للخلفيات والمساحات المفتوحة، 30% للهياكل والنصوص، و 10% فقط للون البارز (Accent) في الأزرار والتفاعلات.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">تناسق وزن الخط ولون النص</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  الخطوط الخفيفة (Light/Thin) تتطلب تبايناً أعلى لتبدو واضحة. للفقرات العادية استخدم أوزان (Regular/Medium) مع تباين لا يقل عن 4.5:1.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">الخطوط العربية المناسبة</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  للتطبيقات والواجهات البرمجية يُفضل خطوط هندسية واضحة مثل <strong>Cairo</strong> أو <strong>IBM Plex Sans Arabic</strong> أو <strong>Tajawal</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {expandedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setExpandedScreenshot(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">{expandedScreenshot.title}</h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl flex items-center justify-center">
              <img
                src={expandedScreenshot.imageUrl}
                alt={expandedScreenshot.title}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Image Generation Prompt:</span>
                <p className="text-slate-200 font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 select-all">
                  {expandedScreenshot.prompt}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex flex-wrap gap-2">
                  {expandedScreenshot.appliedColors.map((ac) => (
                    <div key={ac.role} className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ac.hex }} />
                      <span className="text-slate-200 font-semibold">{ac.role}: {ac.hex}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={expandedScreenshot.imageUrl}
                  download={`${expandedScreenshot.type}-screenshot-full.png`}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res Screenshot</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
