import React, { useState } from 'react';
import { Palette, ColorItem } from '../types';
import { extractImageColorsCanvas } from '../utils/colorUtils';
import { Image as ImageIcon, Upload, Sparkles, RefreshCw, Layers, Palette as PaletteIcon, ShieldCheck } from 'lucide-react';

interface ImageVisionExtractorProps {
  onApplyPalette: (palette: Palette) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface FamousArtwork {
  title: string;
  artist: string;
  year: string;
  url: string;
  colors: { hex: string; name: string; role: 'Primary' | 'Secondary' | 'Accent' | 'Monochromatic' }[];
}

export const ImageVisionExtractor: React.FC<ImageVisionExtractorProps> = ({
  onApplyPalette,
  isLoading,
  setIsLoading,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const famousArtworks: FamousArtwork[] = [
    {
      title: 'ليلة النجوم (The Starry Night)',
      artist: 'فان جوخ (Vincent van Gogh)',
      year: '1889',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      colors: [
        { hex: '#1E3A8A', name: 'Cobalt Swirl Blue', role: 'Primary' },
        { hex: '#0F172A', name: 'Midnight Cypress', role: 'Secondary' },
        { hex: '#F59E0B', name: 'Swirling Star Gold', role: 'Accent' },
        { hex: '#60A5FA', name: 'Cosmic Sky Azure', role: 'Monochromatic' },
      ],
    },
    {
      title: 'المونا ليزا (Mona Lisa)',
      artist: 'ليوناردو دا فينشي (Da Vinci)',
      year: '1503',
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      colors: [
        { hex: '#78350F', name: 'Sienna Umber', role: 'Primary' },
        { hex: '#292524', name: 'Renaissance Oak', role: 'Secondary' },
        { hex: '#D97706', name: 'Amber Skin Ochre', role: 'Accent' },
        { hex: '#4D7C0F', name: 'Muted Olive Veil', role: 'Monochromatic' },
      ],
    },
    {
      title: 'الموجة الكبيرة (The Great Wave)',
      artist: 'هوكوساي (Hokusai)',
      year: '1831',
      url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
      colors: [
        { hex: '#1E40AF', name: 'Prussian Wave Blue', role: 'Primary' },
        { hex: '#0B132B', name: 'Abyss Ocean Depth', role: 'Secondary' },
        { hex: '#FEF08A', name: 'Fuji Cream Dawn', role: 'Accent' },
        { hex: '#E0F2FE', name: 'Foam Spray Crest', role: 'Monochromatic' },
      ],
    },
    {
      title: 'القبلة (The Kiss)',
      artist: 'غوستاف كليمت (Klimt)',
      year: '1907',
      url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80',
      colors: [
        { hex: '#CA8A04', name: 'Gold Leaf Shimmer', role: 'Primary' },
        { hex: '#451A03', name: 'Bronze Charcoal', role: 'Secondary' },
        { hex: '#EC4899', name: 'Mosaic Rose Accent', role: 'Accent' },
        { hex: '#FEF08A', name: 'Sunlit Aura Shimmer', role: 'Monochromatic' },
      ],
    },
    {
      title: 'زنابق الماء (Water Lilies)',
      artist: 'كلود مونيه (Claude Monet)',
      year: '1919',
      url: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=800&auto=format&fit=crop&q=80',
      colors: [
        { hex: '#0D9488', name: 'Impressionist Teal Pond', role: 'Primary' },
        { hex: '#312E81', name: 'Twilight Reflective Indigo', role: 'Secondary' },
        { hex: '#F472B6', name: 'Lily Bloom Blossom', role: 'Accent' },
        { hex: '#A7F3D0', name: 'Soft Mint Willow Tint', role: 'Monochromatic' },
      ],
    },
    {
      title: 'زهور اللوز (Almond Blossoms)',
      artist: 'فان جوخ (Van Gogh)',
      year: '1890',
      url: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&auto=format&fit=crop&q=80',
      colors: [
        { hex: '#0891B2', name: 'Cyan Sky Turquoise', role: 'Primary' },
        { hex: '#155E75', name: 'Deep Cyan Branch', role: 'Secondary' },
        { hex: '#FEF08A', name: 'Blossom Soft Cream', role: 'Accent' },
        { hex: '#CFFAFE', name: 'Spring Air Wash', role: 'Monochromatic' },
      ],
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const applyArtworkPaletteDirectly = (art: FamousArtwork) => {
    setImagePreview(art.url);
    const formattedColors: ColorItem[] = art.colors.map((c) => ({
      id: Math.random().toString(36).substring(2, 9),
      hex: c.hex,
      name: c.name,
      role: c.role,
      explanation: `لون مأخوذ مباشرة من شاهكار الفنان العالمية (${art.title}) - ${art.artist}`,
    }));

    const newPalette: Palette = {
      id: Math.random().toString(36).substring(2, 9),
      title: `${art.title} - ${art.artist}`,
      description: `لوحة ألوان مستخرجة من اللوحة الفنية العالمية المشهورة (${art.title}) عام ${art.year}.`,
      harmonyType: 'Masterpiece Artwork Harmony',
      colors: formattedColors,
      createdAt: Date.now(),
    };

    setExtractedResult({
      vibeSummary: `تناسق فني كلاسيكي فريد يعكس لمسات الفنان ${art.artist} في شاهكار ${art.title}.`,
    });

    onApplyPalette(newPalette);
  };

  const analyzeImage = async (base64Img: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // First attempt Gemini 3.6 Flash Vision AI
      const response = await fetch('/api/palette/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Img }),
      });

      const resData = await response.json();

      if (resData.success && resData.data?.colors) {
        setExtractedResult(resData.data);
        const formattedColors: ColorItem[] = resData.data.colors.map((c: any) => ({
          id: Math.random().toString(36).substring(2, 9),
          hex: c.hex.startsWith('#') ? c.hex : `#${c.hex}`,
          name: c.name || 'Extracted Color',
          role: c.role || 'Accent',
          explanation: c.explanation,
        }));

        const newPalette: Palette = {
          id: Math.random().toString(36).substring(2, 9),
          title: resData.data.title || 'لوحة ألوان الصورة المستخرجة',
          description: resData.data.vibeSummary || 'تم تحليل الألوان واستخراجها بواسطة الذكاء الاصطناعي.',
          harmonyType: resData.data.harmonyType || 'Image Vision Analysis',
          colors: formattedColors,
          createdAt: Date.now(),
        };

        onApplyPalette(newPalette);
      } else {
        // Fallback to local Canvas extraction
        const canvasColors = await extractImageColorsCanvas(base64Img);
        const formattedColors: ColorItem[] = canvasColors.map((hex, i) => ({
          id: Math.random().toString(36).substring(2, 9),
          hex,
          name: `لون مستخرج ${i + 1}`,
          role: i === 0 ? 'Primary' : i === 1 ? 'Background' : 'Accent',
        }));

        const newPalette: Palette = {
          id: Math.random().toString(36).substring(2, 9),
          title: 'لوحة ألوان الصورة',
          description: 'تم أخذ عينات الألوان الرئيسية مباشرة من تحليل البكسلات.',
          harmonyType: 'Image Sampling',
          colors: formattedColors,
          createdAt: Date.now(),
        };

        onApplyPalette(newPalette);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('تم استخدام المحلل المحلي المباشر لاستخراج ألوان الصورة بنجاح.');
      const canvasColors = await extractImageColorsCanvas(base64Img);
      const formattedColors: ColorItem[] = canvasColors.map((hex, i) => ({
        id: Math.random().toString(36).substring(2, 9),
        hex,
        name: `لون مستخرج ${i + 1}`,
        role: i === 0 ? 'Primary' : i === 1 ? 'Background' : 'Accent',
      }));

      onApplyPalette({
        id: Math.random().toString(36).substring(2, 9),
        title: 'لوحة ألوان الصورة المستخرجة',
        description: 'تحليل الألوان المحلي.',
        colors: formattedColors,
        createdAt: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upper Grid: Upload & Famous Artworks Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Dropzone */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse text-indigo-400 font-semibold text-sm">
            <ImageIcon className="w-4 h-4" />
            <span>مستخرج الألوان الذكي من الصور واللوحات</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            قم برفع أي صورة شخصية، تصميم، أو اختر إحدى اللوحات الفنية العالمية أدناه لاستخراج ألوانها الدقيقة وتوزيع الأدوار فورياً.
          </p>

          <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/50 hover:bg-slate-950/80 group">
            <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 mb-2 transition" />
            <span className="text-sm font-semibold text-slate-200">اضغط هنا أو اسحب صورتك لرفعها</span>
            <span className="text-xs text-slate-500 mt-1">يدعم PNG, JPG, WEBP, GIF</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Preview & Analysis Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">المعاينة واستخراج الألوان الحية</span>
              {isLoading && (
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-indigo-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري استخراج الألوان بالذكاء الاصطناعي...</span>
                </div>
              )}
            </div>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 h-56 bg-slate-950 flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="h-56 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                <Layers className="w-8 h-8 opacity-40" />
                <span>اختر لوحة عالمية أو ارفع صورة لمشاهدة تحليل ألوانها فورياً</span>
              </div>
            )}

            {extractedResult?.vibeSummary && (
              <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5 dir-rtl">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5 space-x-reverse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الفيبي والانطباع البصري</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{extractedResult.vibeSummary}</p>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg dir-rtl">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Famous Masterpieces Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="space-y-1 text-right">
            <div className="inline-flex items-center space-x-1.5 space-x-reverse text-amber-400 text-xs font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              <PaletteIcon className="w-3.5 h-3.5" />
              <span>متحف الفن العالمي</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              لوحات رسم عالمية مشهورة (استخراج الألوان الكلاسيكية)
            </h3>
            <p className="text-xs text-slate-400">
              اضغط على أي لوحة عالمية لاستخراج تناسق ألوانها وتطبيقها على اللوحة الرئيسية بنقرة واحدة!
            </p>
          </div>
          <div className="flex items-center space-x-1.5 space-x-reverse text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>6 شاهكارات متحفية جاهزة</span>
          </div>
        </div>

        {/* Masterpieces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {famousArtworks.map((art) => (
            <div
              key={art.title}
              onClick={() => applyArtworkPaletteDirectly(art)}
              className="group cursor-pointer bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-3.5 space-y-3 transition duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-amber-500/10"
            >
              {/* Artwork Image Container */}
              <div className="relative h-40 rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={art.url}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 right-2 left-2 text-right">
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/30">
                    {art.year}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 truncate">{art.title}</h4>
                  <p className="text-[10px] text-slate-300 truncate">{art.artist}</p>
                </div>
              </div>

              {/* Masterpiece Palette Swatches */}
              <div className="space-y-1.5">
                <div className="flex h-7 rounded-lg overflow-hidden border border-slate-800">
                  {art.colors.map((c) => (
                    <div
                      key={c.hex}
                      className="flex-1 h-full relative group/color transition hover:scale-105"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex})`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
                  <span className="font-mono">{art.colors.map((c) => c.hex).join(' • ')}</span>
                  <span className="text-amber-400 font-semibold group-hover:underline">استخراج الألوان ←</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

