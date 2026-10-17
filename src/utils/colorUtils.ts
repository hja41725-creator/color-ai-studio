import { ColorItem, ColorRole, ContrastResult, Palette } from '../types';

// Converts HEX to RGB {r, g, b}
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Converts RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Converts RGB to HSL {h: 0-360, s: 0-100, l: 0-100}
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Converts HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

// Calculates RGB to CMYK
export function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, Math.min(m, y));

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  c = Math.round(((c - k) / (1 - k)) * 100);
  m = Math.round(((m - k) / (1 - k)) * 100);
  y = Math.round(((y - k) / (1 - k)) * 100);
  k = Math.round(k * 100);

  return { c, m, y, k };
}

// WCAG Relative Luminance
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// WCAG Contrast Ratio
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

// Evaluate contrast
export function evaluateContrast(
  fgColor: string,
  bgColor: string,
  fgName: string = 'Foreground',
  bgName: string = 'Background'
): ContrastResult {
  const ratio = getContrastRatio(fgColor, bgColor);
  return {
    fgColor,
    bgColor,
    fgName,
    bgName,
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAALarge: ratio >= 3.0,
    wcagAAA: ratio >= 7.0,
  };
}

// Check if color is light or dark for optimal readable text overlay
export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  // Perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150;
}

// Generate 50-900 Tailwind scale for a color
export function generateColorScale(baseHex: string): { step: string; hex: string }[] {
  const { h, s } = rgbToHsl(
    hexToRgb(baseHex).r,
    hexToRgb(baseHex).g,
    hexToRgb(baseHex).b
  );

  const steps = [
    { step: '50', lightness: 96 },
    { step: '100', lightness: 90 },
    { step: '200', lightness: 80 },
    { step: '300', lightness: 70 },
    { step: '400', lightness: 60 },
    { step: '500', lightness: 50 },
    { step: '600', lightness: 40 },
    { step: '700', lightness: 30 },
    { step: '800', lightness: 20 },
    { step: '900', lightness: 10 },
    { step: '950', lightness: 5 },
  ];

  return steps.map(({ step, lightness }) => ({
    step,
    hex: hslToHex(h, s, lightness),
  }));
}

// Generate mathematical color harmonies given a base hex
export function generateMathematicalHarmony(
  baseHex: string,
  type: 'Analogous' | 'Complementary' | 'Triadic' | 'Split-Complementary' | 'Monochromatic'
): ColorItem[] {
  const rgb = hexToRgb(baseHex);
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const roles: ColorRole[] = ['Primary', 'Secondary', 'Accent', 'Background', 'Surface', 'Highlight'];

  let angles: number[] = [];

  switch (type) {
    case 'Analogous':
      angles = [0, -30, 30, -60, 60];
      break;
    case 'Complementary':
      angles = [0, 180, 15, 195, -15];
      break;
    case 'Triadic':
      angles = [0, 120, 240, 60, 180];
      break;
    case 'Split-Complementary':
      angles = [0, 150, 210, 30, 330];
      break;
    case 'Monochromatic':
      // Adjust lightness instead
      return [0, 1, 2, 3, 4].map((idx) => {
        const adjustedL = Math.max(10, Math.min(90, 20 + idx * 16));
        const hex = hslToHex(h, s, adjustedL);
        return {
          id: Math.random().toString(36).substring(2, 9),
          hex,
          name: `${type} ${idx + 1}`,
          role: roles[idx] || 'Accent',
        };
      });
  }

  return angles.map((angle, idx) => {
    const targetH = (h + angle + 360) % 360;
    const hex = hslToHex(targetH, s, l);
    return {
      id: Math.random().toString(36).substring(2, 9),
      hex,
      name: `${type} Shift ${angle > 0 ? '+' : ''}${angle}°`,
      role: roles[idx] || 'Accent',
    };
  });
}

// Client-side canvas dominant color extractor from Image
export async function extractImageColorsCanvas(imageUrl: string, maxColors = 5): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);

      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imgData = ctx.getImageData(0, 0, 100, 100).data;
      const colorCounts: Record<string, number> = {};

      for (let i = 0; i < imgData.length; i += 16) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const a = imgData[i + 3];

        if (a < 128) continue; // Skip semi-transparent pixels

        // Quantize colors to reduce noise
        const qr = Math.round(r / 20) * 20;
        const qg = Math.round(g / 20) * 20;
        const qb = Math.round(b / 20) * 20;

        const hex = rgbToHex(qr, qg, qb);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([hex]) => hex)
        .slice(0, maxColors);

      resolve(sorted);
    };

    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
}

// Generate a unique shareable public URL containing current palette structure (compact short URL format)
export function generateShareableUrl(palette: Palette, mode: 'compact' | 'full' = 'compact'): string {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    if (mode === 'compact') {
      const hexes = palette.colors.map((c) => c.hex.replace('#', '')).join('-');
      const titleParam = encodeURIComponent(palette.title);
      return `${origin}?c=${hexes}&t=${titleParam}`;
    } else {
      const payload = {
        t: palette.title,
        p: palette.projectName,
        c: palette.colors.map((c) => ({
          r: c.role,
          h: c.hex.replace('#', ''),
          n: c.name,
        })),
      };
      const jsonStr = JSON.stringify(payload);
      const base64 = btoa(encodeURIComponent(jsonStr));
      return `${origin}?p=${base64}`;
    }
  } catch {
    return typeof window !== 'undefined' ? window.location.href : '';
  }
}

// Parse palette from public URL search parameters if available
export function parsePaletteFromUrl(): Palette | null {
  try {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);

    // 1. Check compact short URL format: ?c=4F46E5-06B6D4-10B981
    const compactHexes = params.get('c');
    if (compactHexes) {
      const hexList = compactHexes.split(/[-_,\s]+/).filter((h) => /^[0-9a-fA-F]{3,8}$/.test(h));
      if (hexList.length > 0) {
        const title = params.get('t') ? decodeURIComponent(params.get('t')!) : 'لوحة ألوان مشاركة';
        const roles: ColorItem['role'][] = ['Primary', 'Secondary', 'Accent', 'Background', 'Surface', 'Text'];
        return {
          id: `shared-compact-${Date.now()}`,
          title: title,
          projectName: 'مشاركة رابط مختصر',
          description: 'تم استيراد لوحة الألوان هذه عبر رابط مختصر مشارك',
          createdAt: Date.now(),
          colors: hexList.map((h, idx) => ({
            id: `color-shared-${idx}-${Date.now()}`,
            hex: `#${h}`,
            role: roles[idx % roles.length],
            name: `لون ${idx + 1}`,
            locked: false,
          })),
        };
      }
    }

    // 2. Check full base64 format: ?p=...
    const encoded = params.get('p') || params.get('palette');
    if (encoded) {
      const jsonStr = decodeURIComponent(atob(encoded));
      const data = JSON.parse(jsonStr);
      if (data && Array.isArray(data.c) && data.c.length > 0) {
        return {
          id: `shared-${Date.now()}`,
          title: data.t || 'Shared Palette',
          projectName: data.p || 'Shared Project',
          description: data.d || 'Shared color palette imported via unique URL',
          createdAt: Date.now(),
          colors: data.c.map((item: any, idx: number) => ({
            id: `color-shared-${idx}-${Date.now()}`,
            hex: item.h ? `#${item.h}` : '#4F46E5',
            role: item.r || 'Primary',
            name: item.n || `Color ${idx + 1}`,
            locked: false,
          })),
        };
      }
    }
  } catch (err) {
    console.warn('Could not parse shared palette URL:', err);
  }
  return null;
}

