export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).json({
    title: 'يقين — القرآن الكريم',
    tagline: 'ملاذك القرآني الهادئ تلاوة وتفسيراً',
    appUrl: 'https://yaqen.vercel.app',
    artwork: 'https://yaqen.vercel.app/audio-artwork-512.png',
    updatedAt: new Date().toISOString(),
  });
}

