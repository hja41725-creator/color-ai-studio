import { hexToRgb, rgbToHsl } from '../utils/colorUtils';

export interface WarmCoolColor {
  hex: string;
  nameAr: string;
  nameEn: string;
  temp: 'warm' | 'cool';
  descriptionAr: string;
}

export interface ColorPhilosophy {
  titleAr: string;
  titleEn: string;
  tempCategory: string;
  keywordsAr: string[];
  keywordsEn: string[];
  psychologyAr: string;
  psychologyEn: string;
  bestUseCasesAr: string[];
  bestUseCasesEn: string[];
  elementAr: string;
  colorFamily: string;
}

export const WARM_COLORS: WarmCoolColor[] = [
  { hex: '#EF4444', nameAr: 'أحمر ناري', nameEn: 'Flame Red', temp: 'warm', descriptionAr: 'طاقة، حماس، وجاذبية عالية' },
  { hex: '#DC2626', nameAr: 'أحمر قرمزي', nameEn: 'Crimson Red', temp: 'warm', descriptionAr: 'قوة، شغف، وشجاعة' },
  { hex: '#B91C1C', nameAr: 'عنابي دافئ', nameEn: 'Deep Burgundy', temp: 'warm', descriptionAr: 'فخامة دافئة وأصالة' },
  { hex: '#F97316', nameAr: 'برتقالي مشع', nameEn: 'Vibrant Orange', temp: 'warm', descriptionAr: 'ابتكار، بهجة، وحيوية' },
  { hex: '#EA580C', nameAr: 'برتقالي محروق', nameEn: 'Burnt Orange', temp: 'warm', descriptionAr: 'دفء الخريف والتراب' },
  { hex: '#FB923C', nameAr: 'مرجاني دافئ', nameEn: 'Warm Coral', temp: 'warm', descriptionAr: 'وداد، لطافة، وانفتاح' },
  { hex: '#F59E0B', nameAr: 'عنبري ذهبي', nameEn: 'Golden Amber', temp: 'warm', descriptionAr: 'ثراء، دفء، وإشراق' },
  { hex: '#EAB308', nameAr: 'ذهبي ناصع', nameEn: 'Bright Gold', temp: 'warm', descriptionAr: 'تألق، طاقة، ونجاح' },
  { hex: '#FACC15', nameAr: 'أصفر شمسي', nameEn: 'Solar Yellow', temp: 'warm', descriptionAr: 'تفاؤل، ذكاء، وأمل' },
  { hex: '#C2410C', nameAr: 'طيني دافئ', nameEn: 'Warm Terracotta', temp: 'warm', descriptionAr: 'أصالة، طبيعة ترابية، ودفء' },
  { hex: '#F43F5E', nameAr: 'وردي دافئ', nameEn: 'Warm Rose Pink', temp: 'warm', descriptionAr: 'رقة، عاطفة، وجاذبية' },
  { hex: '#E11D48', nameAr: 'أرجواني دافئ', nameEn: 'Warm Magenta', temp: 'warm', descriptionAr: 'جرأة، تميز، وشغف' },
];

export const COOL_COLORS: WarmCoolColor[] = [
  { hex: '#2563EB', nameAr: 'أزرق ملكي', nameEn: 'Royal Blue', temp: 'cool', descriptionAr: 'ثقة، موثوقية، واحترافية' },
  { hex: '#0284C7', nameAr: 'أزرق المحيط', nameEn: 'Ocean Blue', temp: 'cool', descriptionAr: 'عمق، هدوء، واستقرار' },
  { hex: '#38BDF8', nameAr: 'أزرق سماوي', nameEn: 'Sky Blue', temp: 'cool', descriptionAr: 'صفاء، حرية، واتساع' },
  { hex: '#06B6D4', nameAr: 'سايان جليدي', nameEn: 'Ice Cyan', temp: 'cool', descriptionAr: 'انتعاش، وضوح، وشفافية' },
  { hex: '#0D9488', nameAr: 'تيل زيتي', nameEn: 'Deep Teal', temp: 'cool', descriptionAr: 'توازن، عمق، وأناقة بصرية' },
  { hex: '#059669', nameAr: 'أخضر زمردي', nameEn: 'Emerald Green', temp: 'cool', descriptionAr: 'ازدهار، تجدد، ونمو' },
  { hex: '#10B981', nameAr: 'أخضر نعناعي', nameEn: 'Mint Green', temp: 'cool', descriptionAr: 'حيوية طبيعية وراحة' },
  { hex: '#16A34A', nameAr: 'أخضر غابات', nameEn: 'Forest Green', temp: 'cool', descriptionAr: 'استقرار بيئي وسلام' },
  { hex: '#4F46E5', nameAr: 'أزرق نيلي', nameEn: 'Indigo Blue', temp: 'cool', descriptionAr: 'حكمة، ذكاء، وعمق تفكير' },
  { hex: '#7C3AED', nameAr: 'بنفسجي ملكي', nameEn: 'Imperial Purple', temp: 'cool', descriptionAr: 'فخامة، إبداع، وغموض' },
  { hex: '#A855F7', nameAr: 'لافندر ناعم', nameEn: 'Soft Lavender', temp: 'cool', descriptionAr: 'سكون نفسي ورقي' },
  { hex: '#0891B2', nameAr: 'تركواز فيروزي', nameEn: 'Turquoise', temp: 'cool', descriptionAr: 'توازن روحي وانتعاش' },
];

