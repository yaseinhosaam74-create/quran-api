# 🕋 Quran API Documentation (v1.0.0)

مرحباً بك في الوثائق الرسمية والمفصلة لواجهة برمجة تطبيقات القرآن الكريم الخاصة بك. تم تصميم هذا الـ API ليكون **فائق السرعة** وسهل الدمج في أي موقع إلكتروني أو تطبيق موبايل.

---

## 🚀 الرابط الأساسي للمشروع (Production URL)
**Base URL:** `https://quran-api-teal-eight.vercel.app/api/surah`

---

## 📂 أولاً: الفهارس والقوائم العامة (Global Endpoints)
تستخدم هذه الروابط لجلب البيانات الهيكلية للمصحف لبناء القوائم الجانبية أو شاشات الاختيار.

### 1. قائمة السور الشاملة (Surah List)
يجلب هذا الرابط كافة المعلومات الأساسية عن الـ 114 سورة (الاسم بالعربي والإنجليزي، مكان النزول، عدد الآيات، رقم الصفحة).
- **الرابط:** `?type=list`
- **رابط مباشر:** [اضغط هنا للعرض](https://quran-api-teal-eight.vercel.app/api/surah?type=list)

### 2. فهرس الأجزاء (Juz Index)
يجلب تقسيم القرآن إلى 30 جزءاً، مع تحديد بداية ونهاية كل جزء (رقم السورة ورقم الآية).
- **الرابط:** `?type=juz`
- **رابط مباشر:** [اضغط هنا للعرض](https://quran-api-teal-eight.vercel.app/api/surah?type=juz)

### 3. فهرس السور البديل (Secondary Index)
نسخة إضافية من البيانات لدعم التوافق مع تطبيقات مختلفة.
- **الرابط:** `?type=surahs_index`
- **رابط مباشر:** [اضغط هنا للعرض](https://quran-api-teal-eight.vercel.app/api/surah?type=surahs_index)

---

## 📖 ثانياً: محتوى السور (Surah Specific Content)
لجلب بيانات سورة معينة، يجب استخدام المعرف `id` (رقم السورة من 1 إلى 114).

### 1. النص القرآني العادي (Simple Text)
يجلب نص الآيات الخام المناسب للقراءة العادية.
- **الصيغة:** `?id={رقم_السورة}`
- **مثال (سورة الأنعام - 6):** [عرض السورة](https://quran-api-teal-eight.vercel.app/api/surah?id=6)

### 2. نص التجويد الملون (Tajweed Script)
يجلب النص مع رموز وقواعد التجويد (مثل الإدغام، الإخفاء، القلقلة) ليتم تلوينها في التطبيق.
- **الصيغة:** `?id={رقم_السورة}&type=tajweed`
- **مثال (سورة الكهف - 18):** [عرض التجويد](https://quran-api-teal-eight.vercel.app/api/surah?id=18&type=tajweed)

---

## 🔊 ثالثاً: نظام الصوتيات (Audio Engine)
يدعم النظام الوصول إلى المجلدات الصوتية الثلاثية (001, 002...) ويجلب ملفات الـ mp3 المسجلة في كل سورة.

### جلب روابط الصوت
يعيد هذا الرابط قائمة بكافة الآيات وروابطها الصوتية، بما في ذلك ملف الاستعاذة والبسملة **`000.mp3`**.
- **الصيغة:** `?id={رقم_السورة}&type=audio`
- **مثال (سورة يس - 36):** [عرض روابط الصوت](https://quran-api-teal-eight.vercel.app/api/surah?id=36&type=audio)

---

## 🌍 رابعاً: التراجم واللغات (Multi-Language Support)
يمكنك طلب ترجمة أي سورة بأي لغة مدعومة في قاعدة بياناتك.

| اللغة | كود اللغة (`lang`) | مثال رابط سورة الفاتحة (1) |
| :--- | :--- | :--- |
| **العربية** | `ar` | [رابط مباشر](https://quran-api-teal-eight.vercel.app/api/surah?id=1&type=translation&lang=ar) |
| **الإنجليزية** | `en` | [رابط مباشر](https://quran-api-teal-eight.vercel.app/api/surah?id=1&type=translation&lang=en) |
| **الإندونيسية** | `id` | [رابط مباشر](https://quran-api-teal-eight.vercel.app/api/surah?id=1&type=translation&lang=id) |

---

## 🛠️ خامساً: كيفية استخدام الـ API في موقعك (Developer Guide)

إليك أفضل طريقة برمجية لجلب البيانات وعرضها باستخدام JavaScript.

### 1. جلب ترجمة سورة محددة (مثال سورة 74 - English)
```javascript
const getTranslation = async () => {
  const surahId = 74;
  const lang = 'en';
  const url = `https://quran-api-teal-eight.vercel.app/api/surah?id=${surahId}&type=translation&lang=${lang}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log("الترجمة الإنجليزية:", result.data);
  } catch (err) {
    console.error("خطأ في جلب البيانات:", err);
  }
};

2. تشغيل ملف الصوت (000.mp3)
async function playIntro(id) {
  const response = await fetch(`https://quran-api-teal-eight.vercel.app/api/surah?id=${id}&type=audio`);
  const audioData = await response.json();
  
  // ملف 000.mp3 يكون عادةً أول عنصر في المصفوفة
  const introUrl = audioData.data.verses[0].audio_url; 
  const audio = new Audio(introUrl);
  audio.play();
}

⚡ ملاحظات تقنية هامة
​CORS: الـ API يدعم الوصول من جميع النطاقات، مما يجعله مثالياً لتطبيقات الويب والموبايل.
​الاستجابة: يتم إرسال البيانات بصيغة JSON منظمة لسهولة المعالجة.
​أرقام المعرفات: تأكد أن الـ id دائماً بين 1 و 114.
​تم إنشاء هذا التوثيق لضمان تشغيل مشروعك "بسرعة الصاروخ".