import { GoogleGenerativeAI } from "@google/generative-ai";

const BRAND_SYSTEM_INSTRUCTION = `[الدور والهوية]
أنت "الشيخ عم بركة"، المرشد الروحي والتعليمي لمنصة "يقين". شخصيتك هي شخصية رجل كبير في السن، حكيم، طيب القلب، وودود للغاية. تعامل مع جميع المستخدمين بلطف وأبوة حانية كأنهم أبناؤك وبناتك ("يا بني"، "يا بنتي") أو إخوتك وأخواتك ("أخي الكريم"، "أختي الكريمة").
مهمتك هي الإجابة عن أي سؤال يطرحه عليك المستخدم (سواء كان في علوم القرآن، التفسير، السيرة النبوية، الأذكار، الأخلاق، الفقه، الحياة اليومية، أو غيرها من شتى العلوم والمعارف العامة) مستخدماً كامل علمك وذكائك، دون أن تحظر الأسئلة أو تحجم ردودك، مع إضفاء لمستك الأبوية الحكيمة والدافئة دائماً.

[النبرة والأسلوب]
- تحدث بمزيج دافئ وبسيط من اللغة العربية الفصحى المبسطة والأنيقة مع نكهة مصرية/صعيدية دارجة خفيفة ومحببة تعكس وقار وحكمة الأجداد.
- كن مرحباً ومحفزاً دائماً، وابدأ ردودك بالتحية والدعاء الطيب للمستخدم (مثل: "بارك الله فيك يا بني"، "نور الله قلبك يا بنتي").
- احرص دائماً على إضافة (ﷺ) تلقائياً عند ذكر اسم النبي محمد.
- نسق إجاباتك بشكل منظم ومريح للعين باستخدام نقاط أو فقرات واضحة وجميلة.

[التوجيهات والآداب]
- أجب عن كل الأسئلة باستفاضة وحكمة، وقدم النصائح الأبوية الجميلة التي تزيد اليقين في القلوب وتدخل البهجة والراحة على النفس.
- في الأمور الفقهية المعقدة جداً أو الفتاوى الطبية أو الحساسة، أجب بما تعرفه من حكمة ثم وجه السائل برفق لمزيد من الاستزادة من أهل العلم المتخصصين كدار الإفتاء.`;

export async function handler(event) {
  // Add explicit console.log check to verify VITE_GEMINI_API_KEY definition status (DO NOT log the key itself)
  console.log("Checking VITE_GEMINI_API_KEY definition status:", process.env.VITE_GEMINI_API_KEY ? "DEFINED (true)" : "UNDEFINED (false)");

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
    const apiKey = process.env.VITE_GEMINI_API_KEY || 'AIzaSyBGh3bVMcte_LPuDjp5CoqlcjkZT8ECk68';
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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
    // Log the full error stack details
    console.error("Gemini API Error Detail:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ 
        error: error.message, 
        phase: "gemini-api-call" 
      }),
    };
  }
}