export const CLOCK_HOURS_HUES = [
  { hour: 12, hue: 0, nameAr: 'الساعة 12: أحمر ناري', nameEn: '12 o\'clock: Fiery Red', hex: '#EF4444' },
  { hour: 1, hue: 30, nameAr: 'الساعة 1: برتقالي دافئ', nameEn: '1 o\'clock: Warm Orange', hex: '#F97316' },
  { hour: 2, hue: 60, nameAr: 'الساعة 2: أصفر شمسي', nameEn: '2 o\'clock: Sunny Yellow', hex: '#EAB308' },
  { hour: 3, hue: 90, nameAr: 'الساعة 3: أخضر حمضي', nameEn: '3 o\'clock: Lime Green', hex: '#84CC16' },
  { hour: 4, hue: 120, nameAr: 'الساعة 4: أخضر زمردي', nameEn: '4 o\'clock: Emerald Green', hex: '#10B981' },
  { hour: 5, hue: 150, nameAr: 'الساعة 5: أخضر زيتي تيل', nameEn: '5 o\'clock: Teal', hex: '#14B8A6' },
  { hour: 6, hue: 180, nameAr: 'الساعة 6: أزرق سايان', nameEn: '6 o\'clock: Cyan Sky', hex: '#06B6D4' },
  { hour: 7, hue: 210, nameAr: 'الساعة 7: أزرق سماوي', nameEn: '7 o\'clock: Ocean Blue', hex: '#0284C7' },
  { hour: 8, hue: 240, nameAr: 'الساعة 8: أزرق ملكي', nameEn: '8 o\'clock: Royal Blue', hex: '#3B82F6' },
  { hour: 9, hue: 290, nameAr: 'الساعة 9: أزرق نيلي بنفسجي', nameEn: '9 o\'clock: Indigo Violet', hex: '#6366F1' },
  { hour: 10, hue: 310, nameAr: 'الساعة 10: أرجواني فاخر', nameEn: '10 o\'clock: Purple Magenta', hex: '#A855F7' },
  { hour: 11, hue: 330, nameAr: 'الساعة 11: وردي ياقوتي', nameEn: '11 o\'clock: Ruby Rose', hex: '#EC4899' },
];

