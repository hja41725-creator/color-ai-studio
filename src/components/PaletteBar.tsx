import React, { useState } from 'react';
import { ColorItem, Palette, ColorRole } from '../types';
import { isLightColor } from '../utils/colorUtils';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Undo2
} from 'lucide-react';

interface PaletteBarProps {
  palette: Palette;
  onToggleLock: (id: string) => void;
  onSelectColor: (color: ColorItem) => void;
  onMoveColor: (fromIdx: number, toIdx: number) => void;
  onUpdateRole: (id: string, role: ColorRole) => void;
  onSavePalette: () => void;
  isSaved: boolean;
  onGenerateAI: () => void;
  onUndo: () => void;
  historyCount: number;
}

export const PaletteBar: React.FC<PaletteBarProps> = ({
  palette,
  onToggleLock,
  onSelectColor,
  onMoveColor,
  onUpdateRole,
  onSavePalette,
  isSaved,
  onGenerateAI,
  onUndo,
  historyCount,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const roleOptions: ColorRole[] = [
    'Primary',
    'Secondary',
    'Accent',
    'Background',
    'Surface',
    'Text',
    'Highlight',
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white p-4 sm:p-6 transition-all">
      {/* Top Meta Info Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">{palette.title}</h2>
            {palette.harmonyType && (
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-medium">
                {palette.harmonyType}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{palette.description}</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onUndo}
            disabled={historyCount === 0}
            title={historyCount > 0 ? `Undo previous palette state (${historyCount} in history stack)` : 'Undo stack is empty'}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition active:scale-95 ${
              historyCount > 0
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-pointer'
                : 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-40'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Undo</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 font-extrabold rounded-full border border-amber-500/30">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onSavePalette}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isSaved
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved in Vault</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Save Palette</span>
              </>
            )}
          </button>

          <button
            onClick={onGenerateAI}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Regenerate</span>
          </button>
        </div>
      </div>

      {/* Main Color Stripes */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {palette.colors.map((color, idx) => {
          const isLight = isLightColor(color.hex);
          const textColorClass = isLight ? 'text-slate-900' : 'text-white';
          const mutedTextClass = isLight ? 'text-slate-700/80' : 'text-slate-200/80';
          const buttonBgClass = isLight
            ? 'bg-black/10 hover:bg-black/20 text-slate-900 border-black/10'
            : 'bg-white/10 hover:bg-white/20 text-white border-white/10';

          return (
            <div
              key={color.id}
              onClick={() => onSelectColor(color)}
              style={{ backgroundColor: color.hex }}
              className="group relative h-48 sm:h-64 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-black/10 overflow-hidden"
            >
              {/* Top Control Bar inside color card */}
              <div className="flex items-center justify-between z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(color.id);
                  }}
                  title={color.locked ? 'Unlock color' : 'Lock color'}
                  className={`p-2 rounded-xl backdrop-blur-md border transition ${buttonBgClass}`}
                >
                  {color.locked ? (
                    <Lock className="w-4 h-4 text-amber-400 font-bold" />
                  ) : (
                    <Unlock className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  )}
                </button>

                {/* Move left / right buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveColor(idx, idx - 1);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md border ${buttonBgClass}`}
                      title="Move left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {idx < palette.colors.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveColor(idx, idx + 1);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md border ${buttonBgClass}`}
                      title="Move right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Color Info */}
              <div className="z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                    {color.name}
                  </span>

                  {/* Role Selector */}
                  <select
                    value={color.role}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdateRole(color.id, e.target.value as ColorRole);
                    }}
                    className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md backdrop-blur-md border cursor-pointer ${buttonBgClass}`}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role} className="bg-slate-900 text-white">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* HEX display with instant copy */}
                <div className="flex items-center justify-between">
                  <span className={`text-xl sm:text-2xl font-extrabold tracking-tight font-mono ${textColorClass}`}>
                    {color.hex.toUpperCase()}
                  </span>

                  <button
                    onClick={(e) => handleCopy(color.hex, e)}
                    className={`p-2 rounded-xl backdrop-blur-md border transition active:scale-95 ${buttonBgClass}`}
                    title="Copy HEX code"
                  >
                    {copiedHex === color.hex ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
