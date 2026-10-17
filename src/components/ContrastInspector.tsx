import React, { useState } from 'react';
import { Palette, ColorItem } from '../types';
import { evaluateContrast } from '../utils/colorUtils';
import { Eye, Check, X, Wand2, RefreshCw, AlertTriangle } from 'lucide-react';

interface ContrastInspectorProps {
  palette: Palette;
  onUpdateColor: (id: string, newHex: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ContrastInspector: React.FC<ContrastInspectorProps> = ({
  palette,
  onUpdateColor,
  isLoading,
  setIsLoading,
}) => {
  const [fgId, setFgId] = useState<string>(palette.colors[0]?.id || '');
  const [bgId, setBgId] = useState<string>(palette.colors[palette.colors.length - 1]?.id || '');
  const [optimizedData, setOptimizedData] = useState<any | null>(null);

  const fgColor = palette.colors.find((c) => c.id === fgId) || palette.colors[0] || { hex: '#FFFFFF', name: 'Text', id: '1' };
  const bgColor = palette.colors.find((c) => c.id === bgId) || palette.colors[palette.colors.length - 1] || { hex: '#0F172A', name: 'Bg', id: '2' };

  const contrastInfo = evaluateContrast(fgColor.hex, bgColor.hex, fgColor.name, bgColor.name);

  const handleOptimizeAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/palette/optimize-contrast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textColor: fgColor.hex,
          bgColor: bgColor.hex,
          targetRatio: 4.5,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setOptimizedData(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyOptimization = () => {
    if (!optimizedData) return;
    if (optimizedData.adjustedTextColor) {
      onUpdateColor(fgColor.id, optimizedData.adjustedTextColor);
    }
    if (optimizedData.adjustedBgColor) {
      onUpdateColor(bgColor.id, optimizedData.adjustedBgColor);
    }
    setOptimizedData(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Selector & Live Typography Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
          <Eye className="w-4 h-4" />
          <span>WCAG 2.1 Color Accessibility Inspector</span>
        </div>

        {/* Color Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Text Color (Foreground)</label>
            <select
              value={fgId}
              onChange={(e) => setFgId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
            >
              {palette.colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hex})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Background Color</label>
            <select
              value={bgId}
              onChange={(e) => setBgId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
            >
              {palette.colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hex})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Rendering Canvas */}
        <div
          style={{ backgroundColor: bgColor.hex, color: fgColor.hex }}
          className="rounded-xl p-6 space-y-3 transition-colors duration-200 border border-black/10 shadow-inner"
        >
          <h3 className="text-2xl font-black">Headline Text Sample</h3>
          <p className="text-sm font-normal leading-relaxed">
            Body text readability is crucial for UI design accessibility. According to WCAG guidelines, standard text requires a contrast ratio of at least 4.5:1.
          </p>
          <button
            style={{ backgroundColor: fgColor.hex, color: bgColor.hex }}
            className="px-4 py-2 rounded-lg text-xs font-bold shadow-md"
          >
            Sample Button Control
          </button>
        </div>
      </div>

      {/* WCAG Pass/Fail Matrix & AI Auto-Fix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Contrast Score Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contrast Ratio</span>
              <p className="text-4xl font-extrabold text-white mt-1">{contrastInfo.ratio} : 1</p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                  contrastInfo.wcagAA
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {contrastInfo.wcagAA ? 'WCAG AA Passed' : 'WCAG AA Failed'}
              </span>
            </div>
          </div>

          {/* Test Matrix */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className={`p-3 rounded-xl border ${contrastInfo.wcagAA ? 'bg-slate-950 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-rose-500/30 text-rose-400'}`}>
              <span className="text-[10px] font-bold block opacity-80">AA Normal Text (4.5:1)</span>
              {contrastInfo.wcagAA ? <Check className="w-5 h-5 mx-auto mt-1" /> : <X className="w-5 h-5 mx-auto mt-1" />}
            </div>

            <div className={`p-3 rounded-xl border ${contrastInfo.wcagAALarge ? 'bg-slate-950 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-rose-500/30 text-rose-400'}`}>
              <span className="text-[10px] font-bold block opacity-80">AA Large Text (3.0:1)</span>
              {contrastInfo.wcagAALarge ? <Check className="w-5 h-5 mx-auto mt-1" /> : <X className="w-5 h-5 mx-auto mt-1" />}
            </div>

            <div className={`p-3 rounded-xl border ${contrastInfo.wcagAAA ? 'bg-slate-950 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-rose-500/30 text-rose-400'}`}>
              <span className="text-[10px] font-bold block opacity-80">AAA Enhanced (7.0:1)</span>
              {contrastInfo.wcagAAA ? <Check className="w-5 h-5 mx-auto mt-1" /> : <X className="w-5 h-5 mx-auto mt-1" />}
            </div>
          </div>

          {/* AI Auto-Optimizer */}
          {!contrastInfo.wcagAA && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Contrast Detected</span>
              </div>
              <p className="text-xs text-amber-200/80">
                This combination may cause legibility issues for visually impaired users. Click below to auto-optimize hex values while preserving hue.
              </p>

              <button
                onClick={handleOptimizeAI}
                disabled={isLoading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition flex items-center justify-center space-x-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>Auto-Adjust Contrast with AI</span>
              </button>
            </div>
          )}

          {/* Optimized Proposal Result */}
          {optimizedData && (
            <div className="bg-slate-950 border border-indigo-500/40 p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold text-indigo-400">AI Proposed Compliant Values</span>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Text: {optimizedData.adjustedTextColor}</span>
                <span>Bg: {optimizedData.adjustedBgColor}</span>
                <span className="font-bold text-emerald-400">{optimizedData.achievedContrastRatio}:1</span>
              </div>
              <p className="text-xs text-slate-400">{optimizedData.explanation}</p>
              <button
                onClick={applyOptimization}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs"
              >
                Apply Corrected Colors to Palette
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
