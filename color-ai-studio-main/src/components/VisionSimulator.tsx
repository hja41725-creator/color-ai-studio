import React, { useState } from 'react';
import { Palette, ColorItem } from '../types';
import {
  Eye,
  EyeOff,
  Glasses,
  AlertTriangle,
  CheckCircle2,
  Info,
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  PieChart,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface VisionSimulatorProps {
  palette: Palette;
}

export type VisionType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface VisionInfo {
  id: VisionType;
  title: string;
  subTitle: string;
  prevalence: string;
  description: string;
  affectedCones: string;
  svgFilterId: string;
  matrix: number[][];
}

const VISION_TYPES: VisionInfo[] = [
  {
    id: 'normal',
    title: 'Normal Vision',
    subTitle: 'Trichromacy',
    prevalence: '~92% of Population',
    description: 'Standard color perception using all three functional cone types (Red L, Green M, Blue S).',
    affectedCones: 'None (Full Trichromacy)',
    svgFilterId: 'filter-normal',
    matrix: [
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  {
    id: 'protanopia',
    title: 'Protanopia',
    subTitle: 'Red-Blind',
    prevalence: '~1.0% of Males, 0.02% Females',
    description: 'Complete absence of red L-cones. Red hues appear dark gray or olive-yellow, and red/green contrast is lost.',
    affectedCones: 'L-Cone (Long Wavelength)',
    svgFilterId: 'filter-protanopia',
    matrix: [
      [0.56667, 0.43333, 0, 0, 0],
      [0.55833, 0.44167, 0, 0, 0],
      [0, 0.24167, 0.75833, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  {
    id: 'deuteranopia',
    title: 'Deuteranopia',
    subTitle: 'Green-Blind',
    prevalence: '~6.0% of Males, 0.4% Females',
    description: 'Absence of green M-cones. Most common form of color blindness. Green/red hues blend into muted yellowish-browns.',
    affectedCones: 'M-Cone (Medium Wavelength)',
    svgFilterId: 'filter-deuteranopia',
    matrix: [
      [0.625, 0.375, 0, 0, 0],
      [0.7, 0.3, 0, 0, 0],
      [0, 0.3, 0.7, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  {
    id: 'tritanopia',
    title: 'Tritanopia',
    subTitle: 'Blue-Blind',
    prevalence: '~0.01% of Population',
    description: 'Absence of blue S-cones. Rare deficiency where blue looks greenish/gray, and yellow looks pinkish/red.',
    affectedCones: 'S-Cone (Short Wavelength)',
    svgFilterId: 'filter-tritanopia',
    matrix: [
      [0.95, 0.05, 0, 0, 0],
      [0, 0.43333, 0.56667, 0, 0],
      [0, 0.475, 0.525, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
  {
    id: 'achromatopsia',
    title: 'Achromatopsia',
    subTitle: 'Monochromacy / Grayscale',
    prevalence: '~0.003% of Population',
    description: 'Total inability to perceive any color. Vision is entirely based on relative light intensity (luminance).',
    affectedCones: 'All Cones (Cone Monochromacy)',
    svgFilterId: 'filter-achromatopsia',
    matrix: [
      [0.299, 0.587, 0.114, 0, 0],
      [0.299, 0.587, 0.114, 0, 0],
      [0.299, 0.587, 0.114, 0, 0],
      [0, 0, 0, 1, 0],
    ],
  },
];

// Hex color mathematical transformation helper using color blindness matrices
export function transformHexColor(hex: string, visionType: VisionType): string {
  if (visionType === 'normal') return hex;

  // Parse Hex to RGB
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return hex;

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const vInfo = VISION_TYPES.find((v) => v.id === visionType);
  if (!vInfo) return hex;

  const m = vInfo.matrix;
  const nr = Math.min(255, Math.max(0, Math.round(m[0][0] * r + m[0][1] * g + m[0][2] * b)));
  const ng = Math.min(255, Math.max(0, Math.round(m[1][0] * r + m[1][1] * g + m[1][2] * b)));
  const nb = Math.min(255, Math.max(0, Math.round(m[2][0] * r + m[2][1] * g + m[2][2] * b)));

  const toHex = (c: number) => c.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}

// Calculate Euclidean distance between two RGB colors to check distinguishability
function getColorDistance(hex1: string, hex2: string): number {
  const c1 = parseInt(hex1.replace('#', ''), 16);
  const c2 = parseInt(hex2.replace('#', ''), 16);
  if (isNaN(c1) || isNaN(c2)) return 255;

  const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;

  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

export const VisionSimulator: React.FC<VisionSimulatorProps> = ({ palette }) => {
  const [selectedVision, setSelectedVision] = useState<VisionType>('deuteranopia');
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [layoutMode, setLayoutMode] = useState<'dashboard' | 'mobile' | 'ecommerce' | 'charts'>('dashboard');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Helper to extract color by role
  const getRoleColor = (roleName: string, fallbackIdx: number) => {
    const found = palette.colors.find((c) => c.role.toLowerCase() === roleName.toLowerCase());
    return found ? found.hex : palette.colors[fallbackIdx % palette.colors.length]?.hex || '#1E293B';
  };

  const primary = getRoleColor('Primary', 0);
  const secondary = getRoleColor('Secondary', 1);
  const accent = getRoleColor('Accent', 2);
  const mono = getRoleColor('Monochromatic', 3);
  const bg = getRoleColor('Background', 1);
  const surface = getRoleColor('Surface', 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Analyze palette distinguishability under current vision deficiency
  const analyzePaletteDeficiency = (vType: VisionType) => {
    if (vType === 'normal') return [];
    const simulatedColors = palette.colors.map((c) => ({
      ...c,
      simHex: transformHexColor(c.hex, vType),
    }));

    const conflicts: { colorA: ColorItem; colorB: ColorItem; dist: number }[] = [];
    for (let i = 0; i < simulatedColors.length; i++) {
      for (let j = i + 1; j < simulatedColors.length; j++) {
        const dist = getColorDistance(simulatedColors[i].simHex, simulatedColors[j].simHex);
        if (dist < 38) { // low perceptual distance threshold
          conflicts.push({
            colorA: simulatedColors[i],
            colorB: simulatedColors[j],
            dist,
          });
        }
      }
    }
    return conflicts;
  };

  const currentConflicts = analyzePaletteDeficiency(selectedVision);

  // Render Sample UI Component Layout based on active layout type
  const renderSampleLayout = (visionType: VisionType) => {
    const pSim = transformHexColor(primary, visionType);
    const sSim = transformHexColor(secondary, visionType);
    const aSim = transformHexColor(accent, visionType);
    const mSim = transformHexColor(mono, visionType);
    const bgSim = transformHexColor(bg, visionType);
    const surfSim = transformHexColor(surface, visionType);

    if (layoutMode === 'dashboard') {
      return (
        <div style={{ backgroundColor: bgSim }} className="p-4 rounded-xl border border-white/10 space-y-4 text-xs">
          {/* Header Bar */}
          <div style={{ backgroundColor: surfSim }} className="p-3 rounded-lg flex items-center justify-between border border-white/5">
            <div className="flex items-center space-x-2">
              <div style={{ backgroundColor: pSim }} className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px]">
                AI
              </div>
              <span className="font-bold text-white truncate max-w-[120px]">{palette.projectName || palette.title}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span style={{ backgroundColor: aSim, color: '#000000' }} className="px-2 py-0.5 rounded text-[10px] font-extrabold">
                Pro Plan
              </span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div style={{ backgroundColor: surfSim }} className="p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] opacity-70 text-slate-300">Revenue Growth</span>
              <p className="font-extrabold text-sm text-white">$48,290</p>
              <div className="flex items-center space-x-1">
                <span style={{ color: pSim }} className="font-bold text-[10px]">↑ +24%</span>
                <span className="text-[9px] opacity-60">vs target</span>
              </div>
            </div>

            <div style={{ backgroundColor: surfSim }} className="p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] opacity-70 text-slate-300">Active Subscribers</span>
              <p className="font-extrabold text-sm text-white">12,450</p>
              <div className="flex items-center space-x-1">
                <span style={{ color: aSim }} className="font-bold text-[10px]">★ Top Tier</span>
              </div>
            </div>
          </div>

          {/* Status & CTA Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5">
              <span style={{ backgroundColor: pSim }} className="w-2.5 h-2.5 rounded-full" />
              <span className="text-[10px] text-slate-300">System Status: Active</span>
            </div>

            <button style={{ backgroundColor: pSim, color: '#FFFFFF' }} className="px-3 py-1.5 rounded-md font-bold text-[10px]">
              Deploy App
            </button>
          </div>
        </div>
      );
    }

    if (layoutMode === 'mobile') {
      return (
        <div style={{ backgroundColor: surfSim }} className="p-4 rounded-xl border border-white/10 space-y-4 text-xs max-w-xs mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] opacity-70 text-slate-300">Daily Summary</p>
              <h4 className="font-bold text-sm text-white">Focus Streak</h4>
            </div>
            <div style={{ backgroundColor: pSim }} className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              28d
            </div>
          </div>

          <div style={{ backgroundColor: pSim }} className="p-3.5 rounded-xl text-white space-y-2">
            <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80">Daily Target Completed</span>
            <p className="font-extrabold text-lg">100% Goal Reached</p>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div style={{ backgroundColor: aSim }} className="h-full w-4/5 rounded-full" />
            </div>
          </div>

          <button style={{ backgroundColor: sSim, color: '#FFFFFF' }} className="w-full py-2 rounded-lg font-bold text-[11px] text-center shadow">
            Continue Activity
          </button>
        </div>
      );
    }

    if (layoutMode === 'ecommerce') {
      return (
        <div style={{ backgroundColor: surfSim }} className="p-4 rounded-xl border border-white/10 space-y-3 text-xs">
          <div style={{ backgroundColor: bgSim }} className="h-28 rounded-lg flex items-center justify-center relative">
            <ShoppingBag style={{ color: pSim }} className="w-10 h-10 opacity-70" />
            <span style={{ backgroundColor: aSim, color: '#000000' }} className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-extrabold">
              NEW
            </span>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-white text-xs">Wireless Headphones</h4>
              <p className="text-[10px] text-slate-400">Acoustic Pro Edition</p>
            </div>
            <span style={{ color: pSim }} className="font-black text-sm">$199</span>
          </div>

          <button style={{ backgroundColor: pSim, color: '#FFFFFF' }} className="w-full py-2 rounded-lg font-bold text-[11px]">
            Add to Cart
          </button>
        </div>
      );
    }

    // charts
    return (
      <div style={{ backgroundColor: surfSim }} className="p-4 rounded-xl border border-white/10 space-y-3 text-xs">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-white text-xs">Analytics Trend Comparison</h4>
          <PieChart style={{ color: pSim }} className="w-4 h-4" />
        </div>

        <div className="h-24 flex items-end justify-between gap-2 pt-2 px-2 border-b border-white/10">
          <div style={{ backgroundColor: pSim }} className="w-1/4 h-3/4 rounded-t-md" />
          <div style={{ backgroundColor: sSim }} className="w-1/4 h-1/2 rounded-t-md" />
          <div style={{ backgroundColor: aSim }} className="w-1/4 h-full rounded-t-md" />
          <div style={{ backgroundColor: mSim }} className="w-1/4 h-2/3 rounded-t-md" />
        </div>

        <div className="flex justify-between text-[9px] text-slate-400">
          <span className="flex items-center"><span style={{ backgroundColor: pSim }} className="w-2 h-2 rounded-full mr-1 inline-block" /> Primary</span>
          <span className="flex items-center"><span style={{ backgroundColor: sSim }} className="w-2 h-2 rounded-full mr-1 inline-block" /> Sec</span>
          <span className="flex items-center"><span style={{ backgroundColor: aSim }} className="w-2 h-2 rounded-full mr-1 inline-block" /> Accent</span>
          <span className="flex items-center"><span style={{ backgroundColor: mSim }} className="w-2 h-2 rounded-full mr-1 inline-block" /> Mono</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* SVG Color Matrix Filters Definition */}
      <svg className="hidden">
        <defs>
          {VISION_TYPES.map((v) => (
            <filter id={v.svgFilterId} key={v.id}>
              <feColorMatrix
                type="matrix"
                values={v.matrix.map((row) => row.join(' ')).join(' ')}
              />
            </filter>
          ))}
        </defs>
      </svg>

      {/* Top Banner & Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-widest">
            <Glasses className="w-4 h-4 text-purple-400" />
            <span>Accessibility & Color Vision Simulator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Vision Deficiencies & Color Blindness Simulator
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Over 300 million people worldwide experience color vision deficiencies. Simulate how your current palette appears to users with Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and Achromatopsia to build inclusive digital products.
          </p>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Deuteranopia</span>
              <span className="text-base font-extrabold text-amber-400">~6% Males</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Protanopia</span>
              <span className="text-base font-extrabold text-rose-400">~1% Males</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tritanopia</span>
              <span className="text-base font-extrabold text-cyan-400">~0.01% Pop</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Achromatopsia</span>
              <span className="text-base font-extrabold text-slate-300">~0.003% Pop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: View Mode & Sample Layout Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        {/* Layout Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold px-2">Sample Layout:</span>
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLayoutMode('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                layoutMode === 'dashboard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setLayoutMode('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                layoutMode === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App</span>
            </button>

            <button
              onClick={() => setLayoutMode('ecommerce')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                layoutMode === 'ecommerce' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>

            <button
              onClick={() => setLayoutMode('charts')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                layoutMode === 'charts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Data Charts</span>
            </button>
          </div>
        </div>

        {/* Display Mode: All Grid vs Focused Single View */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'grid' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side Grid (All 5)
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'single' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Focused Inspector Mode
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SIDE-BY-SIDE ALL 5 VISION TYPES GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VISION_TYPES.map((v) => {
            const conflicts = analyzePaletteDeficiency(v.id);
            const hasConflict = conflicts.length > 0;

            return (
              <div
                key={v.id}
                onClick={() => {
                  setSelectedVision(v.id);
                  setViewMode('single');
                }}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-4 cursor-pointer transition hover:border-indigo-500 shadow-xl flex flex-col justify-between group ${
                  selectedVision === v.id ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800'
                }`}
              >
                {/* Header info */}
                <div className="space-y-1.5 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base flex items-center space-x-2">
                      <span>{v.title}</span>
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                      {v.subTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{v.description}</p>
                </div>

                {/* Live Filtered Sample Component */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 transition transform group-hover:scale-[1.01]">
                  {renderSampleLayout(v.id)}
                </div>

                {/* Palette Swatches Under Simulation */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 block">Palette Simulation Swatches:</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {palette.colors.map((c) => {
                      const simHex = transformHexColor(c.hex, v.id);
                      return (
                        <div
                          key={c.id}
                          className="group/swatch relative h-8 rounded-lg border border-white/10 flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: simHex }}
                          title={`${c.role}: ${simHex}`}
                        >
                          <span className="opacity-0 group-hover/swatch:opacity-100 text-[9px] font-mono font-bold bg-black/80 px-1 rounded text-white transition">
                            {simHex}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accessibility Alert Badge */}
                <div className="pt-2">
                  {hasConflict ? (
                    <div className="flex items-center space-x-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{conflicts.length} color pair(s) lose distinctiveness</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Colors maintain distinction</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: FOCUSED INSPECTOR MODE */}
      {viewMode === 'single' && (
        <div className="space-y-6">
          {/* Vision Type Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {VISION_TYPES.map((v) => {
              const isActive = selectedVision === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVision(v.id)}
                  className={`p-3 rounded-xl border text-left transition space-y-1 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs font-bold block">{v.title}</span>
                  <span className="text-[10px] font-mono text-indigo-300 block">{v.subTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Focused Comparison Card */}
          {(() => {
            const vInfo = VISION_TYPES.find((v) => v.id === selectedVision)!;
            return (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
                {/* Info Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-2xl font-extrabold text-white">{vInfo.title}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {vInfo.subTitle}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 max-w-2xl">{vInfo.description}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs shrink-0">
                    <span className="text-slate-400 block font-semibold">Prevalence Rate:</span>
                    <span className="text-amber-400 font-extrabold text-sm block">{vInfo.prevalence}</span>
                    <span className="text-slate-500 text-[11px]">Affected: {vInfo.affectedCones}</span>
                  </div>
                </div>

                {/* Side-by-Side Comparison: Normal vs Simulated */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Normal Trichromacy */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-bold text-sm text-white">Normal Vision (Trichromacy)</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">100% Original</span>
                    </div>

                    {renderSampleLayout('normal')}
                  </div>

                  {/* Column 2: Simulated Deficiency */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <EyeOff className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-sm text-white">Simulated {vInfo.title} View</h4>
                      </div>
                      <span className="text-[10px] text-amber-300 font-mono font-bold">Deficiency Filter Applied</span>
                    </div>

                    {renderSampleLayout(selectedVision)}
                  </div>
                </div>

                {/* Palette Colors Transformation Table */}
                <div className="space-y-4 border-t border-slate-800 pt-6">
                  <h4 className="font-bold text-base text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Palette Color Transformation Matrix ({vInfo.title})</span>
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-3 font-semibold">Color Role</th>
                          <th className="py-2.5 px-3 font-semibold">Original Hex</th>
                          <th className="py-2.5 px-3 font-semibold">Original Swatch</th>
                          <th className="py-2.5 px-3 font-semibold">Simulated Hex</th>
                          <th className="py-2.5 px-3 font-semibold">Simulated Swatch</th>
                          <th className="py-2.5 px-3 font-semibold">Perceptual Shift</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {palette.colors.map((c) => {
                          const simHex = transformHexColor(c.hex, selectedVision);
                          const dist = getColorDistance(c.hex, simHex);
                          const hasShift = dist > 20;

                          return (
                            <tr key={c.id} className="hover:bg-slate-950/60 transition">
                              <td className="py-3 px-3 font-semibold text-slate-200">
                                {c.role} ({c.name})
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-slate-300">
                                <button
                                  onClick={() => copyToClipboard(c.hex)}
                                  className="hover:text-indigo-400 transition inline-flex items-center space-x-1"
                                >
                                  <span>{c.hex}</span>
                                </button>
                              </td>
                              <td className="py-3 px-3">
                                <div className="w-10 h-6 rounded-md border border-white/20 shadow-xs" style={{ backgroundColor: c.hex }} />
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-amber-300">
                                <button
                                  onClick={() => copyToClipboard(simHex)}
                                  className="hover:text-amber-200 transition inline-flex items-center space-x-1"
                                >
                                  <span>{simHex}</span>
                                  {copiedHex === simHex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                                </button>
                              </td>
                              <td className="py-3 px-3">
                                <div className="w-10 h-6 rounded-md border border-white/20 shadow-xs" style={{ backgroundColor: simHex }} />
                              </td>
                              <td className="py-3 px-3">
                                {hasShift ? (
                                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>ΔE {Math.round(dist)} Shift</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Minimal Shift</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Accessibility Advisory Checklist */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <h5 className="font-bold text-sm text-white flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-400" />
                    <span>Best Practices for Inclusive Color Design</span>
                  </h5>

                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                    <li>
                      <strong className="text-slate-100">Don't rely solely on color to convey meaning:</strong> Always complement color indicators (like red for error or green for success) with text labels, icons (e.g. checkmarks/warning signs), or distinct visual hatch patterns.
                    </li>
                    <li>
                      <strong className="text-slate-100">Ensure high WCAG luminance contrast:</strong> Color blind users still perceive lightness and luminance contrast effectively. Maintain a minimum contrast ratio of 4.5:1 for body text regardless of hue.
                    </li>
                    <li>
                      <strong className="text-slate-100">Avoid pairing red and green side-by-side:</strong> Under both Protanopia and Deuteranopia (~7% of males), red and green hues can flatten into identical muted yellowish-gray tones.
                    </li>
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
