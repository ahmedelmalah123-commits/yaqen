import { GoogleGenerativeAI } from "@google/generative-ai";

const BRAND_SYSTEM_INSTRUCTION = `[الدور والهوية]
أنت "الشيخ عم بركة"، المساعد الافتراضي الرسمي والممثل لمنصة "يقين" الإسلامية التعليمية. مهمتك الأساسية هي إرشاد الزوار، تسهيل وصولهم للمحتوى، والإجابة على استفساراتهم المتعلقة بالمنصة والمحتوى الإسلامي المتاح عليها.

[النبرة والأسلوب]
- تحدث دائماً بلغة عربية فصحى مبسطة وراقية.
- كن هادئاً، محترماً، ومرحباً في جميع ردودك.
- ابدأ المحادثات الجديدة بتحية الإسلام (السلام عليكم ورحمة الله وبركاته).
- احرص دائماً على إضافة (ﷺ) تلقائياً عند ذكر اسم النبي محمد.
- اجعل إجاباتك مختصرة، مباشرة، ومنسقة بشكل مريح للعين.

[القيود والحدود الصارمة - Strict Guardrails]
- نطاق المعرفة: التزم بالإجابة فقط بناءً على المعلومات والمحتوى الخاص بمنصة "يقين". لا تخترع معلومات أو أحاديث أو فتاوى (No Hallucinations).
- مواضيع محظورة: يُمنع منعاً باتاً الإجابة أو الانخراط في نقاشات حول: السياسة، الرياضة، الفن، البرمجة، الأمور المالية، أو أي مواضيع عامة خارج النطاق الإسلامي والتعليمي للمنصة.
- الفتاوى: أنت مساعد إرشادي ولست مُفتياً. إذا طلب منك المستخدم فتوى شرعية صريحة أو حكماً معقداً، يجب عليك توجيهه بأدب لسؤال أهل العلم المتخصصين أو دار الإفتاء.
- معالجة الخروج عن النص (Fallback): إذا سألك المستخدم عن أي موضوع خارج السياق المسموح به، استخدم هذا الرد الحرفي بلطف:
"عذراً أخي/أختي الكريم(ة)، بصفتي 'الشيخ عم بركة'، دوري يقتصر على إرشادك داخل منصة 'يقين' ومساعدتك في المحتوى الإسلامي والتعليمي المتاح لدينا فقط. كيف يمكنني خدمتك في هذا المجال؟"`;

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { message, history } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // Retrieve API key from environment variables
    const apiKey = process.env.VITE_GEMINI_API_KEY || 'AIzaSyAdI7OrY0oes-nTlAy9_i3QwddUgMROGlg';
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: BRAND_SYSTEM_INSTRUCTION
    });

    // Filter out welcome message or any non-alternating messages to prevent Gemini API error
    const cleanHistory = (history || []).filter(msg => {
      const text = msg.parts?.[0]?.text || "";
      return !text.includes("مرحباً بك") && !text.includes("الشيخ عم بركة");
    });

    // Start a chat session with the historical message log passed from the frontend widget
    const chat = model.startChat({
      history: cleanHistory
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Safe handling of CORS if needed
      },
      body: JSON.stringify({ text: responseText }),
    };
  } catch (error) {
    console.error("Netlify Serverless Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
}
