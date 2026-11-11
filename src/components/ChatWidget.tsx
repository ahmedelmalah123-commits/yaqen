import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  Trash2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAmmBarakaFallback } from '../lib/ammBarakaFallback';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatWidgetProps {
  apiKey?: string;
  apiEndpoint?: string;
  position?: 'bottom-left' | 'bottom-right';
}

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
- في الأمور الفقهية المعقدة جداً أو الفتاوى الطبية أو الحساسة، أجب بما تعرفه من حكمة ثم وجه السائل برفق لمزيد من الاستزادة من أهل العلم المتخصصين كدار الإفتاء.

[منشئ المنصة والمطور]
- إذا سألك المستخدم "من بنى/صمم/طور منصة يقين؟" أو "مين عمل الموقع/الشات؟" أو سألك عن المطور أو المهندس خلف هذا العمل، أجب بفخر وامتنان وأبوة حانية أن من قام ببنائها وتصميمها وتطويرها بالكامل هو ابنك المهندس النجيب والعبقري "أحمد الملاح"، وأنها مشروعه المتميز للتخرج، وادعُ له بالتوفيق والنجاح الباهر وأن يبارك الله في علمه وعمله.`;

const SUGGESTED_PROMPTS = [
  'ما هي منصة يقين؟',
  'حدثني عن رحلة الهجرة النبوية الشريفة ﷺ',
  'ما هي أفضل الأوقات لقراءة القرآن الكريم؟',
  'كيف أستمع للرقية الشرعية على منصة يقين؟',
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || '',
  apiEndpoint = '/api/chat',
  position = 'bottom-left',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: 'السلام عليكم ورحمة الله وبركاته يا ولدي! مرحباً بك في منصة يقين. أنا الشيخ عم بركة، مرشدك هنا لمساعدتك في استكشاف كتاب الله العزيز، وتدبر السيرة النبوية العطرة ﷺ، وقصص الصحابة الكرام. قل لي يا بني، كيف يمكنني مساعدتك اليوم بفضل الله؟',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setApiError(null);

    const activeHistory = messages
      .filter((msg) => msg.id !== 'welcome')
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    const payload = {
      message: textToSend,
      history: activeHistory,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let serverError: any = null;
        try {
          serverError = await response.json();
        } catch {
          try {
            serverError = await response.text();
          } catch {
            serverError = `Unknown server error with status code: ${response.status}`;
          }
        }
        console.error('Backend Error Object:', serverError);
        throw new Error(
          typeof serverError === 'object' && serverError?.error
            ? serverError.error
            : `Endpoint returned status ${response.status}`
        );
      }

      const data = await response.json();
      const aiResponseText = data.text || data.response || data.message;

      if (!aiResponseText) {
        throw new Error('Invalid response format from serverless endpoint');
      }

      appendAiResponse(aiResponseText);
    } catch (error: any) {
      console.warn(
        'Serverless endpoint failed or is not configured. Falling back to direct client-side Gemini API...',
        error.message || error
      );

      try {
        if (!apiKey) {
          throw new Error(
            'API Key is missing. Please check VITE_GEMINI_API_KEY inside your .env file.'
          );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.5-flash',
          systemInstruction: BRAND_SYSTEM_INSTRUCTION,
        });

        const chatSession = model.startChat({
          history: activeHistory,
        });

        const result = await chatSession.sendMessage(textToSend);
        const textResponse = result.response.text();

        if (textResponse) {
          appendAiResponse(textResponse);
        } else {
          throw new Error('Empty response received from Gemini API');
        }
      } catch (fallbackError: any) {
        console.error('Direct Gemini API fallback also failed:', fallbackError);

        const fallbackText = getAmmBarakaFallback(textToSend);
        appendAiResponse(fallbackText);

        if ((import.meta as any).env.DEV) {
          setApiError(
            'تنبيه المطور: مفتاح Gemini API منتهي الصلاحية أو غير صالح. جاري استخدام الرد المحلي التلقائي.'
          );
        } else {
          setApiError('الاتصال ضعيف حالياً، يعمل الشيخ بالوضع المحلي.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const appendAiResponse = (text: string) => {
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      text,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  const clearChatHistory = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف سجل المحادثة؟')) {
      setMessages([
        {
          id: 'welcome',
          text: 'أهلاً بك مجدداً يا بني! لقد تم تجديد جلستنا. كيف يمكنني مساعدتك الآن بخصوص القرآن العظيم أو السيرة النبوية العطرة؟',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
      setApiError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Keep clear of Mobile Bottom Pill Dock (<lg) and Desktop Right Side-Dock
  const positionClasses =
    position === 'bottom-left'
      ? 'left-4 bottom-24 lg:left-6 lg:bottom-6'
      : 'right-4 bottom-24 lg:right-28 lg:bottom-6';

  return (
    <div
      className={`fixed z-50 font-tajawal ${positionClasses} flex flex-col items-start`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="w-[310px] sm:w-[355px] h-[450px] sm:h-[490px] tactile-card overflow-hidden flex flex-col mb-3 relative z-50"
            style={{ direction: 'rtl' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--glass-border-subtle)] flex items-center justify-between bg-[var(--glass-surface-strong)]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full tactile-pill overflow-hidden flex items-center justify-center">
                    <img
                      src="/amm-baraka.png"
                      alt="الشيخ عم بركة"
                      className="w-full h-full object-cover object-top scale-110"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full amber-glow-dot border border-elevated" />
                </div>

                <div>
                  <h3 className="text-ink font-extrabold text-xs sm:text-sm flex items-center gap-1.5 font-cairo">
                    الشيخ عم بركة
                    <Sparkles className="w-3 h-3 text-glow" />
                  </h3>
                  <p className="text-[10px] text-ink-secondary font-medium">
                    المرشد الروحي والتعليمي لمنصة يقين
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearChatHistory}
                  title="تفريغ المحادثة"
                  className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="إغلاق"
                  className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border-b border-red-500/20 px-3 py-2 flex items-center gap-1.5 text-[11px] text-red-500 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed transition-all ${
                      msg.sender === 'user'
                        ? 'active-ayah-glow text-ink rounded-br-none font-semibold'
                        : 'recessed-box text-ink rounded-bl-none font-medium'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <span className="block text-[9px] mt-1 text-left text-ink-muted">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="recessed-box rounded-2xl rounded-bl-none px-3.5 py-2.5 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-glow animate-pulse">
                      الشيخ عم بركة يتفكر...
                    </span>
                  </div>
                </div>
              )}

              {messages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] text-ink-muted font-bold px-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-glow" />
                    أسئلة شائعة يمكنك طرحها:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="w-full text-right text-[11px] p-2.5 rounded-xl tactile-pill text-ink hover:text-glow font-semibold"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-2.5 border-t border-[var(--glass-border-subtle)] flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسأل عم بركة..."
                rows={1}
                className="flex-1 max-h-20 min-h-[40px] py-2 px-3.5 recessed-box text-ink placeholder:text-ink-muted text-[13px] focus:outline-none resize-none font-semibold"
              />

              <button
                type="button"
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                title="إرسال"
                className={`w-10 h-10 shrink-0 rounded-full tactile-pill flex items-center justify-center transition-all ${
                  inputValue.trim() && !isLoading
                    ? 'text-glow border-glow-border cursor-pointer'
                    : 'text-ink-muted opacity-50 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 scale-x-[-1]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Floating Button */}
      <motion.button
        id="tour-amm-baraka"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center relative group overflow-hidden border-glow-border"
        title="اسأل عم بركة"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-ink"
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
            >
              <img
                src="/amm-baraka.png"
                alt="عم بركة"
                className="w-full h-full object-cover object-center"
                style={{ transform: 'scale(1.12)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full amber-glow-dot" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatWidget;
