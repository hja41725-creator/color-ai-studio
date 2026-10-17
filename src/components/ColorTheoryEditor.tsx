import React from 'react';
import { Palette, ColorItem } from '../types';
import { generateMathematicalHarmony, hexToRgb, rgbToHsl, hslToHex, rgbToCmyk } from '../utils/colorUtils';
import { getColorPhilosophy } from '../data/colorPhilosophyData';
import { Sliders, RotateCcw, Palette as PaletteIcon, BookOpen } from 'lucide-react';

interface ColorTheoryEditorProps {
  palette: Palette;
  onApplyPalette: (palette: Palette) => void;
  selectedColor: ColorItem;
  onUpdateSelectedColor: (color: ColorItem) => void;
}

export const ColorTheoryEditor: React.FC<ColorTheoryEditorProps> = ({
  palette,
  onApplyPalette,
  selectedColor,
  onUpdateSelectedColor,
}) => {
  const harmonies: ('Analogous' | 'Complementary' | 'Triadic' | 'Split-Complementary' | 'Monochromatic')[] = [
    'Analogous',
    'Complementary',
    'Triadic',
    'Split-Complementary',
    'Monochromatic',
  ];

  const handleApplyHarmony = (harmonyType: 'Analogous' | 'Complementary' | 'Triadic' | 'Split-Complementary' | 'Monochromatic') => {
    const newColors = generateMathematicalHarmony(selectedColor.hex, harmonyType);
    const updatedPalette: Palette = {
      ...palette,
      title: `${selectedColor.name} ${harmonyType}`,
      harmonyType,
      colors: newColors,
    };
    onApplyPalette(updatedPalette);
  };

  const rgb = hexToRgb(selectedColor.hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const handleHslChange = (h: number, s: number, l: number) => {
    const newHex = hslToHex(h, s, l);
    onUpdateSelectedColor({
      ...selectedColor,
      hex: newHex,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Active Selected Color Editor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
          <Sliders className="w-4 h-4" />
          <span>Single Color Fine-Tuner</span>
        </div>

        {/* Selected Color Visual Sample */}
        <div
          style={{ backgroundColor: selectedColor.hex }}
          className="h-32 rounded-xl border border-black/20 shadow-inner p-4 flex flex-col justify-between"
        >
          <span className="text-xs font-semibold px-2 py-1 rounded bg-black/30 text-white w-max backdrop-blur-md">
            {selectedColor.role}
          </span>
          <div className="bg-slate-950/80 backdrop-blur-md p-2 rounded-lg text-white">
            <p className="font-bold text-sm">{selectedColor.name}</p>
            <p className="text-xs font-mono text-slate-300">{selectedColor.hex.toUpperCase()}</p>
          </div>
        </div>

        {/* Color Value Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Color Name</label>
            <input
              type="text"
              value={selectedColor.name}
              onChange={(e) => onUpdateSelectedColor({ ...selectedColor, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg p-2 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">HEX Code</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedColor.hex}
                onChange={(e) => onUpdateSelectedColor({ ...selectedColor, hex: e.target.value.toUpperCase() })}
                className="w-10 h-9 bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={selectedColor.hex}
                onChange={(e) => onUpdateSelectedColor({ ...selectedColor, hex: e.target.value.toUpperCase() })}
                className="flex-1 bg-slate-950 border border-slate-800 text-white font-mono text-xs rounded-lg p-2 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* HSL Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Hue ({hsl.h}°)</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => handleHslChange(Number(e.target.value), hsl.s, hsl.l)}
                className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Saturation ({hsl.s}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => handleHslChange(hsl.h, Number(e.target.value), hsl.l)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Lightness ({hsl.l}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => handleHslChange(hsl.h, hsl.s, Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Technical Values (CMYK / RGB) */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
              <span className="font-semibold text-slate-200">RGB:</span> {rgb.r}, {rgb.g}, {rgb.b}
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
              <span className="font-semibold text-slate-200">CMYK:</span> {cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%
            </div>
          </div>

          {/* Color Philosophy Card */}
          {(() => {
            const philosophy = getColorPhilosophy(selectedColor.hex);
            return (
              <div className="pt-3 border-t border-slate-800 space-y-2 text-right" dir="rtl">
                <div className="flex items-center space-x-1.5 space-x-reverse text-amber-400 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>فلسفة وسيكولوجية {selectedColor.name}:</span>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-indigo-300 font-bold">{philosophy.titleAr}</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                      {philosophy.tempCategory}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed pt-1">{philosophy.psychologyAr}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Right: Mathematical Harmony Preset Generator */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
            <PaletteIcon className="w-4 h-4" />
            <span>Mathematical Color Harmonies (Based on {selectedColor.name})</span>
          </div>
          <span className="text-xs text-slate-400">Click harmony to recalculate entire palette</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {harmonies.map((type) => {
            const previewColors = generateMathematicalHarmony(selectedColor.hex, type);
            return (
              <div
                key={type}
                onClick={() => handleApplyHarmony(type)}
                className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400">{type}</h4>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase">Apply Scheme</span>
                </div>
                <div className="flex h-10 rounded-lg overflow-hidden border border-black/20 shadow-inner">
                  {previewColors.map((c, i) => (
                    <div key={i} style={{ backgroundColor: c.hex }} className="flex-1 h-full" title={c.hex} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