export function getColorPhilosophy(hex: string): ColorPhilosophy {
  const rgb = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Very dark or very desaturated neutral
  if (l < 15) {
    return {
      titleAr: 'فلسفة اللون الأسود والداكن',
      titleEn: 'Black & Dark Philosophy',
      tempCategory: 'محايد/متوازن (Neutral)',
      keywordsAr: ['الهيبة', 'الأناقة', 'القوة', 'الغموض', 'الفخامة الرسمية'],
      keywordsEn: ['Prestige', 'Elegance', 'Power', 'Mystery', 'Formal Luxury'],
      psychologyAr: 'يعبر اللون الأسود والدرجات الداكنة عن القوة المطلقة والأناقة الكلاسيكية والهيبة. يمنح شعوراً بالغموض والجدية والعمق، ويُستخدم في التصاميم الفاخرة لإبراز التباين والجمال العالي.',
      psychologyEn: 'Black and deep shades symbolize authority, classic elegance, and prestige. They evoke mystery, sophistication, and high contrast.',
      bestUseCasesAr: ['علامات الأزياء الفاخرة', 'السيارات الفارهة', 'عناصر التباين العالي', 'تكنولوجيا النخبة'],
      bestUseCasesEn: ['Luxury Fashion', 'High-end Automotive', 'High-Contrast UI', 'Premium Tech'],
      elementAr: 'عنصر الأناقة والثبات',
      colorFamily: 'أسود ومحايد داكن',
    };
  }

  if (l > 88) {
    return {
      titleAr: 'فلسفة اللون الأبيض والنقاء',
      titleEn: 'White & Pure Philosophy',
      tempCategory: 'محايد/متوازن (Neutral)',
      keywordsAr: ['النقاء', 'البساطة', 'الوضوح', 'السلام', 'المساحة'],
      keywordsEn: ['Purity', 'Simplicity', 'Clarity', 'Peace', 'Minimalism'],
      psychologyAr: 'يرمز الأبيض والدرجات المضيئة إلى البساطة والنقاء والتجدد. يمنح العين راحة بصرية ومساحة للتنفس، مما يعزز سهولة القراءة والانطباع بالشفافية والراحة.',
      psychologyEn: 'White signifies purity, minimalism, and mental space. It gives viewers room to breathe and communicates openness and trust.',
      bestUseCasesAr: ['الخلفيات الواضحة', 'المستشفيات والصحة', 'التصميم المينيماليست', 'العلامات الصحية'],
      bestUseCasesEn: ['Clean Canvas UI', 'Healthcare', 'Minimalist Design', 'Wellness Brands'],
      elementAr: 'عنصر النقاء والسلام',
      colorFamily: 'أبيض ومحايد مضيء',
    };
  }

  // Hue based classification
  if ((h >= 0 && h < 15) || h >= 345) {
    return {
      titleAr: 'فلسفة اللون الأحمر (Red Philosophy)',
      titleEn: 'Red & Crimson Psychology',
      tempCategory: 'حار (Warm)',
      keywordsAr: ['الشغف', 'الطاقة', 'الحيوية', 'القوة', 'الإثارة والسرعة'],
      keywordsEn: ['Passion', 'Energy', 'Vitality', 'Power', 'Urgency'],
      psychologyAr: 'اللون الأحمر هو لون العاطفة الجياشة والحيوية القصوى. يحفز نبضات القلب والنشاط، ويجذب الانتباه بجرأة. يرمز للشجاعة والمبادرة والقيادة والاندفاع الإيجابي.',
      psychologyEn: 'Red represents intense passion, energy, and action. It captures attention quickly, triggers physical response, and communicates strength and bold leadership.',
      bestUseCasesAr: ['أزرار الدعوة للإجراء (CTA)', 'المنتجات الرياضية', 'علامات المطاعم والأغذية', 'التنبيهات العاجلة'],
      bestUseCasesEn: ['Primary Call to Actions (CTA)', 'Sports & Fitness', 'Food & Dining', 'Urgent Alerts'],
      elementAr: 'عنصر النار والشغف 🔥',
      colorFamily: 'أحمر ناري / قرمزي',
    };
  }

  if (h >= 15 && h < 45) {
    return {
      titleAr: 'فلسفة اللون البرتقالي (Orange Philosophy)',
      titleEn: 'Orange & Coral Psychology',
      tempCategory: 'حار (Warm)',
      keywordsAr: ['الابتكار', 'الحماس', 'الوداد', 'البهجة', 'الطاقة الشابة'],
      keywordsEn: ['Creativity', 'Enthusiasm', 'Friendliness', 'Joy', 'Youthful Energy'],
      psychologyAr: 'يمزج البرتقالي بين طاقة الأحمر وبهجة الأصفر. يعبر عن الروح الودودة والابتكار المستمر والانفتاح على الآخرين. يبعث الدفء دون إلحاح ويحفز النشاط الذهني والاجتماعي.',
      psychologyEn: 'Orange combines the energy of red with the happiness of yellow. It evokes warmth, friendliness, innovation, and cheerful social interaction.',
      bestUseCasesAr: ['منصات الابتكار والتعليم', 'التطبيقات الترفيهية', 'التسويق التفاعلي', 'منتجات الشباب'],
      bestUseCasesEn: ['EdTech & Innovation', 'Entertainment Apps', 'Interactive Marketing', 'Youth Brands'],
      elementAr: 'عنصر الدفء والإبداع ☀️',
      colorFamily: 'برتقالي مشرق / مرجاني',
    };
  }

  if (h >= 45 && h < 70) {
    return {
      titleAr: 'فلسفة اللون الأصفر (Yellow Philosophy)',
      titleEn: 'Yellow & Amber Psychology',
      tempCategory: 'حار (Warm)',
      keywordsAr: ['التفاؤل', 'الذكاء', 'البهجة', 'الوضوح', 'الإشراق الشمسي'],
      keywordsEn: ['Optimism', 'Intellect', 'Joy', 'Clarity', 'Sunlight'],
      psychologyAr: 'الأصفر هو لون أشعة الشمس والضوء المشرق. يحفز التفكير الإيجابي ونشاط الذاكرة والتركيز العالي. يرمز للأمل والسرور والأفكار الجديدة الملهمة.',
      psychologyEn: 'Yellow is the color of sunshine and mental clarity. It stimulates memory, intellectual activity, optimism, and bright creative ideas.',
      bestUseCasesAr: ['إبراز النقاط المهمة (Highlights)', 'علامات الأطفال والبهجة', 'التنبيهات الذكية', 'التطبيقات الإبداعية'],
      bestUseCasesEn: ['Highlights & Badges', 'Children & Joy Brands', 'Smart Notifications', 'Creative Software'],
      elementAr: 'عنصر ضوء الشمس والتفاؤل 💛',
      colorFamily: 'أصفر شمسي / عنبري',
    };
  }

  if (h >= 70 && h < 165) {
    return {
      titleAr: 'فلسفة اللون الأخضر (Green Philosophy)',
      titleEn: 'Green & Emerald Psychology',
      tempCategory: 'بارد/متوازن (Cool/Balanced)',
      keywordsAr: ['النمو', 'الطبيعة', 'التوازن', 'الصحة', 'الازدهار المالي'],
      keywordsEn: ['Growth', 'Nature', 'Balance', 'Health', 'Prosperity'],
      psychologyAr: 'الأخضر هو لون الحياة والتجدد والازدهار. يبعث الطمأنينة والسلام النفسي للعين والعقل، ويرتبط بالتوازن البيئي والرخاء والراحة المستدامة.',
      psychologyEn: 'Green represents nature, renewal, and financial growth. It brings a relaxing, restorative sensation to the mind, symbolizing safety, health, and stability.',
      bestUseCasesAr: ['التكنولوجيا المالية (FinTech)', 'المنتجات العضوية والبيئة', 'التطبيقات الصحية', 'مؤشرات النجاح والاكتمل'],
      bestUseCasesEn: ['FinTech & Banking', 'Organic & Eco Brands', 'Health & Wellness', 'Success Indicators'],
      elementAr: 'عنصر الطبيعة والازدهار 🌿',
      colorFamily: 'أخضر طبيعي / زمردي',
    };
  }

  if (h >= 165 && h < 200) {
    return {
      titleAr: 'فلسفة اللون التوركواز والسايان (Cyan Philosophy)',
      titleEn: 'Cyan & Teal Psychology',
      tempCategory: 'بارد (Cool)',
      keywordsAr: ['الانتعاش', 'النقاء', 'التوازن الذهني', 'الصفاء', 'الهدوء المائي'],
      keywordsEn: ['Refreshment', 'Purity', 'Mental Balance', 'Clarity', 'Tranquility'],
      psychologyAr: 'يمزج التوركواز بين صفاء الأزرق ونمو الأخضر. يمنح شعوراً منعشاً بالنقاء والوضوح الفكري والهدوء الداخلي، ويعزز التواصل الصادق والمرونة.',
      psychologyEn: 'Cyan/Teal blends the calmness of blue with the growth of green. It promotes mental clarity, refreshing perspective, and tranquil communication.',
      bestUseCasesAr: ['منتجات العناية بالبشرة', 'التكنولوجيا النظيفة', 'تطبيقات التأمل والهدوء', 'السياحة والبحر'],
      bestUseCasesEn: ['Skincare & Beauty', 'Clean Tech', 'Meditation & Calm Apps', 'Travel & Ocean'],
      elementAr: 'عنصر الماء الصافي 🌊',
      colorFamily: 'توركواز / أزرق زيتي',
    };
  }

  if (h >= 200 && h < 260) {
    return {
      titleAr: 'فلسفة اللون الأزرق (Blue Philosophy)',
      titleEn: 'Blue & Navy Psychology',
      tempCategory: 'بارد (Cool)',
      keywordsAr: ['الثقة', 'الأمان', 'الاحترافية', 'الحكمة', 'الاستقرار العميق'],
      keywordsEn: ['Trust', 'Security', 'Professionalism', 'Wisdom', 'Deep Stability'],
      psychologyAr: 'الأزرق هو لون السماء والبحر المحيط. يرمز للموثوقية العالية والأمان والأصالة. يقلل التوتر ويرسخ الشعور بالاحترافية والثقة في الهويات المؤسسية.',
      psychologyEn: 'Blue evokes absolute trust, reliability, and security. It calms the mind, builds institutional confidence, and represents wisdom and stability.',
      bestUseCasesAr: ['البنوك والمؤسسات المالية', 'شركات التكنولوجيا والبرمجيات', 'الهويات الرسمية', 'الخدمات السحابية'],
      bestUseCasesEn: ['Banking & Finance', 'Tech & Software', 'Enterprise & Corporate', 'Cloud Platforms'],
      elementAr: 'عنصر السماء والأفق 🌌',
      colorFamily: 'أزرق ملكي / محيطي',
    };
  }

  if (h >= 260 && h < 315) {
    return {
      titleAr: 'فلسفة اللون البنفسجي (Purple Philosophy)',
      titleEn: 'Purple & Violet Psychology',
      tempCategory: 'بارد (Cool)',
      keywordsAr: ['الفخامة', 'الملكية', 'الغموض', 'الإبداع الفني', 'الروحانية'],
      keywordsEn: ['Luxury', 'Royalty', 'Mystery', 'Artistic Creativity', 'Spirituality'],
      psychologyAr: 'النيلي والبنفسجي يجمعان بين استقرار الأزرق وطاقة الأحمر. يمثلان النبل والابتكار الاستثنائي والعمق الفلسفي والرفاهية العالية في التصميم.',
      psychologyEn: 'Purple blends blue stability with red passion. It symbolizes luxury, creative imagination, high nobility, and visionary innovation.',
      bestUseCasesAr: ['تطبيقات الذكاء الاصطناعي (AI)', 'منتجات التجميل الفاخرة', 'الخدمات الاستشارية المتقدمة', 'العلامات المبتكرة'],
      bestUseCasesEn: ['AI Platforms', 'Luxury Beauty', 'High-end Consulting', 'Visionary Tech'],
      elementAr: 'عنصر الإبداع والعمق ✨',
      colorFamily: 'بنفسجي / نيلي ملكي',
    };
  }

  // Pink / Magenta
  return {
    titleAr: 'فلسفة اللون الوردي والأرجواني (Pink Philosophy)',
    titleEn: 'Pink & Rose Psychology',
    tempCategory: 'حار ناعم (Warm Soft)',
    keywordsAr: ['التعاطف', 'الرقة', 'الأنوثة', 'المودة', 'اللطف والرعاية'],
    keywordsEn: ['Compassion', 'Elegance', 'Softness', 'Affections', 'Care'],
    psychologyAr: 'الوردي هو لون العاطفة اللطيفة والاهتمام والرقة. يبعث على الراحة النفسية والمودة والمشاعر الصادقة، ويضفي لمسة إنسانية دافئة.',
    psychologyEn: 'Pink communicates gentle affection, compassion, and warmth. It softens visual intensity and adds a personal, caring human touch.',
    bestUseCasesAr: ['العناية الشخصية والجمال', 'منتجات الهدايا والعاطفة', 'الموضة والأسلوب', 'المجتمعات اللطيفة'],
    bestUseCasesEn: ['Personal Care & Beauty', 'Gifts & Sentiment', 'Fashion & Lifestyle', 'Community Apps'],
    elementAr: 'عنصر الرقة والوداد 🌸',
    colorFamily: 'وردي ناعم / ياقوتي',
  };
}
