import React from 'react';
import { Palette } from '../types';
import { Bookmark, Trash2, ArrowUpRight } from 'lucide-react';

interface PaletteVaultProps {
  savedPalettes: Palette[];
  onSelectPalette: (palette: Palette) => void;
  onDeletePalette: (id: string) => void;
}

export const PaletteVault: React.FC<PaletteVaultProps> = ({
  savedPalettes,
  onSelectPalette,
  onDeletePalette,
}) => {
  if (savedPalettes.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">Your Vault is Empty</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Save your favorite generated or edited palettes to access and export them anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Saved Palettes Vault ({savedPalettes.length})</h3>
        <span className="text-xs text-slate-400">Stored locally in browser state</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedPalettes.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-indigo-500/50 transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onSelectPalette(p)}
                  className="p-1.5 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-lg text-xs transition"
                  title="Load Palette"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeletePalette(p.id)}
                  className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs transition"
                  title="Delete Palette"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

            {/* Colors stripe */}
            <div className="flex h-8 rounded-lg overflow-hidden border border-black/20">
              {p.colors.map((c) => (
                <div key={c.id} style={{ backgroundColor: c.hex }} className="flex-1 h-full" title={`${c.name} (${c.hex})`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
