import React, { useState } from 'react';
import { Palette, ColorItem, UsedColor, UserProfileData, GoogleUser } from '../types';
import { getColorPhilosophy } from '../data/colorPhilosophyData';
import { hexToRgb, rgbToHsl } from '../utils/colorUtils';
import {
  User,
  Edit3,
  Check,
  History,
  Copy,
  Plus,
  Trash2,
  Sparkles,
  BarChart2,
  Flame,
  Snowflake,
  Bookmark,
  BookOpen,
  Search,
  Download,
  Award,
  Clock,
  Heart,
  Palette as PaletteIcon,
  Filter,
  RefreshCw,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface UserProfileProps {
  palette: Palette;
  onApplyPalette: (palette: Palette) => void;
  selectedColor: ColorItem;
  onUpdateSelectedColor: (color: ColorItem) => void;
  savedPalettes: Palette[];
  usedColorsHistory: UsedColor[];
  onClearUsedColorsHistory: () => void;
  onRemoveUsedColor: (id: string) => void;
  userProfile: UserProfileData;
  onUpdateUserProfile: (profile: UserProfileData) => void;
  googleUser: GoogleUser | null;
  onLoginGoogle: () => void;
  onLogoutGoogle: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  palette,
  onApplyPalette,
  selectedColor,
  onUpdateSelectedColor,
  savedPalettes,
  usedColorsHistory,
  onClearUsedColorsHistory,
  onRemoveUsedColor,
  userProfile,
  onUpdateUserProfile,
  googleUser,
  onLoginGoogle,
  onLogoutGoogle,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);
  const [editedTitle, setEditedTitle] = useState(userProfile.title);
  const [editedBio, setEditedBio] = useState(userProfile.bio);
  const [editedFavHex, setEditedFavHex] = useState(userProfile.favoriteColorHex);

  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilter, setTempFilter] = useState<'all' | 'warm' | 'cool' | 'neutral'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'frequent'>('newest');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedPhilColor, setSelectedPhilColor] = useState<string | null>(null);

  const handleSaveProfile = () => {
    onUpdateUserProfile({
      name: editedName,
      title: editedTitle,
      bio: editedBio,
      favoriteColorHex: editedFavHex,
      avatarUrl: userProfile.avatarUrl,
    });
    setIsEditingProfile(false);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleApplyToActiveColor = (hex: string, name: string) => {
    const phil = getColorPhilosophy(hex);
    onUpdateSelectedColor({
      ...selectedColor,
      hex: hex,
      name: name || selectedColor.name,
      explanation: phil.psychologyAr,
    });
  };

  const handleAddColorToActivePalette = (hex: string, name: string) => {
    const phil = getColorPhilosophy(hex);
    const newColorItem: ColorItem = {
      id: `profile-color-${Date.now()}-${Math.random()}`,
      hex,
      name: name || phil.colorFamily,
      role: 'Accent',
      explanation: phil.psychologyAr,
      locked: false,
    };

    onApplyPalette({
      ...palette,
      colors: [...palette.colors, newColorItem],
    });
  };

  // Color DNA analytics computation
  let warmCount = 0;
  let coolCount = 0;
  let neutralCount = 0;

  const familyCounts: { [key: string]: number } = {
    'أحمر / وردي': 0,
    'برتقالي / أصفر': 0,
    'أخضر': 0,
    'أزرق / سايان': 0,
    'بنفسجي': 0,
    'محايد / داكن': 0,
  };

  usedColorsHistory.forEach((c) => {
    const rgb = hexToRgb(c.hex);
    const { h, l, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);

    if (l < 15 || l > 88 || s < 12) {
      neutralCount++;
      familyCounts['محايد / داكن']++;
    } else if (h >= 0 && h < 45) {
      warmCount++;
      familyCounts['أحمر / وردي']++;
    } else if (h >= 45 && h < 70) {
      warmCount++;
      familyCounts['برتقالي / أصفر']++;
    } else if (h >= 70 && h < 165) {
      coolCount++;
      familyCounts['أخضر']++;
    } else if (h >= 165 && h < 260) {
      coolCount++;
      familyCounts['أزرق / سايان']++;
    } else {
      coolCount++;
      familyCounts['بنفسجي']++;
    }
  });

  const totalUsed = usedColorsHistory.length;
  const warmPercent = totalUsed > 0 ? Math.round((warmCount / totalUsed) * 100) : 50;
  const coolPercent = totalUsed > 0 ? Math.round((coolCount / totalUsed) * 100) : 50;

  // Filter & Sort Used Colors
  const filteredColors = usedColorsHistory
    .filter((c) => {
      const matchQuery =
        c.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.paletteTitle && c.paletteTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchQuery) return false;

      const rgb = hexToRgb(c.hex);
      const { h, l, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);

      if (tempFilter === 'neutral') return l < 15 || l > 88 || s < 12;
      if (tempFilter === 'warm') return (h >= 0 && h < 70) || h >= 315;
      if (tempFilter === 'cool') return h >= 70 && h < 315 && l >= 15 && l <= 88 && s >= 12;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'frequent') {
        return b.useCount - a.useCount;
      }
      return b.timestamp - a.timestamp;
    });

  const handleExportHistoryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(usedColorsHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `color_ai_used_colors_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 text-slate-100 dir-rtl" dir="rtl">
      {/* 1. User Profile Identity Banner */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Background Ambient Glow */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: userProfile.favoriteColorHex }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 sm:space-x-reverse text-center sm:text-right w-full md:w-auto">
            {/* Custom Avatar Badge */}
            <div className="relative group">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 shadow-2xl transition-transform group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${userProfile.favoriteColorHex}, #4F46E5, #9333EA)`,
                }}
              >
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <User className="w-10 h-10 text-slate-200" />
                </div>
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: userProfile.favoriteColorHex }}
                title={`اللون المفضل: ${userProfile.favoriteColorHex}`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            {/* Profile Info or Edit Mode Form */}
            {!isEditingProfile ? (
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{userProfile.name}</h2>
                  <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-medium">
                    {userProfile.title}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md">{userProfile.bio}</p>
                <div className="pt-1 flex items-center justify-center sm:justify-start space-x-2 space-x-reverse text-xs text-slate-400">
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>اللون المفضل:</span>
                    <span className="font-mono text-white font-bold">{userProfile.favoriteColorHex}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-right w-full max-w-md bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">الاسم الكامل:</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">المسمى الوظيفي:</label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">النبذة التعريفية:</label>
                  <input
                    type="text"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <label className="text-[11px] font-bold text-slate-400">اللون المفضل:</label>
                  <input
                    type="color"
                    value={editedFavHex}
                    onChange={(e) => setEditedFavHex(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-amber-300">{editedFavHex}</span>
                </div>

                <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1 space-x-reverse"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حفظ البروفايل</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Button & Quick Profile Metrics */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {googleUser ? (
              <div className="bg-slate-950/80 border border-emerald-500/30 p-3 rounded-2xl flex items-center space-x-3 space-x-reverse text-right">
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <span className="text-xs font-bold text-white">{googleUser.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 dir-ltr">{googleUser.email}</p>
                </div>
                <button
                  onClick={onLogoutGoogle}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center space-x-1 space-x-reverse"
                  title="تسجيل الخروج من حساب Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginGoogle}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-extrabold shadow-lg transition active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>ربط حساب Google</span>
              </button>
            )}

            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center space-x-1.5 space-x-reverse px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition shadow-md"
              >
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>تعديل البروفايل</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Statistics Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 space-x-reverse">
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>الألوان المستعملة</span>
            </span>
            <p className="text-xl sm:text-2xl font-black text-white">{totalUsed} لون</p>
            <p className="text-[10px] text-slate-500">تم تسجيلها في سجلك</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 space-x-reverse">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>اللوحات المحفوظة</span>
            </span>
            <p className="text-xl sm:text-2xl font-black text-amber-300">{savedPalettes.length} لوحة</p>
            <p className="text-[10px] text-slate-500">في خزينة اللوحات</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 space-x-reverse">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>توازُن الحرارة</span>
            </span>
            <p className="text-xl sm:text-2xl font-black text-rose-300">
              {warmPercent}% <span className="text-xs text-slate-400 font-normal">حارة</span>
            </p>
            <p className="text-[10px] text-slate-500">مقابل {coolPercent}% باردة</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 space-x-reverse">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>المستوى التصميمي</span>
            </span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">
              {totalUsed > 30 ? 'خبير ألوان 🌟' : totalUsed > 10 ? 'مصمم محترف ✨' : 'مستكشف ألوان 🎨'}
            </p>
            <p className="text-[10px] text-slate-500">بناءً على نشاطك في التطبيق</p>
          </div>
        </div>
      </div>

      {/* 2. Color DNA Analytics Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 space-x-reverse text-indigo-400 font-bold text-sm">
            <BarChart2 className="w-5 h-5" />
            <span>تحليلات الحمض النووي للألوان (Color DNA Analytics)</span>
          </div>
          <span className="text-xs text-slate-400">توزيع فئات الألوان التي تميل إلى استخدامها</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {Object.entries(familyCounts).map(([family, count]) => {
            const pct = totalUsed > 0 ? Math.round((count / totalUsed) * 100) : 0;
            return (
              <div key={family} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-medium block truncate">{family}</span>
                <p className="text-lg font-bold text-white">{pct}%</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block">{count} استخدام</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Used Colors History Section ("سجل الألوان التي استخدمتها") */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 space-x-reverse text-amber-400 font-bold text-base">
              <History className="w-5 h-5" />
              <span>سجل الألوان المستخدمة ({filteredColors.length} لون)</span>
            </div>
            <p className="text-xs text-slate-400">
              جميع الألوان التي قمت بتوليدها، تعديلها، أو اختيارها يتم حفظها هنا لاسترجاعها وإعادة استخدامها في أي وقت
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportHistoryJSON}
              disabled={usedColorsHistory.length === 0}
              className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>تصدير السجل</span>
            </button>

            <button
              onClick={onClearUsedColorsHistory}
              disabled={usedColorsHistory.length === 0}
              className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="ابحث برمز HEX أو اسم اللون أو الدور..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 pr-9 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
          </div>

          {/* Temperature Filter */}
          <div className="sm:col-span-3 flex items-center space-x-1 space-x-reverse bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTempFilter('all')}
              className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                tempFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setTempFilter('warm')}
              className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                tempFilter === 'warm' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              حارة 🔥
            </button>
            <button
              onClick={() => setTempFilter('cool')}
              className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition ${
                tempFilter === 'cool' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              باردة ❄️
            </button>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">الأحدث استخداماً</option>
              <option value="frequent">الأكثر تكراراً واستخداماً</option>
            </select>
          </div>
        </div>

        {/* Used Colors History Swatch Grid */}
        {filteredColors.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
            <History className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <p className="text-sm font-bold text-slate-400">لا توجد ألوان في السجل مطابقة للبحث</p>
            <p className="text-xs text-slate-500">
              قم بتوليد لوحات ألوان أو اختيار ألوان في علامات التبويب الأخرى وسيتم تسجيلها تلقائياً هنا!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredColors.map((col) => {
              const phil = getColorPhilosophy(col.hex);
              return (
                <div
                  key={col.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 space-y-3 transition-all hover:shadow-xl group"
                >
                  {/* Swatch Header Box */}
                  <div
                    className="h-20 rounded-xl border border-black/20 shadow-inner p-2 flex flex-col justify-between"
                    style={{ backgroundColor: col.hex }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs font-bold">
                        {col.hex}
                      </span>
                      <button
                        onClick={() => handleCopyHex(col.hex)}
                        className="p-1 bg-black/60 hover:bg-black text-white rounded backdrop-blur-xs transition"
                        title="نسخ HEX"
                      >
                        {copiedHex === col.hex ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-[10px] bg-black/40 text-white px-1.5 py-0.5 rounded backdrop-blur-xs truncate max-w-[120px]">
                        {col.name || phil.colorFamily}
                      </span>
                      {col.useCount > 1 && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded-full">
                          {col.useCount}x
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Color Metadata & Psychology Snippet */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{col.role || 'دور عام'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(col.timestamp).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{phil.psychologyAr}</p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <button
                      onClick={() => handleApplyToActiveColor(col.hex, col.name)}
                      className="flex-1 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold border border-indigo-500/30 transition text-center"
                      title={`تطبيق كـ ${selectedColor.role}`}
                    >
                      تطبيق على المحدد
                    </button>

                    <button
                      onClick={() => handleAddColorToActivePalette(col.hex, col.name)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                      title="إضافة للوحة الحالية"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveUsedColor(col.id)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition"
                      title="حذف من السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. User Saved Vault Shortcut Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 space-x-reverse text-amber-400 font-bold text-sm">
            <Bookmark className="w-5 h-5" />
            <span>لوحاتك المحفوظة في البروفايل ({savedPalettes.length})</span>
          </div>
        </div>

        {savedPalettes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">لم تقم بحفظ أي لوحات ألوان بعد في الخزينة.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPalettes.slice(0, 6).map((p) => (
              <div
                key={p.id}
                onClick={() => onApplyPalette(p)}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-3.5 rounded-2xl space-y-2.5 cursor-pointer transition-all hover:scale-101"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-white truncate">{p.title}</h4>
                  <span className="text-[10px] text-slate-400">{p.colors.length} ألوان</span>
                </div>

                <div className="flex h-10 rounded-xl overflow-hidden border border-black/20">
                  {p.colors.map((c, idx) => (
                    <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c.hex }} title={c.hex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
