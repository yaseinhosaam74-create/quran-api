import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // 1. إعدادات CORS الشاملة
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id, type, lang } = req.query;
  const dataDirectory = path.join(process.cwd(), 'data');

  try {
    let filePath = '';
    let isWrapped = true; // لتحديد ما إذا كنا سنغلف النتيجة بـ {success: true, data: ...}

    // 2. معالجة طلبات الفهارس (القوائم الرئيسية)
    if (type === 'list' || (!id && !type)) {
      filePath = path.join(dataDirectory, 'surah.json');
      isWrapped = false; // الفهرس عادة يرسل كمصفوفة مباشرة لسرعة المعالجة
    } 
    else if (type === 'juz') {
      filePath = path.join(dataDirectory, 'juz.json');
      isWrapped = false;
    } 
    else if (type === 'surahs_index') {
      filePath = path.join(dataDirectory, 'surahs.json');
      isWrapped = false;
    }

    // 3. معالجة الطلبات بناءً على معرف السورة (ID)
    if (id) {
      if (type === 'translation') {
        const language = lang || 'ar';
        // المسار: data/Quran_Translation/ar/ar_translation_1.json
        filePath = path.join(dataDirectory, 'Quran_Translation', language, `${language}_translation_${id}.json`);
      } 
      else if (type === 'tajweed') {
        // المسار: data/Quran_Tajweed/surah_1.json
        filePath = path.join(dataDirectory, 'Quran_Tajweed', `surah_${id}.json`);
      } 
      else if (type === 'audio') {
        // المسار: data/Quran_Audio/001/index.json
        const folderId = String(id).padStart(3, '0');
        filePath = path.join(dataDirectory, 'Quran_Audio', folderId, 'index.json');
      } 
      else if (!type) {
        // المسار: data/surahs/surah_1.json (السورة العادية)
        filePath = path.join(dataDirectory, 'surahs', `surah_${id}.json`);
      }
    }

    // 4. قراءة الملف وإرسال الاستجابة
    if (filePath && fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      if (isWrapped) {
        return res.status(200).json({
          success: true,
          data: jsonData
        });
      } else {
        // إرسال البيانات مباشرة (مثل فهرس السور) ليتوافق مع script.js
        return res.status(200).json({
          success: true,
          data: jsonData
        });
      }
    } else {
      // في حال عدم وجود الملف، نرسل خطأ واضح للمساعدة في التصحيح
      return res.status(404).json({
        success: false,
        message: "المورد غير موجود",
        debug: { path: filePath, query: req.query }
      });
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ فني في السيرفر",
      error: error.message
    });
  }
}
