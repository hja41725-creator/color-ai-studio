export type ColorRole =
  | 'Primary'
  | 'Secondary'
  | 'Accent'
  | 'Monochromatic'
  | 'Background'
  | 'Surface'
  | 'Text'
  | 'Highlight';

export interface ColorItem {
  id: string;
  hex: string;
  name: string;
  role: ColorRole;
  explanation?: string;
  locked?: boolean;
}

export interface Palette {
  id: string;
  title: string;
  projectName?: string;
  projectType?: string;
  description: string;
  harmonyType?: string;
  tags?: string[];
  colors: ColorItem[];
  createdAt: number;
}

export type UIPreviewMode = 'dashboard' | 'mobile' | 'landing' | 'ecommerce' | 'cards';

export interface UIScreenshot {
  id: string;
  title: string;
  type: 'mobile' | 'dashboard' | 'landing';
  aspectRatio: string;
  imageUrl: string;
  prompt: string;
  description: string;
  appliedColors: { role: string; hex: string; name: string }[];
}

export type ActiveTab = 'generator' | 'harmony' | 'clockWheel' | 'image' | 'preview' | 'contrast' | 'shades' | 'simulator' | 'vault' | 'profile';

export interface UsedColor {
  id: string;
  hex: string;
  name: string;
  role?: string;
  paletteTitle?: string;
  timestamp: number;
  useCount: number;
}

export interface UserProfileData {
  name: string;
  title: string;
  avatarUrl?: string;
  bio: string;
  favoriteColorHex: string;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  verified: boolean;
  loggedInAt: number;
}

export interface ContrastResult {
  fgColor: string;
  bgColor: string;
  fgName: string;
  bgName: string;
  ratio: number;
  wcagAA: boolean;
  wcagAALarge: boolean;
  wcagAAA: boolean;
}
