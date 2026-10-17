import React, { useState } from 'react';
import { Palette as PaletteType, ColorItem } from '../types';
import { PRESET_PALETTES } from '../data/presetPalettes';
import {
  PROJECT_TYPE_CATEGORIES,
  ProjectTypeCategory,
  generateAlgorithmicPalette,
} from '../data/projectTypes';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Flame,
  FolderPlus,
  Layers,
  CheckCircle2,
  Filter,
  Cpu,
  Landmark,
  ShoppingBag,
  HeartPulse,
  Coffee,
  Leaf,
  Crown,
  Gamepad2,
  Building2,
  GraduationCap,
  Palette as PaletteIcon,
} from 'lucide-react';

interface AIPaletteGeneratorProps {
  currentPalette: PaletteType;
  onApplyPalette: (palette: PaletteType) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const AIPaletteGenerator: React.FC<AIPaletteGeneratorProps> = ({
  currentPalette,
  onApplyPalette,
  isLoading,
  setIsLoading,
}) => {
  const [projectName, setProjectName] = useState(currentPalette.projectName || 'EcoBloom');
  const [projectType, setProjectType] = useState(currentPalette.projectType || 'E-Commerce & Retail');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Map category icons dynamically
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Landmark':
        return <Landmark className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4" />;
      case 'Leaf':
        return <Leaf className="w-4 h-4" />;
      case 'Crown':
        return <Crown className="w-4 h-4" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-4 h-4" />;
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      case 'Palette':
        return <PaletteIcon className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleCategorySelect = (category: ProjectTypeCategory) => {
    setProjectType(category.nameEn);
    setProjectName(category.defaultProjectName);
    setCustomPrompt(category.defaultPrompt);
    handleGenerate(category.defaultProjectName, category.nameEn, category.defaultPrompt);
  };

  const handleGenerate = async (
    overrideName?: string,
    overrideType?: string,
    overridePrompt?: string
  ) => {
    setIsLoading(true);
    setErrorMsg(null);

    const activeName = overrideName !== undefined ? overrideName : projectName;
    const activeType = overrideType !== undefined ? overrideType : projectType;
    const activePrompt = overridePrompt !== undefined ? overridePrompt : customPrompt;

    // Preserve locked colors
    const lockedColors = currentPalette.colors.filter((c) => c.locked);

    try {
      const response = await fetch('/api/palette/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: activeName,
          projectType: activeType,
          prompt: activePrompt,
          count: 4,
          locks: lockedColors.map((c) => ({ hex: c.hex, role: c.role })),
        }),
      });

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.error || 'Failed to generate palette');
      }

      const generated = resData.data;

      const formattedColors: ColorItem[] = generated.colors.map((item: any, idx: number) => {
        const existingLock = lockedColors.find((lc) => lc.role === item.role);
        if (existingLock) {
          return { ...existingLock, id: Math.random().toString(36).substring(2, 9) };
        }

        let role = item.role;
        if (!['Primary', 'Secondary', 'Accent', 'Monochromatic'].includes(role)) {
          const defaultRoles = ['Primary', 'Secondary', 'Accent', 'Monochromatic'];
          role = defaultRoles[idx % 4];
        }

        return {
          id: Math.random().toString(36).substring(2, 9),
          hex: item.hex.startsWith('#') ? item.hex : `#${item.hex}`,
          name: item.name || `Color ${idx + 1}`,
          role: role as any,
          explanation: item.explanation,
          locked: false,
        };
      });

      const newPalette: PaletteType = {
        id: Math.random().toString(36).substring(2, 9),
        title: generated.title || `${activeName} - ${activeType}`,
        projectName: activeName,
        projectType: activeType,
        description: generated.description || `Tailored color palette for ${activeName} (${activeType}).`,
        harmonyType: generated.harmonyType || 'Brand Harmony',
        tags: generated.tags || [activeType, 'AI Designer'],
        colors: formattedColors,
        createdAt: Date.now(),
      };

      onApplyPalette(newPalette);
    } catch (err: any) {
      console.warn('AI generator fallback triggered:', err);
      // Seamless project-type aware algorithmic generator fallback
      const fallbackPalette = generateAlgorithmicPalette(activeName, activeType, activePrompt);
      onApplyPalette(fallbackPalette);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter presets according to selected category
  const filteredPresets = PRESET_PALETTES.filter((preset) => {
    if (selectedCategoryFilter === 'all') return true;
    const cat = PROJECT_TYPE_CATEGORIES.find((c) => c.id === selectedCategoryFilter);
    if (!cat) return true;
    const pType = (preset.projectType || '').toLowerCase();
    const pTitle = (preset.title || '').toLowerCase();
    return (
      pType.includes(cat.id) ||
      pType.includes(cat.nameEn.toLowerCase()) ||
      pTitle.includes(cat.nameEn.toLowerCase()) ||
      preset.tags?.some((t) => cat.suggestedTags.some((st) => st.toLowerCase() === t.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner & Inputs */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>استوديو توليد الألوان الذكي حسب نوع المشروع</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              توليد وتطوير تناسق الألوان حسب نوع مجال المشروع
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              اختر مجال عملك أو أدخل بيانات مشروعك لإنشاء لوحة ألوان متناسقة 4-Color System تحتوي على:
              <strong className="text-slate-200"> Primary</strong> (الأساسي), <strong className="text-slate-200">Secondary</strong> (الثانوي),{' '}
              <strong className="text-slate-200">Accent</strong> (البارز), و <strong className="text-slate-200">Monochromatic</strong> (الدرجة الفاتحة).
            </p>
          </div>

          {/* Input Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />
                <span>اسم المشروع / Brand Name</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="مثال: EcoBloom, FinVault, CareSync..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 transition outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>نوع المجال / Project Type</span>
              </label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="مثال: SaaS Web App, Fintech, Cafe & Dining..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 transition outline-none"
              />
            </div>
          </div>

          {/* Optional Prompt Details */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              توجيه إضافي حول الطابع البصري (اخشياري):
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="مثال: طابع هادئ مريح للعين مع ألوان ترابية وفخامة متناهية..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-xs placeholder-slate-600 outline-none"
            />
          </div>

          {/* Quick Interactive Project Type Categories Cards */}
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2.5 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>اختر من مجالات المشاريع المخصصة لتحديث الألوان فوراً:</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {PROJECT_TYPE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all active:scale-95 ${
                    projectType === cat.nameEn
                      ? 'bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${cat.badgeColor} text-white mb-2 shadow-sm`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-xs font-bold line-clamp-1">{cat.nameAr}</span>
                  <span className="text-[10px] text-slate-400 font-mono line-clamp-1">{cat.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Generate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold rounded-xl text-sm shadow-xl shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري توليد الألوان وتطوير التناسق...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>توليد لوحة ألوان مخصصة للمشروع</span>
              </>
            )}
          </button>

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
              {errorMsg}
            </p>
          )}

          {/* Included Roles Indicator */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Primary (أساسي)</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Secondary (ثانوي)</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Accent (بارز)</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Monochromatic (فاتح)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Curated Library by Project Type Category */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-lg font-bold text-white">مكتبة لوحات الألوان الجاهزة حسب المجالات</h3>
              <p className="text-xs text-slate-400">اضغط على أي لوحة لتطبيقها مباشرة في الواجهة</p>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center space-x-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`text-xs px-3 py-1 rounded-lg border transition whitespace-nowrap ${
                selectedCategoryFilter === 'all'
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل (All)
            </button>
            {PROJECT_TYPE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`text-xs px-3 py-1 rounded-lg border transition whitespace-nowrap ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.nameAr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onApplyPalette(preset)}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition-all hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
                  {preset.title}
                </h4>
                <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                  {preset.projectType || preset.harmonyType}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3 h-8">
                {preset.description}
              </p>

              {/* Color Stripes */}
              <div className="flex h-10 rounded-lg overflow-hidden border border-black/20 shadow-inner">
                {preset.colors.map((c) => (
                  <div
                    key={c.id}
                    style={{ backgroundColor: c.hex }}
                    className="flex-1 h-full relative group/stripe"
                    title={`${c.name} (${c.role}): ${c.hex}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/stripe:opacity-100 bg-black/40 text-[9px] text-white font-mono font-bold">
                      {c.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
