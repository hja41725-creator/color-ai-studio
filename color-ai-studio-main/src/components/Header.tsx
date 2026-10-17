import React, { useState } from 'react';
import { GoogleUser, ActiveTab, Palette } from '../types';
import { generateShareableUrl } from '../utils/colorUtils';
import {
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Layout,
  Eye,
  Layers,
  Glasses,
  Bookmark,
  Share2,
  Shuffle,
  Paintbrush,
  Undo2,
  Check,
  Download,
  Clock,
  User,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  palette: Palette;
  onRandomize: () => void;
  onOpenExport: () => void;
  onOpenShareModal?: () => void;
  savedCount: number;
  onUndo: () => void;
  historyCount: number;
  googleUser: GoogleUser | null;
  onOpenGoogleAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  palette,
  onRandomize,
  onOpenExport,
  onOpenShareModal,
  savedCount,
  onUndo,
  historyCount,
  googleUser,
  onOpenGoogleAuth,
}) => {
  const [isShareCopied, setIsShareCopied] = useState(false);

  const handleShareUrl = () => {
    const shareUrl = generateShareableUrl(palette, 'compact');
    navigator.clipboard.writeText(shareUrl);
    setIsShareCopied(true);
    setTimeout(() => setIsShareCopied(false), 2200);
    if (onOpenShareModal) {
      onOpenShareModal();
    }
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'generator', label: 'AI Generator', icon: Sparkles },
    { id: 'harmony', label: 'Theory & Edit', icon: Sliders },
    { id: 'clockWheel', label: 'Clock Wheel & Philosophy', icon: Clock },
    { id: 'image', label: 'Image Vision', icon: ImageIcon },
    { id: 'preview', label: 'Live UI Preview', icon: Layout },
    { id: 'contrast', label: 'Contrast & WCAG', icon: Eye },
    { id: 'shades', label: 'Gradients & Glass', icon: Layers },
    { id: 'simulator', label: 'Vision Simulator', icon: Glasses },
    { id: 'vault', label: `Saved Vault (${savedCount})`, icon: Bookmark },
    { id: 'profile', label: 'User Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Paintbrush className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Color AI
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {palette.title} • {palette.colors.length} Colors
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onUndo}
              disabled={historyCount === 0}
              title={historyCount > 0 ? `Undo last palette state (${historyCount} in stack, Ctrl+Z)` : 'Undo stack empty'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border active:scale-95 ${
                historyCount > 0
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-pointer shadow-xs'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800/60 cursor-not-allowed opacity-50'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Undo</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 font-extrabold rounded-full border border-amber-500/30">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={onRandomize}
              title="Shuffle unlocked colors"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition border border-slate-700/60 active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            <button
              onClick={handleShareUrl}
              title="Generate unique shareable URL and copy to clipboard"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border active:scale-95 ${
                isShareCopied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60'
              }`}
            >
              {isShareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-xs font-medium shadow-md shadow-indigo-500/20 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Google Login Badge */}
            {googleUser ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-2 space-x-reverse px-2.5 py-1 bg-slate-950 border border-emerald-500/40 hover:border-emerald-500/80 rounded-xl text-xs transition shadow-sm cursor-pointer"
                title={`مسجل كـ: ${googleUser.name} (${googleUser.email})`}
              >
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-emerald-400/60"
                />
                <span className="text-emerald-300 font-semibold text-[11px] hidden md:inline truncate max-w-[90px]">
                  {googleUser.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            ) : (
              <button
                onClick={onOpenGoogleAuth}
                className="flex items-center space-x-1.5 space-x-reverse px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold transition shadow-md active:scale-95 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>دخول Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
