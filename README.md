# ⚡ التوثيق الشامل لواجهة برمجة تطبيقات القرآن الكريم (Quran API)

هذا التوثيق مخصص للمطورين لشرح كيفية استهلاك واجهة برمجة التطبيقات (API) الخاصة بالقرآن الكريم، والتي توفر النص القرآني، التجويد الملون، الصوتيات، والتفسير بسرعة فائقة.

---

## 🔗 الرابط الأساسي (Base URL)
جميع الطلبات يجب أن توجه إلى الرابط التالي كقاعدة أساسية:
`https://quran-api-henna-iota.vercel.app/api/surah`

---

## 🛠️ كيفية الاستخدام (Endpoints & Parameters)

الـ API يعمل بنظام إرسال المتغيرات (Query Parameters) في الرابط لتحديد نوع البيانات المطلوبة:

* **`?type=list`** : يجلب فهرس القرآن بالكامل (114 سورة).
* **`?id={1-114}`** : يجلب النص القرآني العادي للسورة المطلوبة.
* **`?id={1-114}&type=tajweed`** : يجلب النص القرآني متضمناً أكواد التلوين لأحكام التجويد.
* **`?id={1-114}&type=audio`** : يجلب روابط ملفات (MP3) لكل آية في السورة.
* **`?id={1-114}&type=translation&lang=ar`** : يجلب التفسير/الترجمة العربية لآيات السورة.

---

## 💻 دليل التكامل البرمجي (Integration Guide)

لجلب هذه البيانات وعرضها بشكل حقيقي 100% داخل أي موقع، استخدم أكواد الجافا سكريبت التالية نصاً.

### 1. دالة الجلب الموحدة
```javascript
async function fetchApiData(params) {
    const query = new URLSearchParams(params).toString();
    const url = `https://quran-api-henna-iota.vercel.app/api/surah?${query}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.success ? result.data : null;
}

2. دالة جلب وعرض قائمة السور بالكامل
async function renderSurahsList() {
    const listContainer = document.getElementById('surah-list');
    const surahs = await fetchApiData({ type: 'list' });
    
    listContainer.innerHTML = '';
    surahs.forEach(surah => {
        const item = document.createElement('div');
        item.className = 'surah-item';
        item.innerText = `${surah.id} - ${surah.name} (${surah.verses_count} آية)`;
        item.onclick = () => renderFullSurah(surah.id);
        listContainer.appendChild(item);
    });
}

3. دالة جلب وعرض السوره (نص و تجويد و صوت)
async function renderFullSurah(surahId) {
    const contentContainer = document.getElementById('surah-content');
    contentContainer.innerHTML = 'جاري التحميل...';

    const [textData, tajweedData, audioData] = await Promise.all([
        fetchApiData({ id: surahId }),
        fetchApiData({ id: surahId, type: 'tajweed' }),
        fetchApiData({ id: surahId, type: 'audio' })
    ]);

    contentContainer.innerHTML = '';
    
    textData.verses.forEach((verse, index) => {
        const verseEl = document.createElement('span');
        verseEl.className = 'verse-text';
        verseEl.innerHTML = `${verse.text} <span class="verse-num">(${verse.id})</span> `;
        
        verseEl.onclick = () => {
            const player = new Audio(audioData.audio[index].url);
            player.play();
        };

        contentContainer.appendChild(verseEl);
    });
}


​📑 دليل روابط واجهة برمجة التطبيقات (Quran API Directory)
​هذا القسم يلخص المسارات الكاملة لـ 114 سورة من خلال تحديد نقطة البداية و نقطة النهاية لكل نوع من البيانات، مما يسهل عملية البرمجة والجلب التلقائي.
​1. فرع النصوص العادية (Plain Text API)
​يستخدم لجلب نص الآيات الصافي بدون تشكيل تجويد ملون.
​بداية الفهرس (سورة الفاتحة): https://quran-api-henna-iota.vercel.app/api/surah?id=1
​نهاية الفهرس (سورة الناس): https://quran-api-henna-iota.vercel.app/api/surah?id=114
​2. فرع نصوص التجويد (Tajweed Text API)
​يستخدم لجلب النص مع وسوم HTML لتلوين أحكام التجويد (مد، إخفاء، إدغام... إلخ).
​بداية الفهرس (سورة الفاتحة): https://quran-api-henna-iota.vercel.app/api/surah?id=1&type=tajweed
​نهاية الفهرس (سورة الناس): https://quran-api-henna-iota.vercel.app/api/surah?id=114&type=tajweed
​3. فرع الملفات الصوتية (Audio MP3 API)
​يستخدم لجلب روابط ملفات MP3 لكل آية على حدة بصوت القارئ.
​بداية الفهرس (سورة الفاتحة): https://quran-api-henna-iota.vercel.app/api/surah?id=1&type=audio
​نهاية الفهرس (سورة الناس): https://quran-api-henna-iota.vercel.app/api/surah?id=114&type=audio
​4. فرع التفسير والترجمة (Tafsir API)
​يستخدم لجلب التفسير الميسر باللغة العربية لكل آية.
​بداية الفهرس (سورة الفاتحة): https://quran-api-henna-iota.vercel.app/api/surah?id=1&type=translation&lang=ar
​نهاية الفهرس (سورة الناس): https://quran-api-henna-iota.vercel.app/api/surah?id=114&type=translation&lang=ar
​🛠️ منطق البرمجة لجلب الـ 114 سورة (Loop Logic)
​لجلب كافة السور برمجياً من البداية إلى النهاية، نستخدم حلقة تكرار (Loop) تبدأ من 1 وتنتهي عند 114 كما هو موضح في هذا الكود المختصر:
// مصفوفة لتخزين كافة روابط السور برمجياً
const allSurahsLinks = [];

for (let i = 1; i <= 114; i++) {
    allSurahsLinks.push({
        id: i,
        text: `https://quran-api-henna-iota.vercel.app/api/surah?id=${i}`,
        audio: `https://quran-api-henna-iota.vercel.app/api/surah?id=${i}&type=audio`,
        tajweed: `https://quran-api-henna-iota.vercel.app/api/surah?id=${i}&type=tajweed`,
        tafsir: `https://quran-api-henna-iota.vercel.app/api/surah?id=${i}&type=translation&lang=ar`
    });
}

// الآن يمكنك الوصول لأي سورة، مثلاً السورة رقم 18 (الكهف)
console.log("رابط صوت سورة الكهف:", allSurahsLinks[17].audio);

💡 شرح آلية العمل (Workflow)
​الجلب (Fetching): يتم إرسال طلب GET للرابط المطلوب بناءً على الرقم (ID).
​المعالجة (Processing): يعيد الـ API كائن JSON يحتوي على مصفوفة verses (الآيات).
​العرض (Rendering): يتم استخدام map أو forEach في الجافا سكريبت لتحويل هذه البيانات إلى عناصر HTML وعرضها في الموقع فوراً.
