import React, { useState, useEffect } from 'react';
import { Palette, ColorItem, ActiveTab, UsedColor, UserProfileData, GoogleUser } from './types';
import { PRESET_PALETTES } from './data/presetPalettes';
import { parsePaletteFromUrl } from './utils/colorUtils';
import { safeStorage } from './utils/safeStorage';
import { Header } from './components/Header';
import { PaletteBar } from './components/PaletteBar';
import { AIPaletteGenerator } from './components/AIPaletteGenerator';
import { ColorTheoryEditor } from './components/ColorTheoryEditor';
import { ClockColorWheel } from './components/ClockColorWheel';
import { ImageVisionExtractor } from './components/ImageVisionExtractor';
import { LiveUIPreview } from './components/LiveUIPreview';
import { ContrastInspector } from './components/ContrastInspector';
import { ShadesGradients } from './components/ShadesGradients';
import { VisionSimulator } from './components/VisionSimulator';
import { PaletteVault } from './components/PaletteVault';
import { UserProfile } from './components/UserProfile';
import { ExportModal } from './components/ExportModal';
import { ShareModal } from './components/ShareModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [palette, setPalette] = useState<Palette>(() => {
    const shared = parsePaletteFromUrl();
    return shared || PRESET_PALETTES[0];
  });
  const [paletteHistory, setPaletteHistory] = useState<Palette[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorItem>(() => {
    const shared = parsePaletteFromUrl();
    return shared && shared.colors.length > 0 ? shared.colors[0] : PRESET_PALETTES[0].colors[0];
  });
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>(() => {
    try {
      const stored = safeStorage.getItem('color_ai_vault');
      return stored ? JSON.parse(stored) : PRESET_PALETTES;
    } catch {
      return PRESET_PALETTES;
    }
  });

  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const stored = safeStorage.getItem('color_ai_google_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    try {
      const storedProfile = safeStorage.getItem('color_ai_user_profile');
      if (storedProfile) return JSON.parse(storedProfile);

      const storedGoogle = safeStorage.getItem('color_ai_google_user');
      const parsedGoogle = storedGoogle ? JSON.parse(storedGoogle) : null;

      return {
        name: parsedGoogle ? parsedGoogle.name : 'مصمم الألوان المبدع',
        title: 'UI/UX & Palette Architect',
        bio: 'مهتم بتصميم الهويات المبتكرة، واجهات المستخدم، وفلسفة وتناسق الألوان الذكية.',
        favoriteColorHex: '#4F46E5',
        avatarUrl: parsedGoogle ? parsedGoogle.picture : undefined,
      };
    } catch {
      return {
        name: 'مصمم الألوان المبدع',
        title: 'UI/UX & Palette Architect',
        bio: 'مهتم بتصميم الهويات المبتكرة، واجهات المستخدم، وفلسفة وتناسق الألوان الذكية.',
        favoriteColorHex: '#4F46E5',
      };
    }
  });

  const [usedColorsHistory, setUsedColorsHistory] = useState<UsedColor[]>(() => {
    try {
      const stored = safeStorage.getItem('color_ai_used_colors');
      if (stored) return JSON.parse(stored);

      const initialColors = PRESET_PALETTES[0].colors;
      return initialColors.map((c, i) => ({
        id: `used-init-${i}`,
        hex: c.hex,
        name: c.name,
        role: c.role,
        paletteTitle: PRESET_PALETTES[0].title,
        timestamp: Date.now() - i * 60000,
        useCount: 1,
      }));
    } catch {
      return [];
    }
  });

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    safeStorage.setItem('color_ai_vault', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  useEffect(() => {
    safeStorage.setItem('color_ai_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    safeStorage.setItem('color_ai_used_colors', JSON.stringify(usedColorsHistory));
  }, [usedColorsHistory]);

  // Log active colors into used colors history whenever palette changes
  useEffect(() => {
    if (!palette || !palette.colors) return;
    setUsedColorsHistory((prev) => {
      let updated = [...prev];
      palette.colors.forEach((c) => {
        const existingIdx = updated.findIndex((u) => u.hex.toLowerCase() === c.hex.toLowerCase());
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            useCount: updated[existingIdx].useCount + 1,
            timestamp: Date.now(),
            name: c.name || updated[existingIdx].name,
            role: c.role || updated[existingIdx].role,
            paletteTitle: palette.title,
          };
        } else {
          updated.unshift({
            id: `used-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            hex: c.hex,
            name: c.name,
            role: c.role,
            paletteTitle: palette.title,
            timestamp: Date.now(),
            useCount: 1,
          });
        }
      });
      return updated.slice(0, 120);
    });
  }, [palette.colors]);

  // Helper to push current state onto history stack (max 10) before applying palette changes
  const updatePalette = (newPaletteOrFn: Palette | ((prev: Palette) => Palette)) => {
    setPalette((prevPalette) => {
      const nextPalette = typeof newPaletteOrFn === 'function' ? newPaletteOrFn(prevPalette) : newPaletteOrFn;
      if (JSON.stringify(prevPalette.colors) !== JSON.stringify(nextPalette.colors)) {
        setPaletteHistory((prevHistory) => {
          const updated = [...prevHistory, prevPalette];
          return updated.length > 10 ? updated.slice(updated.length - 10) : updated;
        });
      }
      return nextPalette;
    });
  };

  const handleUndo = () => {
    if (paletteHistory.length === 0) return;

    setPaletteHistory((prevHistory) => {
      const updated = [...prevHistory];
      const previousState = updated.pop();
      if (previousState) {
        setPalette(previousState);
        if (previousState.colors.length > 0) {
          const existing = previousState.colors.find((c) => c.id === selectedColor.id);
          setSelectedColor(existing || previousState.colors[0]);
        }
      }
      return updated;
    });
  };

  // Keyboard shortcut Ctrl+Z / Cmd+Z for undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          (activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'TEXTAREA' ||
            activeEl.tagName === 'SELECT' ||
            (activeEl as HTMLElement).isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paletteHistory, selectedColor]);

  const handleToggleLock = (id: string) => {
    updatePalette((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c)),
    }));
  };

  const handleMoveColor = (fromIdx: number, toIdx: number) => {
    const updated = [...palette.colors];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    updatePalette((prev) => ({ ...prev, colors: updated }));
  };

  const handleUpdateRole = (id: string, role: ColorItem['role']) => {
    updatePalette((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => (c.id === id ? { ...c, role } : c)),
    }));
  };

  const handleUpdateSelectedColor = (updated: ColorItem) => {
    setSelectedColor(updated);
    updatePalette((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const handleUpdateColorHex = (id: string, newHex: string) => {
    updatePalette((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => (c.id === id ? { ...c, hex: newHex } : c)),
    }));
  };

  const handleSavePalette = () => {
    if (savedPalettes.some((p) => p.id === palette.id)) {
      setSavedPalettes((prev) => prev.filter((p) => p.id !== palette.id));
    } else {
      setSavedPalettes((prev) => [palette, ...prev]);
    }
  };

  const handleRandomizeUnlocked = () => {
    const randomHex = () =>
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase();

    updatePalette((prev) => ({
      ...prev,
      title: 'Shuffled Palette',
      colors: prev.colors.map((c) => (c.locked ? c : { ...c, hex: randomHex() })),
    }));
  };

  const handleGoogleLoginSuccess = (user: GoogleUser) => {
    setGoogleUser(user);
    setIsGoogleAuthOpen(false);
    safeStorage.setItem('color_ai_google_user', JSON.stringify(user));
    setUserProfile((prev) => ({
      ...prev,
      name: user.name,
      avatarUrl: user.picture,
    }));
  };

  const handleGoogleLogout = () => {
    setGoogleUser(null);
    safeStorage.removeItem('color_ai_google_user');
  };

  const isSaved = savedPalettes.some((p) => p.id === palette.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          palette={palette}
          onRandomize={handleRandomizeUnlocked}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenShareModal={() => setIsShareOpen(true)}
          savedCount={savedPalettes.length}
          onUndo={handleUndo}
          historyCount={paletteHistory.length}
          googleUser={googleUser}
          onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        />

        {/* Global Interactive Palette Bar */}
        <PaletteBar
          palette={palette}
          onToggleLock={handleToggleLock}
          onSelectColor={(color) => {
            setSelectedColor(color);
            if (activeTab === 'generator') setActiveTab('harmony');
          }}
          onMoveColor={handleMoveColor}
          onUpdateRole={handleUpdateRole}
          onSavePalette={handleSavePalette}
          isSaved={isSaved}
          onGenerateAI={() => setActiveTab('generator')}
          onUndo={handleUndo}
          historyCount={paletteHistory.length}
        />

        {/* Tab Content Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'generator' && (
            <AIPaletteGenerator
              currentPalette={palette}
              onApplyPalette={(newP) => {
                updatePalette(newP);
                if (newP.colors[0]) setSelectedColor(newP.colors[0]);
              }}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {activeTab === 'harmony' && (
            <ColorTheoryEditor
              palette={palette}
              onApplyPalette={(newP) => {
                updatePalette(newP);
                if (newP.colors[0]) setSelectedColor(newP.colors[0]);
              }}
              selectedColor={selectedColor}
              onUpdateSelectedColor={handleUpdateSelectedColor}
            />
          )}

          {activeTab === 'clockWheel' && (
            <ClockColorWheel
              palette={palette}
              onApplyPalette={(newP) => {
                updatePalette(newP);
                if (newP.colors[0]) setSelectedColor(newP.colors[0]);
              }}
              selectedColor={selectedColor}
              onUpdateSelectedColor={handleUpdateSelectedColor}
            />
          )}

          {activeTab === 'image' && (
            <ImageVisionExtractor
              onApplyPalette={(newP) => {
                updatePalette(newP);
                if (newP.colors[0]) setSelectedColor(newP.colors[0]);
              }}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {activeTab === 'preview' && <LiveUIPreview palette={palette} />}

          {activeTab === 'contrast' && (
            <ContrastInspector
              palette={palette}
              onUpdateColor={handleUpdateColorHex}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {activeTab === 'shades' && <ShadesGradients palette={palette} selectedColor={selectedColor} />}

          {activeTab === 'simulator' && <VisionSimulator palette={palette} />}

          {activeTab === 'vault' && (
            <PaletteVault
              savedPalettes={savedPalettes}
              onSelectPalette={(p) => {
                updatePalette(p);
                if (p.colors[0]) setSelectedColor(p.colors[0]);
              }}
              onDeletePalette={(id) => setSavedPalettes((prev) => prev.filter((p) => p.id !== id))}
            />
          )}

          {activeTab === 'profile' && (
            <UserProfile
              palette={palette}
              onApplyPalette={(newP) => {
                updatePalette(newP);
                if (newP.colors[0]) setSelectedColor(newP.colors[0]);
              }}
              selectedColor={selectedColor}
              onUpdateSelectedColor={handleUpdateSelectedColor}
              savedPalettes={savedPalettes}
              usedColorsHistory={usedColorsHistory}
              onClearUsedColorsHistory={() => setUsedColorsHistory([])}
              onRemoveUsedColor={(id) => setUsedColorsHistory((prev) => prev.filter((c) => c.id !== id))}
              userProfile={userProfile}
              onUpdateUserProfile={setUserProfile}
              googleUser={googleUser}
              onLoginGoogle={() => setIsGoogleAuthOpen(true)}
              onLogoutGoogle={handleGoogleLogout}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Color AI Studio • Powered by Gemini 3.6 Flash & Web Color Intelligence</p>
      </footer>

      {/* Export, Share & Google Auth Modals */}
      {isExportOpen && <ExportModal palette={palette} onClose={() => setIsExportOpen(false)} />}
      <ShareModal palette={palette} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onLoginSuccess={handleGoogleLoginSuccess}
        onCloseGuest={() => setIsGoogleAuthOpen(false)}
      />
      <Analytics />
    </div>
  );
}
