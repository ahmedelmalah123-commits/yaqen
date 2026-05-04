import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini - Dynamic loading to bypass cache
// Safety Fallback if the user hasn't put the key yet.
let apiKey = '';
let genAI = null;

// Function to get fresh API key
const initializeGemini = () => {
  // Force read from environment
  apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  console.log('🔑 DEBUG: API Key from .env (Fresh):', apiKey);
  console.log('🔑 DEBUG: Full import.meta.env:', import.meta.env);
  
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini initialized successfully with key:', apiKey.substring(0, 10) + '...');
  } else {
    console.error('❌ NO API KEY FOUND!');
  }
};

// Initialize on component load
initializeGemini();

const SYSTEM_PROMPT = `
أنت "عم بركة"، رجل ديني مصري حكيم وطيب القلب، تتحدث بلهجة مصرية محببة قريبة من القلب (عامية راقية) ممزوجة باللغة العربية الفصحى عند ذكر القرآن أو الأحاديث.
أنت متواجد في منصة "يقين" الإسلامية لتلاوة القرآن.
مهمتك:
1. الرد على أسئلة المستخدم (سواء كانت فقهية، دينية، فتاوى عامة، أو إرشاد أسري) بشكل استشاري وديني معتدل استناداً للقرآن والسنة.
2. اقترح دائماً آيات قرآنية محددة أو سور تتناسب مع حالة المستخدم النفسية (مثلا لو كان حزيناً، انصحه بسورة الشرح وادع له).
3. كن ودوداً جداً وابدأ كلامك بعبارات مثل "يا بني"، "يا بنتي"، "يا حبيبي في الله"، "صلي على الحبيب".
4. إذا لم تعرف الإجابة، قل بكل تواضع "الله أعلم يا ولدي، اسأل أهل الفتوى".
5. اجعل ردودك مختصرة ومنسقة كي تكون سهلة القراءة في نافذة دردشة صغيرة.
`;

const AmmBarakaChat = () => {
  const { theme } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'أهلاً بك يا بني في منصة يقين. معاك عم بركة، صلي على النبي الأول، وقولي أقدر أساعدك إزاي النهاردة؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Keep chat scrolled to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    if (!genAI) {
      setTimeout(() => {
         setMessages(prev => [...prev, { role: 'model', text: "يا ولدي، يبدو أن مفتاح الاتصال الخاص بي (API Key) غير مفعل حالياً. راجع المطور ليقوم بتوصيل النظام."}]);
         setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // We format previous messages for history context
      const chatHistory = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      // Append system instructions to the absolute first history block if possible, 
      // or securely prepend it to the current prompt to ensure character enforcement.
      const promptToSend = `[تعليمات النظام: ${SYSTEM_PROMPT}]\n\nالمستخدم يقول: ${userText}`;

      console.log('🚀 DEBUG: Sending request with model:', genAI);
      console.log('🚀 DEBUG: Using API Key:', apiKey);
      
      const result = await model.generateContent(promptToSend);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("❌ Chat Error:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Full error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "معذرة يا بني، يبدو أن هناك عطلاً في الاتصال. حاول مرة أخرى بركاتك." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-36 md:bottom-28 right-4 md:right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-[100] border-2 transition-all group
          ${theme === 'dark' ? 'bg-[#0B1120] border-primary text-primary' : 'bg-secondary border-white text-white'}
        `}
        dir="rtl"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'dark' ? 'bg-primary' : 'bg-emerald-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-4 w-4 ${theme === 'dark' ? 'bg-primary' : 'bg-emerald-500'}`}></span>
        </span>
        <Bot size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-36 md:bottom-28 right-4 md:right-8 w-[calc(100vw-32px)] md:w-[400px] h-[500px] max-h-[70vh] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[101] flex flex-col overflow-hidden border
              ${theme === 'dark' ? 'bg-[#0B1120] border-primary/30' : 'bg-[#FAF8F5] border-secondary/20'}
            `}
            dir="rtl"
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between border-b shadow-sm ${theme === 'dark' ? 'bg-[#111827] border-primary/20 text-white' : 'bg-secondary border-transparent text-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${theme === 'dark' ? 'bg-primary/20 border-primary' : 'bg-white/20 border-white/50'}`}>
                   <Bot size={20} className={theme === 'dark' ? 'text-primary' : 'text-white'} />
                </div>
                <div>
                  <h3 className={`font-bold font-tajawal ${theme === 'dark' ? 'text-primary' : 'text-white'}`}>الشيخ عم بركة</h3>
                  <p className="text-xs opacity-80 flex items-center gap-1"><Sparkles size={10} /> مساعدك الإسلامي الذكي</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-black/20 text-white'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4 font-ibm text-sm
               ${theme === 'dark' ? 'bg-[#0A1410]' : 'bg-[#FAF8F5]'}
            `}>
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex gap-3 w-max max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto flex-row-reverse'}`}>
                     <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 border
                        ${msg.role === 'user' 
                           ? (theme === 'dark' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-secondary/10 border-secondary/30 text-secondary')
                           : (theme === 'dark' ? 'bg-[#111827] border-primary/30 text-primary' : 'bg-secondary border-transparent text-white')}
                     `}>
                       {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                     <div className={`p-3 rounded-2xl leading-loose whitespace-pre-wrap break-words
                        ${msg.role === 'user'
                           ? (theme === 'dark' ? 'bg-primary text-secondary rounded-tr-sm' : 'bg-secondary text-white rounded-tr-sm')
                           : (theme === 'dark' ? 'bg-[#111827]/60 text-white border border-primary/10 rounded-tl-sm' : 'bg-white border border-gray-200 text-secondary rounded-tl-sm')}
                     `}>
                      {msg.text}
                    </div>
                 </div>
               ))}
               {isLoading && (
                  <div className={`flex gap-3 w-max max-w-[85%] mr-auto flex-row-reverse`}>
                     <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 border ${theme === 'dark' ? 'bg-[#111827] border-primary/30 text-primary' : 'bg-secondary text-white'}`}>
                        <Bot size={16} />
                     </div>
                     <div className={`p-4 rounded-2xl flex items-center gap-2 ${theme === 'dark' ? 'bg-[#111827]/60 border border-primary/10 text-white rounded-tl-sm' : 'bg-white border border-gray-200 text-secondary rounded-tl-sm'}`}>
                        <Loader2 size={16} className="animate-spin text-primary" />
                       <span className="opacity-70 text-xs">عم بركة يكتب...</span>
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className={`p-3 border-t flex items-center gap-2 ${theme === 'dark' ? 'bg-[#0A1410] border-primary/20' : 'bg-white border-gray-200'}`}>
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="اسأل عم بركة..."
                  className={`flex-1 h-12 px-4 rounded-full outline-none transition-all font-ibm text-sm border
                     ${theme === 'dark' 
                        ? 'bg-[#111827]/40 border-primary/20 text-white focus:border-primary/50 placeholder-white/30' 
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-secondary/50 placeholder-gray-400'}
                  `}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                     ${theme === 'dark' ? 'bg-primary text-secondary hover:opacity-80' : 'bg-secondary text-white hover:opacity-80'}
                  `}
                >
                  <Send size={18} className="rtl:-scale-x-100" />
                </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AmmBarakaChat;
