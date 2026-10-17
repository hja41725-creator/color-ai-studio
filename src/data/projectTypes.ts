import { ColorItem, Palette } from '../types';

export interface ProjectTypeCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  badgeColor: string;
  descriptionAr: string;
  descriptionEn: string;
  defaultProjectName: string;
  defaultPrompt: string;
  primaryHueRange: [number, number]; // HSL Hue range
  saturationRange: [number, number];
  lightnessRange: [number, number];
  accentOffset: number; // Hue shift for accent
  secondaryType: 'dark' | 'light' | 'complementary';
  suggestedTags: string[];
}

export const PROJECT_TYPE_CATEGORIES: ProjectTypeCategory[] = [
  {
    id: 'saas',
    nameAr: 'تطبيقات البرمجيات والسحاب (SaaS)',
    nameEn: 'SaaS & Web Applications',
    iconName: 'Cpu',
    badgeColor: 'from-indigo-500 to-purple-600',
    descriptionAr: 'ألوان توحي بالثقة، الحداثة، والتفاعل السلس للوحة التحكم والمستخدمين.',
    descriptionEn: 'Trustworthy, modern indigo/violet palettes engineered for web app dashboards.',
    defaultProjectName: 'CloudPulse',
    defaultPrompt: 'واجهة برمجية سحابية احترافية مع ألوان تباين عالية للوحة التحكم',
    primaryHueRange: [225, 260],
    saturationRange: [75, 90],
    lightnessRange: [50, 62],
    accentOffset: 120, // Green/Emerald
    secondaryType: 'dark',
    suggestedTags: ['SaaS', 'Dashboard', 'Cloud', 'Modern UI'],
  },
  {
    id: 'fintech',
    nameAr: 'المالية والاستثمار والتداول (Fintech)',
    nameEn: 'Fintech & Banking',
    iconName: 'Landmark',
    badgeColor: 'from-blue-600 to-emerald-600',
    descriptionAr: 'ألوان توحي بالأمان، الاستقرار، والنمو المالي مع درجات كحلي وزمردي رابح.',
    descriptionEn: 'Deep navy, indigo, and growth emeralds built for banking & investment security.',
    defaultProjectName: 'FinVault',
    defaultPrompt: 'منصة تداول وتطبيقات بنكية توحي بالأمان والنمو المالي',
    primaryHueRange: [210, 235],
    saturationRange: [80, 95],
    lightnessRange: [42, 55],
    accentOffset: 140, // Emerald Green
    secondaryType: 'dark',
    suggestedTags: ['Fintech', 'Banking', 'Trading', 'Security'],
  },
  {
    id: 'ecommerce',
    nameAr: 'التجارة الإلكترونية والمتاجر (E-Commerce)',
    nameEn: 'E-Commerce & Retail',
    iconName: 'ShoppingBag',
    badgeColor: 'from-emerald-500 to-teal-600',
    descriptionAr: 'ألوان تحفز الشراء وتبرز المنتجات مع أزرار دعوة لاتخاذ إجراء عالية التباين.',
    descriptionEn: 'High-conversion storefront palettes with inviting primary tones and vibrant call-to-actions.',
    defaultProjectName: 'VelvetCart',
    defaultPrompt: 'متجر إلكتروني عصري جذاب مع أزرار شراء بارزة جداً',
    primaryHueRange: [150, 175],
    saturationRange: [70, 88],
    lightnessRange: [38, 52],
    accentOffset: 190, // Orange/Amber
    secondaryType: 'dark',
    suggestedTags: ['E-Commerce', 'Storefront', 'High Conversion', 'Retail'],
  },
  {
    id: 'healthcare',
    nameAr: 'الصحة والعافية والطب (Healthcare)',
    nameEn: 'Healthcare & Wellbeing',
    iconName: 'HeartPulse',
    badgeColor: 'from-teal-500 to-cyan-600',
    descriptionAr: 'ألوان ناصعة ومريحة للعين توحي بالنظافة، الرعاية، والهدوء النفسي.',
    descriptionEn: 'Soothing clinical teals, serene sky blues, and warm coral focus tones.',
    defaultProjectName: 'CareSync',
    defaultPrompt: 'منصة طبية استشارية بألوان مهدئة للأعصاب وعالية الوضوح',
    primaryHueRange: [175, 195],
    saturationRange: [65, 85],
    lightnessRange: [45, 58],
    accentOffset: 160, // Coral Pink
    secondaryType: 'dark',
    suggestedTags: ['Healthcare', 'Medical', 'Wellness', 'Clean UI'],
  },
  {
    id: 'cafe',
    nameAr: 'المقاهي والمطاعم والمخبوزات (Cafe & Dining)',
    nameEn: 'Cafes, Restaurants & Food',
    iconName: 'Coffee',
    badgeColor: 'from-amber-600 to-orange-700',
    descriptionAr: 'درجات دافئة من الإسبريسو، القرفة، والعسل تثير الشهية وتضفي جو المقهى الحرفي.',
    descriptionEn: 'Warm espresso, toasted cinnamon, and golden honey tones provoking warmth and appetite.',
    defaultProjectName: 'Aura Roast',
    defaultPrompt: 'تطبيق مقهى حرفي ومطعم بألوان دافئة غنية بنكهة القهوة',
    primaryHueRange: [15, 32],
    saturationRange: [75, 90],
    lightnessRange: [35, 48],
    accentOffset: 25, // Golden Amber
    secondaryType: 'dark',
    suggestedTags: ['Coffee', 'Cafe', 'Restaurant', 'Artisan', 'Warm'],
  },
  {
    id: 'eco',
    nameAr: 'الاستدامة والبيئة والمنتجات الخضراء (Eco & Organic)',
    nameEn: 'Sustainability & Eco Products',
    iconName: 'Leaf',
    badgeColor: 'from-green-600 to-emerald-700',
    descriptionAr: 'ألوان مستوحاة من الطبيعة والتربة والأوراق النباتية الخضراء.',
    descriptionEn: 'Earthy botanical greens, warm timber, and sunlit amber for sustainable eco brands.',
    defaultProjectName: 'EcoBloom',
    defaultPrompt: 'علامة تجارية خضراء مستدامة بألوان أوراق الشجر والتربة الطبيعية',
    primaryHueRange: [130, 155],
    saturationRange: [65, 82],
    lightnessRange: [36, 50],
    accentOffset: 85, // Gold/Yellow
    secondaryType: 'dark',
    suggestedTags: ['Eco', 'Organic', 'Sustainable', 'Nature'],
  },
  {
    id: 'luxury',
    nameAr: 'الفخامة والموضة والأزياء (Luxury & Fashion)',
    nameEn: 'Luxury & High-End Fashion',
    iconName: 'Crown',
    badgeColor: 'from-purple-900 to-amber-600',
    descriptionAr: 'ألوان ملكية فاخرة تجمع بين الأسود الفحمي، البنفسجي الإمبراطوري، والذهبي البراق.',
    descriptionEn: 'Prestige obsidian, imperial violet, and champagne gold for haute couture and luxury.',
    defaultProjectName: 'Maison Noir',
    defaultPrompt: 'دار أزياء فاخرة ومنتجات راقية بألوان ملكية بلمسات ذهبية',
    primaryHueRange: [270, 290],
    saturationRange: [60, 80],
    lightnessRange: [25, 42],
    accentOffset: 130, // Champagne Gold
    secondaryType: 'dark',
    suggestedTags: ['Luxury', 'Fashion', 'Gold', 'Prestige', 'Minimal'],
  },
  {
    id: 'gaming',
    nameAr: 'الألعاب والذكاء الاصطناعي (Gaming & AI)',
    nameEn: 'Gaming, Cyberpunk & AI',
    iconName: 'Gamepad2',
    badgeColor: 'from-pink-600 to-cyan-500',
    descriptionAr: 'ألوان نيون صارخة، بنفسجي سايبر، وأزرق سياني مستقبلي مخصص للوضع الداكن.',
    descriptionEn: 'High-octane neon magenta, electric cyan, and obsidian void built for immersive dark UI.',
    defaultProjectName: 'Nexus Gaming',
    defaultPrompt: 'منصة ألعاب إلكترونية مستقبليّة بعناصر نيون متوهجة',
    primaryHueRange: [315, 340],
    saturationRange: [85, 100],
    lightnessRange: [52, 65],
    accentOffset: 180, // Electric Cyan
    secondaryType: 'dark',
    suggestedTags: ['Gaming', 'Cyberpunk', 'AI', 'Neon', 'Dark Mode'],
  },
  {
    id: 'realestate',
    nameAr: 'العقارات والتصميم المعماري (Real Estate)',
    nameEn: 'Real Estate & Architecture',
    iconName: 'Building2',
    badgeColor: 'from-amber-700 to-slate-700',
    descriptionAr: 'ألوان الحجر الدافئ، الطين، والحديد الصلب تعبر عن الصلابة والأناقة المعمارية.',
    descriptionEn: 'Terracotta, warm sandstone, and structural slate for architectural prestige.',
    defaultProjectName: 'Horizon Estate',
    defaultPrompt: 'موقع تسويق عقارات ومعمار بألوان الحجر الرملي والخشب الدافئ',
    primaryHueRange: [20, 38],
    saturationRange: [60, 78],
    lightnessRange: [38, 52],
    accentOffset: 15, // Warm Amber
    secondaryType: 'dark',
    suggestedTags: ['Real Estate', 'Architecture', 'Property', 'Warm Stone'],
  },
  {
    id: 'education',
    nameAr: 'التعليم والأكاديميات (Education & EdTech)',
    nameEn: 'Education & Learning Platforms',
    iconName: 'GraduationCap',
    badgeColor: 'from-blue-600 to-amber-500',
    descriptionAr: 'ألوان تلهم الشغف والتركيز وتزيد استيعاب الطلاب في المنصات التعليمية.',
    descriptionEn: 'Inspiring royal sapphire, deep scholar navy, and energetic yellow focus accents.',
    defaultProjectName: 'EduSpark',
    defaultPrompt: 'منصة تعليمية تفاعلية مشجعة على التعلم والإنجاز',
    primaryHueRange: [210, 230],
    saturationRange: [75, 90],
    lightnessRange: [48, 60],
    accentOffset: 170, // Spark Orange
    secondaryType: 'dark',
    suggestedTags: ['Education', 'EdTech', 'Learning', 'Courses'],
  },
  {
    id: 'masterpiece',
    nameAr: 'اللوحات الفنية العالمية (Art Masterpieces)',
    nameEn: 'Masterpiece Oil Paintings',
    iconName: 'Palette',
    badgeColor: 'from-rose-600 via-amber-500 to-indigo-600',
    descriptionAr: 'ألوان مستخرجة من أشهر اللوحات العالمية مثل فان جوخ، المونا ليزا، وكليمت.',
    descriptionEn: 'Classic color harmonies derived from world-famous art masterpieces.',
    defaultProjectName: 'Van Gogh Starry Night',
    defaultPrompt: 'تناسق ألوان متحفي مستوحى من اللوحات الكلاسيكية العالمية',
    primaryHueRange: [210, 240],
    saturationRange: [70, 90],
    lightnessRange: [40, 55],
    accentOffset: 150, // Gold Star
    secondaryType: 'dark',
    suggestedTags: ['Masterpiece', 'Art', 'Museum', 'Classic Harmony'],
  },
];

