import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
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

  const { id } = req.query;

  try {
    if (!id) {
      const listPath = path.join(process.cwd(), 'data', 'surahs.json');
      if (fs.existsSync(listPath)) {
        const listContents = fs.readFileSync(listPath, 'utf8');
        return res.status(200).json({
          success: true,
          type: "index",
          data: JSON.parse(listContents)
        });
      }
      return res.status(404).json({ success: false, message: "فهرس السور غير موجود" });
    }

    // التعديل هنا ليتناسب مع التسمية الجديدة surah_1.json
    const surahPath = path.join(process.cwd(), 'data', 'surahs', `surah_${id}.json`);
    
    if (fs.existsSync(surahPath)) {
      const surahContents = fs.readFileSync(surahPath, 'utf8');
      return res.status(200).json({
        success: true,
        type: "surah_detail",
        data: JSON.parse(surahContents)
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `الملف surah_${id}.json غير موجود في المجلد`
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "حدث خطأ في السيرفر",
      error: error.message
    });
  }
}
