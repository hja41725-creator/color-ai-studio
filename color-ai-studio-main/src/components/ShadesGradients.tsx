import React, { useState } from 'react';
import { Palette, ColorItem } from '../types';
import { generateColorScale } from '../utils/colorUtils';
import {
  Layers,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Eye,
  Code2,
  Maximize2,
  Box,
  Sun,
  Moon,
  Sparkle
} from 'lucide-react';

interface ShadesGradientsProps {
  palette: Palette;
  selectedColor: ColorItem;
}

// Convert HEX color to RGBA helper
function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return `rgba(255,255,255,${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const ShadesGradients: React.FC<ShadesGradientsProps> = ({ palette, selectedColor }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Glassmorphism State Controls
  const [glassType, setGlassType] = useState<'solid' | 'gradient' | 'mesh'>('gradient');
  const [blurAmount, setBlurAmount] = useState<number>(16); // 0 to 40 px
  const [glassOpacity, setGlassOpacity] = useState<number>(0.25); // 0.05 to 0.9
  const [borderOpacity, setBorderOpacity] = useState<number>(0.3); // 0.05 to 0.8
  const [gradientAngle, setGradientAngle] = useState<number>(135); // deg
  const [showShine, setShowShine] = useState<boolean>(true);
  const [colorStop1Idx, setColorStop1Idx] = useState<number>(0); // Primary
  const [colorStop2Idx, setColorStop2Idx] = useState<number>(palette.colors.length > 2 ? 2 : 1); // Accent or Secondary
  const [bgPattern, setBgPattern] = useState<'vibrant' | 'mesh' | 'dark' | 'light'>('vibrant');

  const shades = generateColorScale(selectedColor.hex);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  // Extract selected colors for gradient glass
  const stop1Hex = palette.colors[colorStop1Idx % palette.colors.length]?.hex || '#4F46E5';
  const stop2Hex = palette.colors[colorStop2Idx % palette.colors.length]?.hex || '#EC4899';

  // Compute Glass CSS Styles
  const stop1Rgba = hexToRgba(stop1Hex, glassOpacity);
  const stop2Rgba = hexToRgba(stop2Hex, glassOpacity * 0.75);
  const borderRgba = hexToRgba('#FFFFFF', borderOpacity);

  let backgroundCss = '';
  if (glassType === 'solid') {
    backgroundCss = hexToRgba(stop1Hex, glassOpacity);
  } else if (glassType === 'gradient') {
    backgroundCss = `linear-gradient(${gradientAngle}deg, ${stop1Rgba}, ${stop2Rgba})`;
  } else {
    // Mesh Glass
    backgroundCss = `radial-gradient(at 0% 0%, ${stop1Rgba} 0px, transparent 50%), radial-gradient(at 100% 100%, ${stop2Rgba} 0px, transparent 50%), ${hexToRgba('#1E293B', glassOpacity * 0.5)}`;
  }

  const glassStyle: React.CSSProperties = {
    background: backgroundCss,
    backdropFilter: `blur(${blurAmount}px)`,
    WebkitBackdropFilter: `blur(${blurAmount}px)`,
    border: `1px solid ${borderRgba}`,
    boxShadow: `0 20px 40px ${hexToRgba('#000000', 0.25)}, inset 0 1px 1px ${hexToRgba('#FFFFFF', borderOpacity * 1.2)}`,
  };

  // Generate CSS Output Code String
  const generatedCssCode = `/* Glassmorphism CSS */
