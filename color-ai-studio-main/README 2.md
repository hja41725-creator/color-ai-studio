# 🎨 Color AI Studio - منصة تحليل وتوليد الألوان بالذكاء الاصطناعي

تطبيق ويب متكامل واحترافي مبني باستخدام **React + TypeScript + Tailwind CSS + Express** ومدمج مع **Gemini 3.6 Flash API**.

---

## 🚀 كيفية النشر المباشر على Vercel أو GitHub

### 1. النشر على GitHub (Upload to GitHub)
1. قم بإنشاء مستودع جديد (Repository) على حسابك في **GitHub**.
2. ارفع كافة ملفات هذا المشروع إلى مستودعك عبر Git أو الرفع المباشر:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Color AI Studio"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

---

### 2. النشر السريع على Vercel (Deploy to Vercel)
تطبيقنا مجهز بملف `vercel.json` وملف `api/index.ts` لدعم دمج الواجهة الأمامية والإنشاء التلقائي لخوادم Serverless Functions:

1. افتح موقع **[Vercel](https://vercel.com)** وسجّل الدخول بحسابك.
2. اضغط على **"Add New Project"** ثم اختر **GitHub Repository** الخاص بالمشروع.
3. في إعدادات البيئة **Environment Variables** أضف المفتاح التالي:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** مفتاح API الخاص بك من Google AI Studio (`https://aistudio.google.com/app/apikey`).
4. اضغط على **"Deploy"**. سيقوم Vercel ببناء المشروع ونشره فوراً وتوفير رابط مجاني مثل `https://your-app.vercel.app`.

---

## 🛠️ التشغيل والتطوير المحلي (Local Development)

### التثبيت والأوامر:
```bash
# تثبيت الحزم والمكتبات
npm install

# تشغيل خادم التطوير المحلي
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل النسخة المبنية
npm start
```

### متغيرات البيئة (.env)
قم بإنشاء ملف `.env` في المجلد الرئيسي وأضف:
```env
GEMINI_API_KEY="your_actual_gemini_api_key"
```

---

## 📁 هيكلية ملفات المشروع:
- `src/App.tsx`: مكون التطبيق الرئيسي وإدارة التبويبات والملاحة.
- `src/components/`: المكونات التفاعلية (UserProfile, ColorTheoryEditor, AIPaletteGenerator, ClockColorWheel, LiveUIPreview, ShareModal...).
- `src/data/colorPhilosophyData.ts`: القواعد والسيكولوجيات الفلسفية للتحليل العربي والأجنبي للألوان.
- `server.ts`: خادم Express متكامل لمعالجة طلبات الذكاء الاصطناعي مع Gemini API وتصوير واجهات المستخدم.
- `api/index.ts`: نقطة انطلاق Serverless للعمل التلقائي على منصة Vercel.
- `vercel.json`: إعدادات توجيه المسارات والمحاكاة لـ Vercel.
