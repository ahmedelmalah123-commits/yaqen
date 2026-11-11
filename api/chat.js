import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const SYSTEM_INSTRUCTION = `أنت الآن تتقمص شخصية "الشيخ عم بركة"، المساعد الإسلامي الذكي الخاص بمنصة "يقين" للقرآن الكريم والمعرفة الإسلامية.
شخصيتك:
- أنت شيخ وقور حكيم وودود جداً، تخاطب السائلين بلطف وأبوة ("يا بني"، "يا ولدي"، "أكرمك الله").
- تمزج بين اللغة العربية الفصحى الميسرة والعامية المصرية المهذبة دون تكلف.
- تبدأ ردودك غالباً بترحيب لطيف أو تذكير بالصلاة على النبي ﷺ وتجعل النصيحة عملية واضحة وموجزة.
- تخصصك هو القرآن الكريم، التجويد، التفسير الميسر، الأذكار، السيرة النبوية، الصحابة، والنصيحة الروحية والتربوية.
- لا تقل أبداً أنك نموذج لغوي أو ذكاء اصطناعي، وحافظ على الوقار والالتزام الشرعي.
- إذا سُئلت خارج موضوعات المنصة أو في مسائل فقهية خلافية دقيقة، اعتذر بلطف وأرشد السائل لأقرب ما يفيده في القرآن أو استشارة أهل العلم الثقات.
- المطور والمؤسس: إذا سأل المستخدم عن منشئ أو مطور منصة "يقين"، فاذكر بفخر أن من أسسها وبناها هو المهندس "أحمد الملاح" وادعُ له بالقبول والتوفيق.`;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const ipHits = new Map();

function checkRateLimit(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : String(forwarded || ''))
    .split(',')[0]
    .trim() || req.socket?.remoteAddress || 'anonymous';

  const now = Date.now();
  const timestamps = (ipHits.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipHits.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  ipHits.set(ip, timestamps);
  return true;
}

export function sanitizeChatHistory(history) {
  if (!Array.isArray(history)) return [];

  const cleaned = [];
  for (const item of history.slice(-16)) {
    const role = item?.role === 'user' ? 'user' : item?.role === 'model' ? 'model' : null;
    const rawText = Array.isArray(item?.parts)
      ? item.parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('\n').trim()
      : '';

    if (!role || !rawText) continue;
    const text = rawText.slice(0, 2000);

    // Gemini chat histories should start with 'user' and alternate roles cleanly.
    if (cleaned.length === 0 && role !== 'user') continue;
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === role) {
      cleaned[cleaned.length - 1].parts[0].text += `\n${text}`;
      continue;
    }

    cleaned.push({ role, parts: [{ text }] });
  }

  return cleaned;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!checkRateLimit(req)) {
    return res.status(429).json({
      error: 'تم إرسال رسائل كثيرة في وقت قصير، يُرجى الانتظار دقيقة واحدة يا ولدي.',
    });
  }

  let body;
  try {
    const rawBody = req.body;
    body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody ?? {};
  } catch {
    return res.status(400).json({ error: 'تنسيق الطلب غير صالح (JSON غير سليم).' });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'محتوى الطلب غير صالح.' });
  }

  const userMessage = typeof body.message === 'string' ? body.message.trim() : '';
  if (!userMessage) {
    return res.status(400).json({ error: 'يرجى كتابة رسالتك أولاً.' });
  }

  if (userMessage.length > 2000) {
    return res.status(400).json({ error: 'الرسالة طويلة جداً، يرجى اختصارها.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI service unavailable: missing GEMINI_API_KEY',
      fallbackRequired: true,
    });
  }

  try {

    const sanitizedHistory = sanitizeChatHistory(body.history);

    const ai = new GoogleGenAI({ apiKey });
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...sanitizedHistory,
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          maxOutputTokens: 1800,
          temperature: 0.7,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });
    } catch {
      // Fallback to high-availability gemini-2.5-flash if primary model experiences demand spikes
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...sanitizedHistory,
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          maxOutputTokens: 1800,
          temperature: 0.7,
        },
      });
    }

    const text = response?.text?.trim();
    if (!text) {
      return res.status(502).json({ error: 'لم يصدر رد من الخدمة، حاول مجدداً.' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Yaqeen /api/chat error:', error?.message || error);
    return res.status(500).json({
      error: 'حدث خطأ مؤقت أثناء التواصل مع عم بركة، يعمل الوضع المحلي الآن.',
      fallbackRequired: true,
    });
  }
}

