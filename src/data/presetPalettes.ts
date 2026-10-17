import { Palette } from '../types';

export const PRESET_PALETTES: Palette[] = [
  {
    id: 'saas-pro',
    title: 'FinPulse - SaaS Financial Dashboard',
    projectName: 'FinPulse',
    projectType: 'SaaS & Web Applications',
    description: 'Clean, trustworthy financial tech palette engineered for high-density web app UI.',
    harmonyType: 'Brand Monochromatic Split',
    tags: ['SaaS', 'Fintech', 'Dashboard', 'Professional'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#4F46E5', name: 'Indigo Horizon', role: 'Primary', explanation: 'Dominant brand identity color for primary actions and key navigation.' },
      { id: '2', hex: '#0F172A', name: 'Slate Midnight', role: 'Secondary', explanation: 'Deep contrast tone for headers, dark cards, and typography.' },
      { id: '3', hex: '#10B981', name: 'Emerald Spark', role: 'Accent', explanation: 'High-energy focal points for positive indicators, CTA buttons, and badges.' },
      { id: '4', hex: '#818CF8', name: 'Soft Indigo Tint', role: 'Monochromatic', explanation: 'Cohesive tint variation of the primary indigo for active states, borders, and subtle chips.' }
    ]
  },
  {
    id: 'fintech-vault',
    title: 'CoinVault - Crypto & Trading Platform',
    projectName: 'CoinVault',
    projectType: 'Fintech & Banking',
    description: 'Deep navy, electric blue, and golden growth amber for secure financial platforms.',
    harmonyType: 'Financial Security Split',
    tags: ['Fintech', 'Crypto', 'Banking', 'Trading'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#1E3A8A', name: 'Royal Vault Blue', role: 'Primary', explanation: 'اللون الأزرق الداكن الموثوق لمؤسسات التداول والبنك.' },
      { id: '2', hex: '#090D16', name: 'Obsidian Slate', role: 'Secondary', explanation: 'خلفية داكنة فائقة التباين لقراءة البيانات المالية بسهولة.' },
      { id: '3', hex: '#F59E0B', name: 'Golden Growth', role: 'Accent', explanation: 'مؤشر النمو الذهبي للأزرار الحيوية ومؤشرات الأرباح.' },
      { id: '4', hex: '#3B82F6', name: 'Azure Cyber Tint', role: 'Monochromatic', explanation: 'درجة الأزرق السماوي الفاتحة للحدود والمؤشرات المفتوحة.' }
    ]
  },
  {
    id: 'ecobloom-store',
    title: 'EcoBloom - Organic E-Commerce Store',
    projectName: 'EcoBloom',
    projectType: 'E-Commerce & Retail',
    description: 'Calm, organic, and grounded earth tones designed for modern sustainable storefronts.',
    harmonyType: 'Earthy Monochromatic Harmony',
    tags: ['E-Commerce', 'Organic', 'Sustainable', 'Minimalist'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#059669', name: 'Botanical Emerald', role: 'Primary', explanation: 'Main eco-brand color for primary buttons, banners, and headers.' },
      { id: '2', hex: '#1E293B', name: 'Charcoal Timber', role: 'Secondary', explanation: 'Grounded dark neutral for structural contrast and body text.' },
      { id: '3', hex: '#F59E0B', name: 'Sunlit Amber', role: 'Accent', explanation: 'Warm high-conversion accent for sales badges, reviews, and highlights.' },
      { id: '4', hex: '#A7F3D0', name: 'Sage Mint Mist', role: 'Monochromatic', explanation: 'Light mint tint of the primary emerald for hover states and subtle card backdrops.' }
    ]
  },
  {
    id: 'healthcare-caresync',
    title: 'CareSync - Healthcare & Telemedicine',
    projectName: 'CareSync',
    projectType: 'Healthcare & Wellbeing',
    description: 'Soothing clinical teals and calming sky blue crafted for medical & wellness apps.',
    harmonyType: 'Soothing Clinical Serenity',
    tags: ['Healthcare', 'Medical', 'Wellness', 'Clean UI'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#0D9488', name: 'Clinical Teal', role: 'Primary', explanation: 'اللون التايلي المهدئ للأعصاب المعتمد في المنصات الطبية.' },
      { id: '2', hex: '#0F172A', name: 'Deep Midnight Sky', role: 'Secondary', explanation: 'خلفية داكنة مريحة للعين وقراءة المخططات الطبية.' },
      { id: '3', hex: '#F43F5E', name: 'Pulse Coral', role: 'Accent', explanation: 'لون النبض المرجاني للتنبيهات الطبية الطارئة وأزرار الاتصال.' },
      { id: '4', hex: '#99F6E4', name: 'Healing Mint Water', role: 'Monochromatic', explanation: 'لمسة مائية ناعمة جداً لخلفيات المواعيد والبطاقات.' }
    ]
  },
  {
    id: 'luxe-cafe',
    title: 'Aura Artisan - Coffee & Bakery Studio',
    projectName: 'Aura Bakery',
    projectType: 'Cafes, Restaurants & Food',
    description: 'Warm artisan palette blending sunbaked espresso, warm mocha, and roasted amber.',
    harmonyType: 'Warm Monochromatic Harmony',
    tags: ['Artisan', 'Coffee', 'Warm', 'Mobile App'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#9A3412', name: 'Sunbaked Espresso', role: 'Primary', explanation: 'Rich artisan primary identity color for logo and primary CTA buttons.' },
      { id: '2', hex: '#451A03', name: 'Roasted Coffee Bean', role: 'Secondary', explanation: 'Deep roast secondary shade for rich cards and navigation headers.' },
      { id: '3', hex: '#F59E0B', name: 'Golden Honey', role: 'Accent', explanation: 'Vibrant highlight color for special offers and rating stars.' },
      { id: '4', hex: '#FFEDD5', name: 'Warm Cream Wash', role: 'Monochromatic', explanation: 'Ultra-soft light shade of the espresso hue for item card backdrops.' }
    ]
  },
  {
    id: 'luxury-maison',
    title: 'Maison Noir - High-End Luxury Fashion',
    projectName: 'Maison Noir',
    projectType: 'Luxury & High-End Fashion',
    description: 'Prestige imperial violet, obsidian black, and champagne gold for haute couture.',
    harmonyType: 'Imperial Prestige Gold',
    tags: ['Luxury', 'Fashion', 'Gold', 'Prestige'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#581C87', name: 'Imperial Velvet', role: 'Primary', explanation: 'اللون البنفسجي الإمبراطوري للهوية الملكية الفاخرة.' },
      { id: '2', hex: '#09090B', name: 'Obsidian Jet', role: 'Secondary', explanation: 'الأسود الفحمي الذي يمنح لمسة فخامة ورقي لا مثيل له.' },
      { id: '3', hex: '#D97706', name: 'Champagne Gold', role: 'Accent', explanation: 'الذهبي البراق للمجوهرات والشعارات والتفاصيل الدقيقة.' },
      { id: '4', hex: '#E9D5FF', name: 'Silk Lavender', role: 'Monochromatic', explanation: 'درجة حريرية ناعمة لخلفيات المنتجات الفاخرة.' }
    ]
  },
  {
    id: 'cyberpunk-neon',
    title: 'Aethel AI - Futuristic Cyberpunk Studio',
    projectName: 'Aethel AI',
    projectType: 'Gaming, Cyberpunk & AI',
    description: 'High-contrast nocturnal futuristic vibe with vibrant neon magenta and cyber electric cyan.',
    harmonyType: 'Complementary Vibrant',
    tags: ['Futuristic', 'Cyberpunk', 'AI', 'Dark Mode'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#EC4899', name: 'Electric Magenta', role: 'Primary', explanation: 'High-energy call to action accent and hero brand tone.' },
      { id: '2', hex: '#0F172A', name: 'Obsidian Void', role: 'Secondary', explanation: 'Deep dark backdrop and card container neutral.' },
      { id: '3', hex: '#06B6D4', name: 'Cyber Cyan', role: 'Accent', explanation: 'Futuristic secondary glow and button highlights.' },
      { id: '4', hex: '#F472B6', name: 'Neon Rose Tint', role: 'Monochromatic', explanation: 'Soft neon tint variation of the primary magenta for borders and chip badges.' }
    ]
  },
  {
    id: 'realestate-horizon',
    title: 'Horizon Architecture - Luxury Estate',
    projectName: 'Horizon Living',
    projectType: 'Real Estate & Architecture',
    description: 'Warm terracotta, sandstone, and structural slate for architectural real estate apps.',
    harmonyType: 'Terracotta Sandstone Structural',
    tags: ['Real Estate', 'Architecture', 'Property', 'Terracotta'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#B45309', name: 'Warm Sandstone', role: 'Primary', explanation: 'لون الحجر الرملي الدافئ الذي يرمز للصلابة والأصالة المعمارية.' },
      { id: '2', hex: '#1C1917', name: 'Architectural Slate', role: 'Secondary', explanation: 'رمادي حجري داكن للهياكل والأطر الخارجية.' },
      { id: '3', hex: '#EA580C', name: 'Terracotta Flame', role: 'Accent', explanation: 'الطين المحروق البارز لأزرار الاستفسار وحجز معاينة العقار.' },
      { id: '4', hex: '#FDE68A', name: 'Sunlit Linen Tint', role: 'Monochromatic', explanation: 'درجة دافئة جداً لخلفيات المخططات الهندسية.' }
    ]
  },
  {
    id: 'education-eduspark',
    title: 'EduSpark - Modern Learning Platform',
    projectName: 'EduSpark',
    projectType: 'Education & Learning Platforms',
    description: 'Inspiring sapphire blue and vibrant amber spark for interactive EdTech platforms.',
    harmonyType: 'Inspiring Sapphire Spark',
    tags: ['Education', 'EdTech', 'Learning', 'Courses'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#1D4ED8', name: 'Royal Scholar Sapphire', role: 'Primary', explanation: 'الأزرق الملكي الملهم للتركيز والشغف بالعلم.' },
      { id: '2', hex: '#0F172A', name: 'Navy Academy Slate', role: 'Secondary', explanation: 'الكحلي الداكن لقراءة النصوص والدروس بوضوح شاذ.' },
      { id: '3', hex: '#F59E0B', name: 'Spark Gold Focus', role: 'Accent', explanation: 'اللون الذهبي المشجع للشارات والمكافآت وإكمال الدورات.' },
      { id: '4', hex: '#BFDBFE', name: 'Sky Clarity Tint', role: 'Monochromatic', explanation: 'أزرق سماوي ناصع لتظليل الأسئلة والتمارين.' }
    ]
  },
  {
    id: 'art-starry-night',
    title: 'ليلة النجوم (The Starry Night) - فان جوخ',
    projectName: 'Vincent van Gogh (1889)',
    projectType: 'Masterpiece Oil Paintings',
    description: 'ألوان لوحة ليلة النجوم الشهيرة لفان جوخ: أزرق سماوي داكن، أصفر ناري متوهج، ونيلي ليلي ساحر.',
    harmonyType: 'Impressionist Dynamic Contrast',
    tags: ['Masterpiece', 'Van Gogh', 'Art', 'Oil Painting', 'Post-Impressionism'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#1E3A8A', name: 'Cobalt Night Blue', role: 'Primary', explanation: 'الأزرق الكوبالتي الكثيف للماء وسماء الليل المتلاطمة.' },
      { id: '2', hex: '#0F172A', name: 'Midnight Cypress', role: 'Secondary', explanation: 'اللون النيلي الغامق لشجرة السرو المهيبة في مقدمة اللوحة.' },
      { id: '3', hex: '#F59E0B', name: 'Swirling Star Gold', role: 'Accent', explanation: 'الأصفر الذهبي الناري للنجوم المتوهجة وهلال السماء.' },
      { id: '4', hex: '#60A5FA', name: 'Cosmic Sky Azure', role: 'Monochromatic', explanation: 'الأزرق السماوي الفاتح للدوامات المضيئة بين النجوم.' }
    ]
  },
  {
    id: 'art-mona-lisa',
    title: 'المونا ليزا (Mona Lisa) - ليوناردو دا فينشي',
    projectName: 'Leonardo da Vinci (1503)',
    projectType: 'Masterpiece Oil Paintings',
    description: 'درجات الألوان الترابية الدافئة للوحة المونا ليزا الخالدة: البني السفياني، الزيتوني الضبابي، والذهبي الخافت.',
    harmonyType: 'Sfumato Earth Tones',
    tags: ['Masterpiece', 'Da Vinci', 'Renaissance', 'Portrait', 'Classic'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#78350F', name: 'Sienna Robe Umber', role: 'Primary', explanation: 'البني الدافئ لرداء المونا ليزا وظلال البورتريه الناعمة.' },
      { id: '2', hex: '#292524', name: 'Renaissance Dark Oak', role: 'Secondary', explanation: 'الخلفية القاتمة والظلال العميقة بأسلوب السفوماتو.' },
      { id: '3', hex: '#D97706', name: 'Amber Flesh Ochre', role: 'Accent', explanation: 'الوهج الذهبي الدافئ لبشرة الوجه واليدين.' },
      { id: '4', hex: '#4D7C0F', name: 'Muted Olive Veil', role: 'Monochromatic', explanation: 'الزيتوني الترابي الخافت للمناظر الطبيعية والوشاح.' }
    ]
  },
  {
    id: 'art-great-wave',
    title: 'الموجة الكبيرة في كاناغاوا (The Great Wave) - هوكوساي',
    projectName: 'Katsushika Hokusai (1831)',
    projectType: 'Masterpiece Oil Paintings',
    description: 'تناسق ألوان الطباعة اليابانية الخشبية الشهيرة: الأزرق البروسي الداكن، الأبيض الزبدي، والعاجي التراثي.',
    harmonyType: 'Traditional Japanese Contrast',
    tags: ['Masterpiece', 'Hokusai', 'Japanese Art', 'Ukiyo-e', 'Ocean'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#1E40AF', name: 'Prussian Indigo Wave', role: 'Primary', explanation: 'الأزرق البروسي العميق لجسم الموجة اليابانية العاتية.' },
      { id: '2', hex: '#0B132B', name: 'Deep Sea Abyss', role: 'Secondary', explanation: 'الكحلي الداكن لقاع البحر وظلال ظهيرة طوكيو.' },
      { id: '3', hex: '#FEF08A', name: 'Fuji Cream Dawn', role: 'Accent', explanation: 'اللون العاجي الدافئ لخلفية السماء وجبل فوجي.' },
      { id: '4', hex: '#E0F2FE', name: 'Ocean Foam White', role: 'Monochromatic', explanation: 'الأبيض الناصع مع لمسة زرقاء لزبد الموجة المترامي.' }
    ]
  },
  {
    id: 'art-the-kiss',
    title: 'القبلة (The Kiss) - غوستاف كليمت',
    projectName: 'Gustav Klimt (1907)',
    projectType: 'Masterpiece Oil Paintings',
    description: 'ألوان الرداء الذهبي المزين بالزخارف البراقة في لوحة القبلة للرسام غوستاف كليمت.',
    harmonyType: 'Golden Metallic Mosaic',
    tags: ['Masterpiece', 'Klimt', 'Gold Leaf', 'Art Nouveau', 'Romantic'],
    createdAt: Date.now(),
    colors: [
      { id: '1', hex: '#CA8A04', name: 'Imperial Gold Leaf', role: 'Primary', explanation: 'الرقائق الذهبية البراقة للرداء المزين بأشكال هندسية.' },
      { id: '2', hex: '#451A03', name: 'Bronze Bronze Charcoal', role: 'Secondary', explanation: 'الظلال البرونزية العميقة التي تمنح اللوحة ثراءً بصرياً.' },
      { id: '3', hex: '#EC4899', name: 'Mosaic Jewel Rose', role: 'Accent', explanation: 'الوردي الزاهي والورود الملونة في سجادة الزهور تحت القدمين.' },
      { id: '4', hex: '#FEF08A', name: 'Sunlit Aura Shimmer', role: 'Monochromatic', explanation: 'البريق الذهبي الفاتح للوهج المحيط بالعاشقين.' }
    ]
  }
];
