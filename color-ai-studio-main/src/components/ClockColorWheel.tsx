import React, { useState, useRef, useEffect } from 'react';
import { Palette, ColorItem } from '../types';
import {
  CLOCK_HOURS_HUES,
  WARM_COLORS,
  COOL_COLORS,
  getColorPhilosophy,
  WarmCoolColor,
} from '../data/colorPhilosophyData';
import { hexToRgb, rgbToHsl, hslToHex } from '../utils/colorUtils';
import {
  Clock,
  Flame,
  Snowflake,
  Sparkles,
  Info,
  Check,
  Plus,
  Compass,
  Zap,
  BookOpen,
} from 'lucide-react';

interface ClockColorWheelProps {
  palette: Palette;
  onApplyPalette: (palette: Palette) => void;
  selectedColor: ColorItem;
  onUpdateSelectedColor: (color: ColorItem) => void;
}

export const ClockColorWheel: React.FC<ClockColorWheelProps> = ({
  palette,
  onApplyPalette,
  selectedColor,
  onUpdateSelectedColor,
}) => {
  const [activeTab, setActiveTab] = useState<'wheel' | 'warm' | 'cool'>('wheel');
  const [currentHex, setCurrentHex] = useState<string>(selectedColor.hex);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Derive Hue from currentHex
  const rgb = hexToRgb(currentHex);
  const { h: currentHue, s: currentSat, l: currentLight } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Convert Hue (0-360) to clock angle (where 12 o'clock = 0 deg / top = -90deg in SVG space)
  // Clock angle: 0deg = top (12 o'clock). 90deg = right (3 o'clock). 180deg = bottom (6 o'clock). 270deg = left (9 o'clock).
  const clockHandAngle = currentHue;

  // Calculate corresponding hour integer (12 to 11)
  const calculateHourFromAngle = (deg: number): number => {
    const normalized = (deg % 360 + 360) % 360;
    const hour = Math.round(normalized / 30);
    return hour === 0 ? 12 : hour;
  };

  const currentHour = calculateHourFromAngle(clockHandAngle);
  const philosophy = getColorPhilosophy(currentHex);

  // Sync internal hex with selectedColor when selectedColor changes externally
  useEffect(() => {
    if (selectedColor.hex && selectedColor.hex !== currentHex) {
      setCurrentHex(selectedColor.hex);
    }
  }, [selectedColor.hex]);

  // Handle angle calculation from pointer event on clock face
  const handlePointerAngle = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Math.atan2 returns angle in radians from positive X axis (3 o'clock).
    // Convert to degrees where 12 o'clock is 0 deg.
    let angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * (180 / Math.PI)) + 90; // Rotate so top is 0 deg
    if (angleDeg < 0) angleDeg += 360;

    const roundedHue = Math.round(angleDeg);
    const newHex = hslToHex(roundedHue, Math.max(70, currentSat), Math.max(45, Math.min(55, currentLight)));
    setCurrentHex(newHex);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handlePointerAngle(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handlePointerAngle(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSelectPresetHour = (hour: number, hue: number, hex: string) => {
    setCurrentHex(hex);
  };

  const handleSelectSwatch = (color: WarmCoolColor) => {
    setCurrentHex(color.hex);
  };

  const handleApplyToActiveColor = () => {
    onUpdateSelectedColor({
      ...selectedColor,
      hex: currentHex,
      explanation: philosophy.psychologyAr,
    });
  };

  const handleApplyClockPalette = () => {
    // Generate 5 harmonious clock-based colors starting from current hue
    const angles = [0, 30, 120, 210, 240]; // 12h, 1h, 4h, 7h, 8h on clock
    const roles: ('Primary' | 'Secondary' | 'Accent' | 'Background' | 'Surface')[] = [
      'Primary',
      'Secondary',
      'Accent',
      'Background',
      'Surface',
    ];

    const newColors: ColorItem[] = angles.map((offset, i) => {
      const targetH = (currentHue + offset) % 360;
      const targetSat = i === 3 ? 20 : i === 4 ? 15 : 85;
      const targetLight = i === 3 ? 95 : i === 4 ? 12 : 50;
      const hex = hslToHex(targetH, targetSat, targetLight);
      const phil = getColorPhilosophy(hex);
      return {
        id: `clock-col-${i}-${Date.now()}`,
        hex,
        name: phil.colorFamily,
        role: roles[i],
        explanation: phil.psychologyAr,
        locked: false,
      };
    });

    onApplyPalette({
      ...palette,
      title: `${philosophy.colorFamily} (عجلة الساعة)`,
      harmonyType: 'Clock Dial Harmony',
      colors: newColors,
    });
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-6 text-slate-100 dir-rtl" dir="rtl">
      {/* Top Banner Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 space-x-reverse text-amber-400 font-bold text-base sm:text-lg">
              <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
              <span>عجلة الألوان التفاعلية وفلسفة الألوان (Clock Wheel & Philosophy)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              استكشف الألوان كعقارب الساعة مع تقسيم الألوان الحارة والباردة والتعرف على الفلسفة والسيكولوجية العميقة لكل لون
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center space-x-2 space-x-reverse bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('wheel')}
              className={`flex items-center space-x-1.5 space-x-reverse px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'wheel'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>عجلة الساعة</span>
            </button>

            <button
              onClick={() => setActiveTab('warm')}
              className={`flex items-center space-x-1.5 space-x-reverse px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'warm'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>الألوان الحارة ({WARM_COLORS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cool')}
              className={`flex items-center space-x-1.5 space-x-reverse px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'cool'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Snowflake className="w-4 h-4 text-cyan-300" />
              <span>الألوان الباردة ({COOL_COLORS.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Controls & Philosophy Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Clock Wheel or Warm/Cool Palette Collections */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {activeTab === 'wheel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 space-x-reverse text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>عقارب الساعة التفاعلية (12 ساعة = 360 درجة لونية)</span>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-mono">
                  الساعة {currentHour}:00 ({currentHue}°)
                </span>
              </div>

              {/* Interactive Clock Canvas Container */}
              <div className="flex flex-col items-center justify-center py-4">
                <div
                  ref={wheelRef}
                  onMouseDown={handleMouseDown}
                  className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-slate-800 shadow-2xl cursor-pointer select-none touch-none p-2"
                  style={{
                    background: `conic-gradient(
                      from 0deg,
                      #ef4444 0deg,
                      #f97316 30deg,
                      #eab308 60deg,
                      #84cc16 90deg,
                      #10b981 120deg,
                      #14b8a6 150deg,
                      #06b6d4 180deg,
                      #0284c7 210deg,
                      #3b82f6 240deg,
                      #6366f1 270deg,
                      #a855f7 300deg,
                      #ec4899 330deg,
                      #ef4444 360deg
                    )`,
                  }}
                >
                  {/* Inner Clock Face Shadow & Dial Ring */}
                  <div className="absolute inset-4 rounded-full bg-slate-950/40 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                    {/* Clock Hour Numbers (12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11) */}
                    {CLOCK_HOURS_HUES.map((item) => {
                      // Angle in radians where 12 o'clock is -90 deg (-PI/2)
                      const rad = ((item.hour * 30 - 90) * Math.PI) / 180;
                      const radiusPercent = 38; // Distance from center %
                      const left = 50 + radiusPercent * Math.cos(rad);
                      const top = 50 + radiusPercent * Math.sin(rad);

                      const isSelectedHour = currentHour === item.hour;

                      return (
                        <button
                          key={item.hour}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPresetHour(item.hour, item.hue, item.hex);
                          }}
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className={`absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isSelectedHour
                              ? 'bg-white text-slate-950 scale-125 shadow-lg shadow-white/40 border-2 border-slate-900 z-20'
                              : 'bg-slate-900/80 text-white hover:bg-white hover:text-slate-950 border border-slate-700/80'
                          }`}
                          title={item.nameAr}
                        >
                          {item.hour}
                        </button>
                      );
                    })}

                    {/* Clock Hand (عقرب الساعة) rotating hand */}
                    <div
                      style={{
                        transform: `rotate(${clockHandAngle}deg)`,
                        transformOrigin: 'bottom center',
                      }}
                      className="absolute bottom-1/2 left-1/2 w-1.5 h-28 sm:h-32 -ml-0.75 pointer-events-none z-10 transition-transform duration-75 ease-out"
                    >
                      {/* Pointer Needle */}
                      <div className="w-full h-full bg-gradient-to-t from-amber-400 via-amber-300 to-white rounded-t-full shadow-lg shadow-amber-500/50" />
                      <div className="absolute -top-3 -left-2.5 w-6 h-6 rounded-full bg-white border-2 border-slate-900 shadow-md flex items-center justify-center">
                        <div
                          className="w-3 h-3 rounded-full shadow-inner"
                          style={{ backgroundColor: currentHex }}
                        />
                      </div>
                    </div>

                    {/* Center Pivot Hub */}
                    <div
                      style={{ backgroundColor: currentHex }}
                      className="relative z-20 w-12 h-12 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center text-white font-extrabold text-xs transition-colors"
                    >
                      <Clock className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Clock Hours Selector Bar */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">اختيار سريع بساعات عجلة الألوان:</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {CLOCK_HOURS_HUES.map((item) => (
                    <button
                      key={item.hour}
                      onClick={() => handleSelectPresetHour(item.hour, item.hue, item.hex)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition ${
                        currentHour === item.hour
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-black/30 mb-1"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="text-[11px] font-bold">الساعة {item.hour}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'warm' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 space-x-reverse text-rose-400 font-bold text-sm">
                  <Flame className="w-5 h-5" />
                  <span>الألوان الحارة (Warm Colors Collection)</span>
                </div>
                <span className="text-xs text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                  تمنح الطاقة، الشغف، والحيوية
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WARM_COLORS.map((col) => {
                  const isSelected = currentHex.toUpperCase() === col.hex.toUpperCase();
                  return (
                    <div
                      key={col.hex}
                      onClick={() => handleSelectSwatch(col)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-rose-500 ring-2 ring-rose-500/50 shadow-lg scale-102'
                          : 'bg-slate-950 border-slate-800 hover:border-rose-500/50'
                      }`}
                    >
                      <div
                        className="h-16 rounded-lg border border-black/20 shadow-inner mb-2.5 flex items-end justify-end p-2"
                        style={{ backgroundColor: col.hex }}
                      >
                        <span className="text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {col.hex}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-white">{col.nameAr}</p>
                      <p className="text-[11px] text-slate-400 truncate">{col.descriptionAr}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'cool' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 space-x-reverse text-cyan-300 font-bold text-sm">
                  <Snowflake className="w-5 h-5" />
                  <span>الألوان الباردة (Cool Colors Collection)</span>
                </div>
                <span className="text-xs text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  تمنح الهدوء، السلام، والعمق
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COOL_COLORS.map((col) => {
                  const isSelected = currentHex.toUpperCase() === col.hex.toUpperCase();
                  return (
                    <div
                      key={col.hex}
                      onClick={() => handleSelectSwatch(col)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg scale-102'
                          : 'bg-slate-950 border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      <div
                        className="h-16 rounded-lg border border-black/20 shadow-inner mb-2.5 flex items-end justify-end p-2"
                        style={{ backgroundColor: col.hex }}
                      >
                        <span className="text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {col.hex}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-white">{col.nameAr}</p>
                      <p className="text-[11px] text-slate-400 truncate">{col.descriptionAr}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions Bar */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 justify-between items-center">
            <button
              onClick={handleApplyToActiveColor}
              className="flex items-center space-x-1.5 space-x-reverse px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>تطبيق اللون الحالي على العنصر المنسق ({selectedColor.role})</span>
            </button>

            <button
              onClick={handleApplyClockPalette}
              className="flex items-center space-x-1.5 space-x-reverse px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl text-xs shadow-md transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>توليد لوحة كاملة متناسقة من هذه الساعة</span>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Detailed Color Philosophy & Psychology Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 space-x-reverse text-indigo-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>فلسفة وسيكولوجية اللون (Color Philosophy)</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{currentHex.toUpperCase()}</span>
            </div>

            {/* Selected Color Showcase Card */}
            <div
              style={{ backgroundColor: currentHex }}
              className="h-28 rounded-2xl p-4 flex flex-col justify-between shadow-inner border border-black/20 transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-md">
                  {philosophy.tempCategory}
                </span>
                <button
                  onClick={() => handleCopyHex(currentHex)}
                  className="px-2 py-1 bg-black/50 hover:bg-black/80 text-white text-[10px] font-mono rounded backdrop-blur-md flex items-center space-x-1 space-x-reverse transition"
                >
                  {copiedHex === currentHex ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{copiedHex === currentHex ? 'تم النسخ' : 'نسخ HEX'}</span>
                </button>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl text-white">
                <p className="font-extrabold text-sm">{philosophy.titleAr}</p>
                <p className="text-[11px] text-slate-300 font-medium">{philosophy.elementAr}</p>
              </div>
            </div>

            {/* Psychological Keywords Badges */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">المعاني والسيكولوجية الرئيسية:</span>
              <div className="flex flex-wrap gap-1.5">
                {philosophy.keywordsAr.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Deep Psychology Description */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1 space-x-reverse">
                <Zap className="w-3.5 h-3.5" />
                <span>التأثير النفسي والسلوكي للون:</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{philosophy.psychologyAr}</p>
            </div>

            {/* Best Use Cases */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">أفضل مجالات الاستخدام والتطبيق:</span>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                {philosophy.bestUseCasesAr.map((uc, i) => (
                  <li
                    key={i}
                    className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-slate-200 flex items-center space-x-1.5 space-x-reverse"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