background: ${backgroundCss};
backdrop-filter: blur(${blurAmount}px);
-webkit-backdrop-filter: blur(${blurAmount}px);
border: 1px solid ${borderRgba};
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity.toFixed(2)});
border-radius: 20px;`;

  // Tailwind Equivalent snippet
  const tailwindSnippet = `bg-gradient-to-br from-[${stop1Hex}]/${Math.round(glassOpacity * 100)} to-[${stop2Hex}]/${Math.round(glassOpacity * 75)} backdrop-blur-[${blurAmount}px] border border-white/${Math.round(borderOpacity * 100)} shadow-2xl rounded-2xl`;

  // Standard Linear & Radial Gradients derived from active palette
  const gradient1 = `linear-gradient(135deg, ${palette.colors[0]?.hex || '#4F46E5'}, ${palette.colors[1]?.hex || '#06B6D4'})`;
  const gradient2 = `linear-gradient(to right, ${palette.colors[1]?.hex || '#06B6D4'}, ${palette.colors[2]?.hex || '#EC4899'}, ${palette.colors[3]?.hex || '#F59E0B'})`;
  const gradient3 = `radial-gradient(circle, ${palette.colors[0]?.hex || '#4F46E5'}, ${palette.colors[palette.colors.length - 1]?.hex || '#0F172A'})`;

  return (
    <div className="space-y-8">
      {/* 1. GLASSMORPHISM & GRADIENT GLASS STUDIO */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>Glassmorphism & Gradient Glass Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              تأثيرات الزجاج المتدرج والشفافية (Gradient Glassmorphism)
            </h2>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setGlassType('gradient')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                glassType === 'gradient' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gradient Glass (متدرج)
            </button>
            <button
              onClick={() => setGlassType('solid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                glassType === 'solid' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Solid Glass (شفاف أحادي)
            </button>
            <button
              onClick={() => setGlassType('mesh')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                glassType === 'mesh' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mesh Glass (شبكي)
            </button>
          </div>
        </div>

        {/* Live Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Studio Controls (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-5 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>إعدادات الشفافية والتمويه (Glass Controls)</span>
            </h3>

            {/* Gradient Color Stops Selectors */}
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold block">ألوان التدرج الزجاجي (Palette Color Stops):</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">اللون الأول (Color 1):</span>
                  <select
                    value={colorStop1Idx}
                    onChange={(e) => setColorStop1Idx(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded-lg font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {palette.colors.map((c, idx) => (
                      <option key={c.id} value={idx}>
                        {c.role} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">اللون الثاني (Color 2):</span>
                  <select
                    value={colorStop2Idx}
                    onChange={(e) => setColorStop2Idx(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded-lg font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {palette.colors.map((c, idx) => (
                      <option key={c.id} value={idx}>
                        {c.role} ({c.hex})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Blur Intensity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span>درجة الضبابية (Backdrop Blur):</span>
                <span className="font-mono font-bold text-indigo-400">{blurAmount}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blurAmount}
                onChange={(e) => setBlurAmount(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Glass Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span>نسبة شفافية لون الزجاج (Glass Opacity):</span>
                <span className="font-mono font-bold text-indigo-400">{Math.round(glassOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.85"
                step="0.05"
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Border Highlight Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span>حدود الإنعكاس الزجاجي (Border Gloss):</span>
                <span className="font-mono font-bold text-indigo-400">{Math.round(borderOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Gradient Angle */}
            {glassType === 'gradient' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-300">
                  <span>زاوية التدرج (Gradient Angle):</span>
                  <span className="font-mono font-bold text-indigo-400">{gradientAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={gradientAngle}
                  onChange={(e) => setGradientAngle(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            )}

            {/* Background Canvas Environment Selector */}
            <div className="space-y-1.5 pt-1">
              <span className="text-slate-300 font-semibold block">خلفية التمعن والتأثير (Test Canvas Background):</span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setBgPattern('vibrant')}
                  className={`p-2 rounded-lg border text-[10px] font-bold transition ${
                    bgPattern === 'vibrant' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Vibrant Spheres
                </button>
                <button
                  onClick={() => setBgPattern('mesh')}
                  className={`p-2 rounded-lg border text-[10px] font-bold transition ${
                    bgPattern === 'mesh' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Abstract Mesh
                </button>
                <button
                  onClick={() => setBgPattern('dark')}
                  className={`p-2 rounded-lg border text-[10px] font-bold transition ${
                    bgPattern === 'dark' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Dark Grid
                </button>
                <button
                  onClick={() => setBgPattern('light')}
                  className={`p-2 rounded-lg border text-[10px] font-bold transition ${
                    bgPattern === 'light' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Light Mode
                </button>
              </div>
            </div>
          </div>

          {/* Live Glass Preview Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden min-h-[380px] border border-slate-800 p-6 flex flex-col items-center justify-center shadow-2xl">
              {/* Dynamic Backgrounds to demonstrate Backdrop Blur translucency */}
              {bgPattern === 'vibrant' && (
                <div className="absolute inset-0 bg-slate-950 overflow-hidden pointer-events-none">
                  <div
                    className="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-2xl opacity-80 animate-pulse"
                    style={{ backgroundColor: stop1Hex }}
                  />
                  <div
                    className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full blur-2xl opacity-80 animate-pulse"
                    style={{ backgroundColor: stop2Hex }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-400 rounded-full blur-3xl opacity-40" />
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                </div>
              )}

              {bgPattern === 'mesh' && (
                <div
                  className="absolute inset-0 opacity-90"
                  style={{
                    background: `radial-gradient(at 0% 0%, ${stop1Hex} 0px, transparent 50%), radial-gradient(at 100% 0%, ${stop2Hex} 0px, transparent 50%), radial-gradient(at 100% 100%, #3B82F6 0px, transparent 50%), radial-gradient(at 0% 100%, #EC4899 0px, transparent 50%)`,
                  }}
                />
              )}

              {bgPattern === 'dark' && (
                <div className="absolute inset-0 bg-slate-950 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]" />
              )}

              {bgPattern === 'light' && (
                <div className="absolute inset-0 bg-slate-100 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
                  <div className="absolute top-10 right-10 w-48 h-48 bg-pink-400 rounded-full blur-2xl opacity-50" />
                </div>
              )}

              {/* The Live Glassmorphism Card */}
              <div
                style={glassStyle}
                className="relative z-10 w-full max-w-md p-6 rounded-2xl space-y-5 transition-all duration-300"
              >
                {/* Header inside glass */}
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <div className="flex items-center space-x-2">
                    <div
                      style={{ backgroundColor: stop1Hex }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md"
                    >
                      <Sparkle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-sm text-white drop-shadow-xs">
                      {palette.projectName || palette.title} Glass Card
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/30">
                    {glassType.toUpperCase()}
                  </span>
                </div>

                {/* Body Text */}
                <div className="space-y-2 text-white">
                  <h4 className="font-black text-xl drop-shadow-sm">
                    تأثير زجاجي متدرج وفاخر
                  </h4>
                  <p className="text-xs text-white/90 leading-relaxed font-medium drop-shadow-xs">
                    ينتج هذا التأثير الزجاجي (Glassmorphism) عبر دمج خلفيات الشفافية مع خاصية <code className="bg-black/30 px-1 py-0.5 rounded text-[10px] font-mono">backdrop-filter: blur({blurAmount}px)</code>.
                  </p>
                </div>

                {/* Glass Button inside Card */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    style={{
                      background: hexToRgba('#FFFFFF', 0.25),
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.4)',
                    }}
                    className="flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition transform hover:scale-105 active:scale-95"
                  >
                    تفاعل زجاجي (Glass CTA)
                  </button>

                  <div className="px-3 py-2 rounded-xl bg-black/20 text-white text-xs font-mono font-bold border border-white/10">
                    {Math.round(glassOpacity * 100)}% Opacity
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Code Output Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                  <Code2 className="w-4 h-4" />
                  <span>كود CSS الخاص بالتأثير الزجاجي الحالي</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(generatedCssCode)}
                    className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    {copiedText === generatedCssCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === generatedCssCode ? 'Copied CSS!' : 'Copy Standard CSS'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(tailwindSnippet)}
                    className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    {copiedText === tailwindSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === tailwindSnippet ? 'Copied Tailwind!' : 'Copy Tailwind Class'}</span>
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap select-all">
                {generatedCssCode}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAILWIND 50-950 SHADE SCALE GENERATOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            <span>Tailwind CSS 50-950 Shade Scale for {selectedColor.name} ({selectedColor.hex})</span>
          </div>
          <span className="text-xs text-slate-400">Click shade to copy HEX</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-11 gap-2">
          {shades.map((shade) => (
            <button
              key={shade.step}
              onClick={() => handleCopy(shade.hex)}
              className="group flex flex-col items-center p-2 rounded-xl border border-slate-800 hover:border-indigo-500 transition bg-slate-950"
            >
              <div
                style={{ backgroundColor: shade.hex }}
                className="w-full h-12 rounded-lg shadow-inner mb-2 group-hover:scale-105 transition"
              />
              <span className="text-[11px] font-bold text-white">{shade.step}</span>
              <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-400">
                {copiedText === shade.hex ? 'Copied!' : shade.hex}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MODERN GRADIENT PRESETS DERIVED FROM PALETTE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Production Gradient Presets</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div style={{ background: gradient1 }} className="h-28 rounded-xl shadow-lg border border-black/10" />
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-slate-300">Linear 135°</span>
              <button
                onClick={() => handleCopy(`background: ${gradient1};`)}
                className="text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy CSS</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div style={{ background: gradient2 }} className="h-28 rounded-xl shadow-lg border border-black/10" />
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-slate-300">Multi-Stop Horizon</span>
              <button
                onClick={() => handleCopy(`background: ${gradient2};`)}
                className="text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy CSS</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div style={{ background: gradient3 }} className="h-28 rounded-xl shadow-lg border border-black/10" />
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-slate-300">Radial Depth</span>
              <button
                onClick={() => handleCopy(`background: ${gradient3};`)}
                className="text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy CSS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

