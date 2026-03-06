​📖 المرجع الكامل لواجهة برمجيات القرآن الكريم (Quran API)
​هذا الملف يحتوي على شرح تفصيلي وممل لكل رابط في الـ API الخاص بك المستضاف على Vercel، مع روابط مباشرة وتطبيقات برمجية.
​🔗 المعلومات الأساسية
​رابط السيرفر: https://quran-api-teal-eight.vercel.app
​نقطة الوصول (Endpoint): /api/surah
​🛠️ الفهارس العامة (Global Indexes)
​تستخدم هذه الروابط لبناء القوائم الرئيسية ومفاتيح الاختيار في موقعك.
​1. قائمة السور الكاملة (surah.json)
​يحتوي على اسم السورة (عربي/إنجليزي)، عدد الآيات، مكان النزول، ورقم الجزء.
​الرابط المباشر: https://quran-api-teal-eight.vercel.app/api/surah?type=list
​الاستخدام: لجلب قائمة الـ 114 سورة وعرضها في القائمة الجانبية.
​2. فهرس الأجزاء الثلاثين (juz.json)
​يحدد بداية ونهاية كل جزء من أجزاء القرآن.
​الرابط المباشر: https://quran-api-teal-eight.vercel.app/api/surah?type=juz
​الاستخدام: لتقسيم التصفح بناءً على الأجزاء (مثلاً: الجزء الأول، الجزء الثاني).
​📄 محتوى السور والآيات (Surah Content)
​يتم جلب المحتوى بتغيير متغير id (رقم السورة من 1 إلى 114).
​1. نص الآيات العادي (Simple Script)
​الوصف: جلب نص الآيات الصافي.
​الرابط (سورة رقم 6): https://quran-api-teal-eight.vercel.app/api/surah?id=6
​2. نص الآيات بالتجويد (Tajweed Script)
​الوصف: جلب النص مع رموز وقواعد التجويد الملونة.
​الرابط (سورة رقم 6): https://quran-api-teal-eight.vercel.app/api/surah?id=6&type=tajweed
​🔊 نظام الصوتيات (Audio Files)
​يتعامل هذا الرابط مع المجلدات الثلاثية (مثل 006) ويقرأ ملف index.json الخاص بكل سورة.
​بيانات روابط الصوت
​الوصف: يعيد روابط ملفات الـ mp3 الخاصة بالسورة، بما في ذلك ملف الاستعاذة والبسملة 000.mp3.
​الرابط (سورة رقم 6): https://quran-api-teal-eight.vercel.app/api/surah?id=6&type=audio
​🌍 التراجم واللغات (Translations)
​يمكنك اختيار اللغة عبر متغير lang.
اللغة الرابط المباشر (لسورة الأنعام رقم 6)
العربية رابط الترجمة العربية
الإنجليزية رابط الترجمة الإنجليزية
الإندونيسية رابط الترجمة الإندونيسية
💻 دليل الدمج البرمجي (Integration Guide)
​إليك كيف تضع هذه الروابط في كود موقعك لجلب المحتوى:
​1. جلب بيانات السورة (JavaScript Fetch)
// دالة لجلب البيانات
async function fetchSurah(surahNumber) {
    const url = `https://quran-api-teal-eight.vercel.app/api/surah?id=${surahNumber}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log("آيات السورة:", result.data);
    } catch (error) {
        console.error("فشل الجلب:", error);
    }
}

// مثال للاستخدام لسورة رقم 6
fetchSurah(6);
2.جلب الصوت وتشغيله
async function playAudio(surahId) {
    const audioDataRes = await fetch(`https://quran-api-teal-eight.vercel.app/api/surah?id=${surahId}&type=audio`);
    const audioData = await audioDataRes.json();
    
    // تشغيل ملف الاستعاذة (000.mp3)
    const introPath = audioData.data.verses[0].audio_url; 
    const player = new Audio(introPath);
    player.play();
}
⚡ ملاحظات الأداء (Speed Optimization)
​CORS Enabled: يمكنك طلب هذه الروابط من أي موقع (Localhost أو Domain) دون مشاكل.
​Serverless Speed: الكود مبرمج ليعالج الملفات من الذاكرة مباشرة لضمان أقل وقت استجابة.
​Error Handling: في حال طلب رقم سورة غير صحيح (أكبر من 114)، سيعيد الـ API رسالة خطأ واضحة (404).