/**
 * Generate a project-type specific color palette algorithmically
 * Guarantees 100% uptime and precise psychological alignment per industry
 */
export function generateAlgorithmicPalette(
  projectName: string,
  projectType: string,
  prompt?: string
): Palette {
  // Match category or fallback
  const normalizedType = projectType.toLowerCase();
  const category =
    PROJECT_TYPE_CATEGORIES.find((c) =>
      normalizedType.includes(c.id) ||
      normalizedType.includes(c.nameEn.toLowerCase()) ||
      c.suggestedTags.some((t) => normalizedType.includes(t.toLowerCase()))
    ) || PROJECT_TYPE_CATEGORIES[0];

  const seedString = (projectName + projectType + (prompt || '')).trim();
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Compute Hue within category range
  const [minH, maxH] = category.primaryHueRange;
  const primaryHue = minH + (hash % Math.max(1, maxH - minH));

  const [minS, maxS] = category.saturationRange;
  const primarySat = minS + ((hash >> 3) % Math.max(1, maxS - minS));

  const [minL, maxL] = category.lightnessRange;
  const primaryLight = minL + ((hash >> 6) % Math.max(1, maxL - minL));

  const hslToHex = (h: number, s: number, l: number) => {
    h = (h % 360 + 360) % 360;
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // Primary hex
  const primaryHex = hslToHex(primaryHue, primarySat, primaryLight);

  // Secondary hex (Dark background card neutral)
  const secondaryHue = (primaryHue + 15) % 360;
  const secondaryHex = hslToHex(secondaryHue, 45, 12);

  // Accent hex (High energy focal point)
  const accentHue = (primaryHue + category.accentOffset) % 360;
  const accentHex = hslToHex(accentHue, 92, 56);

  // Monochromatic tint
  const monoHex = hslToHex(primaryHue, Math.max(30, primarySat - 20), Math.min(88, primaryLight + 28));

  const colors: ColorItem[] = [
    {
      id: Math.random().toString(36).substring(2, 9),
      hex: primaryHex,
      name: `${category.nameEn.split(' ')[0]} Primary Hue`,
      role: 'Primary',
      explanation: `اللون الأساسي المتناسق لـ ${category.nameAr} وهويتها البصرية.`,
    },
    {
      id: Math.random().toString(36).substring(2, 9),
      hex: secondaryHex,
      name: 'Deep Slate Container',
      role: 'Secondary',
      explanation: 'درجة داكنة متباينة للخلفيات والبطاقات التفاعلية.',
    },
    {
      id: Math.random().toString(36).substring(2, 9),
      hex: accentHex,
      name: 'Vibrant Focus Accent',
      role: 'Accent',
      explanation: 'اللون البارز لأزرار الدعوة لاتخاذ إجراء والإشعارات المهمة.',
    },
    {
      id: Math.random().toString(36).substring(2, 9),
      hex: monoHex,
      name: 'Soft Tint Layer',
      role: 'Monochromatic',
      explanation: 'درجة فاتحة من اللون الأساسي للحدود والبطاقات الفرعية.',
    },
  ];

  return {
    id: Math.random().toString(36).substring(2, 9),
    title: `${projectName || category.defaultProjectName} - لوحة ${category.nameAr}`,
    projectName: projectName || category.defaultProjectName,
    projectType: projectType || category.nameEn,
    description: `لوحة ألوان متناسقة وهندسية مصممة خصيصاً لنوع مشروع: ${category.nameAr} (${category.nameEn}).`,
    harmonyType: `${category.nameEn} Harmonic Profile`,
    tags: [category.nameEn, 'تصميم هادئ', 'تناسق الألوان', ...category.suggestedTags],
    colors,
    createdAt: Date.now(),
  };
}
