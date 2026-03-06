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

    // 2. معالجة طلبات الفهارس (القوائم الرئيسية)
    if (type === 'list' || (!id && !type)) {
      filePath = path.join(dataDirectory, 'surah.json');
    } 
    else if (type === 'juz') {
      filePath = path.join(dataDirectory, 'juz.json');
    } 
    else if (type === 'surahs_index') {
      filePath = path.join(dataDirectory, 'surahs.json');
    }

    // 3. معالجة الطلبات بناءً على معرف السورة (ID)
    if (id) {
      if (type === 'translation') {
        const language = lang || 'ar';
        filePath = path.join(dataDirectory, 'Quran_Translation', language, `${language}_translation_${id}.json`);
      } 
      else if (type === 'tajweed') {
        filePath = path.join(dataDirectory, 'Quran_Tajweed', `surah_${id}.json`);
      } 
      else if (type === 'audio') {
        const folderId = String(id).padStart(3, '0');
        filePath = path.join(dataDirectory, 'Quran_Audio', folderId, 'index.json');
      } 
      else if (!type) {
        filePath = path.join(dataDirectory, 'surahs', `surah_${id}.json`);
      }
    }

    // 4. التحقق من وجود الملف وقراءته
    if (filePath && fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // نرسل دائماً استجابة موحدة لتسهيل التعامل معها في script.js
      return res.status(200).json({
        success: true,
        data: JSON.parse(fileContent)
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "المورد غير موجود في المسار المحدد",
        debug: { 
          searchedPath: filePath.replace(process.cwd(), ''), 
          params: req.query 
        }
      });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "خطأ فني في السيرفر أثناء معالجة البيانات",
      error: error.message
    });
  }
}
