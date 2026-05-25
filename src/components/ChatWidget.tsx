import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  HelpCircle, 
  AlertCircle
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── TypeScript Interfaces ──

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatWidgetProps {
  /** Optional custom API key. If not provided, will check Vite env or use the default provided fallback */
  apiKey?: string;
  /** Custom endpoint to send the POST request to */
  apiEndpoint?: string;
  /** Customize floating position. Defaults to bottom-left (recommended for RTL layouts) */
  position?: 'bottom-left' | 'bottom-right';
}

// Custom prompt provided by the user, tailored to Amm Baraka
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

// Default suggest messages to trigger instant user engagement
const SUGGESTED_PROMPTS = [
  "ما هي منصة يقين؟",
  "حدثني عن رحلة الهجرة النبوية الشريفة ﷺ",
  "ما هي أفضل الأوقات لقراءة القرآن الكريم؟",
  "كيف أستمع للرقية الشرعية على منصة يقين?"
];

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiKey = ((import.meta as any).env.VITE_GEMINI_API_KEY || 'AIzaSyBGh3bVMcte_LPuDjp5CoqlcjkZT8ECk68').startsWith('AIza')
    ? ((import.meta as any).env.VITE_GEMINI_API_KEY || 'AIzaSyBGh3bVMcte_LPuDjp5CoqlcjkZT8ECk68')
    : 'AIzaSyBGh3bVMcte_LPuDjp5CoqlcjkZT8ECk68',
  apiEndpoint = '/api/chat',
  position = 'bottom-left'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial welcome message from Amm Baraka
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: 'السلام عليكم ورحمة الله وبركاته يا ولدي! مرحباً بك في منصة يقين. أنا الشيخ عم بركة، مرشدك هنا لمساعدتك في استكشاف كتاب الله العزيز، وتدبر السيرة النبوية العطرة ﷺ، وقصص الصحابة الكرام. قل لي يا بني، كيف يمكنني مساعدتك اليوم بفضل الله؟',
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to the latest message whenever messages array or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-focus input when widget opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /**
   * Primary API Handler: Sends the chat session history to the /api/chat endpoint.
   * If the local placeholder endpoint does not exist or fails, it gracefully falls back
   * to direct client-side Google Gemini API integration using the supplied API Key.
   */
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create and append user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setApiError(null);

    // Filter welcome message to avoid Gemini 400 Bad Request alternating history error
    const activeHistory = messages
      .filter(msg => msg.id !== 'welcome')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // Prepare payload (history format suitable for most serverless pipelines)
    const payload = {
      message: textToSend,
      history: activeHistory
    };

    try {
      // 1. Attempt POST request to serverless placeholder API endpoint
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let serverError: any = null;
        try {
          serverError = await response.json();
        } catch (jsonErr) {
          try {
            serverError = await response.text();
          } catch (textErr) {
            serverError = `Unknown server error with status code: ${response.status}`;
          }
        }
        
        // Print the exact backend error to the browser console
        console.error("Backend Error Object:", serverError);
        
        throw new Error(
          typeof serverError === 'object' && serverError?.error
            ? serverError.error
            : `Endpoint returned status ${response.status}`
        );
      }

      const data = await response.json();
      const aiResponseText = data.text || data.response || data.message;
      
      if (!aiResponseText) {
        throw new Error("Invalid response format from serverless endpoint");
      }

      appendAiResponse(aiResponseText);
    } catch (error: any) {
      console.warn("Serverless endpoint failed or is not configured. Falling back to direct client-side Gemini API...", error.message || error);
      
      // 2. Graceful Fallback: Direct client-side call to Google Gemini
      try {
        if (!apiKey) {
          throw new Error("API Key is missing. Please check VITE_GEMINI_API_KEY inside your .env file.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          systemInstruction: BRAND_SYSTEM_INSTRUCTION
        });

        // Start chat session with alternating history (welcome message filtered out)
        const chatSession = model.startChat({
          history: activeHistory
        });

        const result = await chatSession.sendMessage(textToSend);
        const textResponse = result.response.text();
        
        if (textResponse) {
          appendAiResponse(textResponse);
        } else {
          throw new Error("Empty response received from Gemini API");
        }

      } catch (fallbackError: any) {
        console.error("Direct Gemini API fallback also failed:", fallbackError);
        
        // Custom error message when Amm Baraka is offline/busy
        setApiError("عم بركة بيصلي دلوقتي، تعالى بعدين");
        
        // Add a friendly offline warning message from Amm Baraka
        appendAiResponse("يا ولدي، عم بركة بيصلي دلوقتي، تعالى بعدين إن شاء الله.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const appendAiResponse = (text: string) => {
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      text: text,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const clearChatHistory = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف سجل المحادثة؟")) {
      setMessages([
        {
          id: 'welcome',
          text: 'أهلاً بك مجدداً يا بني! لقد تم تجديد جلستنا. كيف يمكنني مساعدتك الآن بخصوص القرآن العظيم أو السيرة النبوية العطرة؟',
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      setApiError(null);
    }
  };

  // Allow sending with Enter (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Determine floating positioning coordinates
  const positionClasses = position === 'bottom-left' 
    ? 'left-6 bottom-6 md:left-8 md:bottom-8' 
    : 'right-6 bottom-6 md:right-8 md:bottom-8';

  return (
    <div className={`fixed z-50 font-tajawal ${positionClasses} flex flex-col items-end`}>
      {/* ── Chat Window (Floating Glass Panel - Refined Compact Size) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[320px] sm:w-[350px] h-[450px] sm:h-[480px] rounded-2xl overflow-hidden glass-card flex flex-col shadow-[0_15px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.35)] border border-white/20 dark:border-primary/20 backdrop-blur-xl mb-3 relative z-50"
            style={{ direction: 'rtl' }}
          >
            {/* Header (Premium Glass Header with Gold Accents - Compact) */}
            <div className="px-4 py-3 bg-gradient-to-r from-secondary/85 to-[#044e3d]/85 border-b border-primary/20 flex items-center justify-between backdrop-blur-lg">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  {/* Premium circular frame for Amm Baraka's cartoon face */}
                  <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden shadow-inner">
                    <img 
                      src="/amm-baraka.png" 
                      alt="الشيخ عم بركة" 
                      className="w-full h-full object-cover object-top scale-110" 
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-secondary rounded-full animate-pulse"></span>
                </div>
                
                <div>
                  <h3 className="text-white font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                    الشيخ عم بركة
                    <Sparkles className="w-3 h-3 text-accent fill-accent/20" />
                  </h3>
                  <p className="text-[10px] text-white/70 font-medium">المرشد الروحي والتعليمي لمنصة يقين</p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearChatHistory}
                  title="تفريغ المحادثة"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-white/10 transition-colors duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="إغلاق"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Notification Bar */}
            {apiError && (
              <div className="bg-red-500/10 border-b border-red-500/20 px-3 py-2 flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-300 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Chat Body (Message Log Area - Compact Padding) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar bg-slate-50/20 dark:bg-emerald-950/10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] sm:text-[14px] leading-relaxed shadow-sm transition-all ${
                      msg.sender === 'user'
                        ? 'bg-primary/20 dark:bg-primary/10 text-emerald-950 dark:text-white border border-primary/30 rounded-br-none font-semibold'
                        : 'bg-white/90 dark:bg-white/10 text-emerald-950 dark:text-emerald-50 border border-white/20 dark:border-white/10 rounded-bl-none font-medium'
                    }`}
                  >
                    {/* Message Text with basic markdown/newline parsing */}
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>
                    {/* Timestamp */}
                    <span className={`block text-[9px] mt-1 text-left ${
                      msg.sender === 'user' ? 'text-emerald-900/60 dark:text-white/40' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Dynamic Typing Indicator (when loading Gemini response) */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/85 dark:bg-white/10 text-emerald-950 dark:text-emerald-50 border border-white/20 dark:border-white/10 rounded-xl rounded-bl-none px-3 py-2 shadow-sm flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-primary animate-pulse">الشيخ عم بركة يتفكر...</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state suggested prompt chips - Compact Sizing */}
              {messages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] text-slate-500 dark:text-primary/60 font-semibold px-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-primary" />
                    أسئلة شائعة يمكنك طرحها:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(prompt)}
                        className="w-full text-right text-[11px] p-2 rounded-lg border border-primary/20 bg-white/40 dark:bg-white/5 hover:bg-primary/10 dark:hover:bg-primary/10 hover:border-primary/50 text-emerald-950 dark:text-emerald-100 hover:text-primary dark:hover:text-primary transition-all duration-200 font-semibold"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Section - Compact */}
            <div className="p-2.5 bg-white/40 dark:bg-emerald-950/30 border-t border-white/10 dark:border-primary/10 flex items-end gap-2 backdrop-blur-md">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسأل عم بركة..."
                rows={1}
                className="flex-1 max-h-20 min-h-[38px] py-1.5 px-3 rounded-lg bg-white/80 dark:bg-emerald-950/80 border border-slate-200 dark:border-primary/20 text-emerald-950 dark:text-white placeholder-slate-400 dark:placeholder-white/40 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-300 resize-none font-semibold"
              />
              
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                title="إرسال"
                className={`w-9.5 h-9.5 shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md ${
                  inputValue.trim() && !isLoading
                    ? 'bg-primary hover:bg-accent text-white scale-100 active:scale-95 cursor-pointer shadow-primary/20'
                    : 'bg-slate-200 dark:bg-emerald-950 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
              >
                {/* Mirroring standard send icon for RTL text flow alignment */}
                <Send className="w-4 h-4 scale-x-[-1]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trigger Floating Button (Custom Grandfather Face Avatar - Clean Size) ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-[0_8px_30px_rgba(198,156,109,0.35)] dark:shadow-[0_8px_30px_rgba(198,156,109,0.2)] border border-primary/40 focus:outline-none relative group overflow-hidden"
        title="اسأل عم بركة"
      >
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:animate-none scale-105 opacity-75"></span>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-emerald-950/20"
            >
              <img 
                src="/amm-baraka.png" 
                alt="عم بركة" 
                className="w-full h-full object-cover object-center"
                style={{ transform: 'scale(1.15)' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 rounded-full p-0.5 shadow-md">
                <Sparkles className="w-3 h-3 animate-bounce fill-slate-900 text-slate-900" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatWidget;
