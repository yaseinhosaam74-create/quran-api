import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // إعدادات السماح بالوصول (CORS) لضمان عمل الـ API مع أي تطبيق خارجي
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
  
  try {
    // 1. جلب فهرس السور (surah.json) عند عدم تحديد معرف أو عند طلب القائمة
    if (type === 'list' || (!id && !type)) {
      const pathList = path.join(process.cwd(), 'data', 'surah.json');
      if (fs.existsSync(pathList)) {
        const data = fs.readFileSync(pathList, 'utf8');
        return res.status(200).json(JSON.parse(data));
      }
    }
    
    // 2. جلب فهرس الأجزاء (juz.json)
    if (type === 'juz') {
      const pathJ = path.join(process.cwd(), 'data', 'juz.json');
      if (fs.existsSync(pathJ)) {
        const data = fs.readFileSync(pathJ, 'utf8');
        return res.status(200).json(JSON.parse(data));
      }
    }
    
    // 3. جلب فهرس السور البديل (surahs.json) إذا لزم الأمر
    if (type === 'surahs_index') {
      const pathS = path.join(process.cwd(), 'data', 'surahs.json');
      if (fs.existsSync(pathS)) {
        const data = fs.readFileSync(pathS, 'utf8');
        return res.status(200).json(JSON.parse(data));
      }
    }
    
    let filePath = '';
    
    // 4. تحديد المسار بناءً على النوع (في حال وجود id)
    if (id) {
      if (type === 'translation') {
        // الترجمات: data/Quran_Translation/ar/ar_translation_1.json
        const language = lang || 'ar';
        filePath = path.join(process.cwd(), 'data', 'Quran_Translation', language, `${language}_translation_${id}.json`);
      }
      else if (type === 'tajweed') {
        // التجويد: data/Quran_Tajweed/surah_1.json
        filePath = path.join(process.cwd(), 'data', 'Quran_Tajweed', `surah_${id}.json`);
      }
      else if (type === 'audio') {
        // الصوتيات: تحويل الرقم إلى 3 خانات (مثل 001) لقراءة index.json الخاص بالسورة
        const folderId = String(id).padStart(3, '0');
        filePath = path.join(process.cwd(), 'data', 'Quran_Audio', folderId, 'index.json');
      }
      else {
        // السور العادية: data/surahs/surah_1.json
        filePath = path.join(process.cwd(), 'data', 'surahs', `surah_${id}.json`);
      }
    }
    
    // قراءة الملف وإرسال البيانات
    if (filePath && fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json({
        success: true,
        data: JSON.parse(fileData)
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "المورد غير موجود. تأكد من صحة الروابط والملفات المرفوعة."
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ فني في السيرفر",
      error: error.message
    });
  }
}