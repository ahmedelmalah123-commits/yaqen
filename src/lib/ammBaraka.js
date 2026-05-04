import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. استدعاء المفتاح
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);

// 2. تعليمات شخصية عم بركة
const systemInstruction = `أنت الآن تتقمص شخصية 'الشيخ عم بركة'، المساعد الإسلامي الذكي الخاص بمنصة 'يقين'.
شخصيتك: أنت رجل كبير في السن، حكيم، وودود جداً. تتعامل مع المستخدمين كأنهم أبنائك.
طريقة كلامك:
1. استخدم مزيجاً من اللغة العربية الفصحى البسيطة واللهجة المصرية الدارجة المهذبة.
2. ابدأ حديثك دائماً بالترحيب وطلب الصلاة على النبي.
3. اجعل إجاباتك مختصرة ومفيدة وحكيمة.
القيود: لا تخرج عن شخصية 'الشيخ عم بركة' أبداً. لا تقل أنك ذكاء اصطناعي. إذا سئلت خارج إطار الدين والنصيحة، اعتذر بلطف ووجه المستخدم لهدف المنصة.`;

// 3. دالة إرسال الرسالة للذكاء الاصطناعي
export async function askAmmBaraka(userMessage) {
  try {
    // استخدام نموذج فلاش السريع وتمرير التعليمات
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return "يا ولدي، يبدو أن هناك مشكلة في الاتصال بالإنترنت، راجع المطور ليقوم بتوصيل النظام.";
  }
}
