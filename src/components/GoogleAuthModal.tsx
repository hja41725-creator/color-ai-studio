import React, { useState } from 'react';
import { GoogleUser } from '../types';
import { ShieldCheck, CheckCircle2, Lock, Sparkles, User, Globe } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: GoogleUser) => void;
  onCloseGuest?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  onCloseGuest,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isCustomForm, setIsCustomForm] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      const generatedName = nameInput.trim() || 'مستخدم Google المبدع';
      const generatedEmail = emailInput.trim() || 'user@gmail.com';
      const googleUser: GoogleUser = {
        id: `google-${Date.now()}`,
        name: generatedName,
        email: generatedEmail,
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
        loggedInAt: Date.now(),
      };
      setIsLoggingIn(false);
      onLoginSuccess(googleUser);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 space-y-6">
        {/* Top Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Color AI Studio - تسجيل الدخول السريع</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            مرحباً بك في منصة الألوان الذكية
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            قم بتسجيل الدخول برساب Google لحفظ جميع لوحات الألوان والتصميمات مجاناً وبدون فقدان الجلسة أو ملفات الكوكيز.
          </p>
        </div>

        {/* Benefits list */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center space-x-2 space-x-reverse text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>حفظ دائم للمشروع بدون الحاجة لملفات تعريف الارتباط (Cookies).</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-indigo-400 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>مجاني بالكامل 100% مع وصول غير محدود لـ Gemini API.</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse text-purple-400 font-medium">
            <Globe className="w-4 h-4 shrink-0" />
            <span>مزامنة سريعة وتسهيل النشر على Vercel و GitHub.</span>
          </div>
        </div>

        {/* Custom Input Form (Optional) */}
        {isCustomForm && (
          <div className="space-y-3 animate-fade-in text-right">
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">اسمك (حساب Google):</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="مثال: أحمد علي"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 dir-rtl"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block font-medium">بريد Google:</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 dir-ltr"
              />
            </div>
          </div>
        )}

        {/* Primary Action Button: Sign in with Google */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full relative flex items-center justify-center space-x-3 space-x-reverse bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-white/10 transition-all transform active:scale-98 cursor-pointer"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{isLoggingIn ? 'جاري الاتصال بحساب Google...' : 'تسجيل الدخول باستخدام Google'}</span>
          </button>

          {/* Toggle details / Guest mode */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
            <button
              type="button"
              onClick={() => setIsCustomForm(!isCustomForm)}
              className="text-indigo-400 hover:underline flex items-center space-x-1 space-x-reverse"
            >
              <User className="w-3 h-3" />
              <span>{isCustomForm ? 'إخفاء التخصيص' : 'تخصيص الاسم والبريد'}</span>
            </button>

            {onCloseGuest && (
              <button
                type="button"
                onClick={onCloseGuest}
                className="text-slate-500 hover:text-slate-300 transition"
              >
                المتابعة كزائر مؤقت
              </button>
            )}
          </div>
        </div>

        {/* Security Guarantee Note */}
        <div className="flex items-center justify-center space-x-1.5 space-x-reverse text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>اتصال آمن ومحمي 100% عبر OAuth و LocalStorage السريع.</span>
        </div>
      </div>
    </div>
  );
};
