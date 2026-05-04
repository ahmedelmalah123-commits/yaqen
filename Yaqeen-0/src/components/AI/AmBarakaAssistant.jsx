import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export default function AmBarakaAssistant({ storyContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `أهلاً بك يا بني المستمع. أنا عم بركة، كيف أساعدك في قصة "${storyContext?.title}"؟` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!apiKey) {
        // Fallback mock if no API key installed
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', text: "عذراً يا بني، النظام حالياً يعمل في وضع المحاكاة بدون مفتاح API." }]);
          setIsLoading(false);
        }, 1500);
        return;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `أنت "عم بركة"، راوي قصص إسلامي حكيم وطيب، تتحدث مع الأطفال والشباب بلغة عربية فصحى سهلة ودافئة.
السياق الحالي: المستخدم يقرأ قصة "${storyContext?.title}".
سؤال المستخدم: ${userMsg}
أجب باختصار وحكمة.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "واجهت مشكلة يا بني في فهم طلبك. هل يمكنك الإعادة؟" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-50 w-14 h-14 bg-gradient-to-tr from-accent to-yellow-600 rounded-full shadow-[0_8px_30px_rgb(214,165,74,0.4)] flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle size={28} className="text-white" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm shadow-2xl">
          <div className="bg-white dark:bg-[#0f1c2c] w-full max-w-md rounded-3xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] border border-accent/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                  ع
                </div>
                <div>
                  <h3 className="font-tajawal font-bold text-lg">عم بركة</h3>
                  <p className="text-xs text-white/70">مساعدك في رحلة السيرة</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50 dark:bg-[#0A1A14]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl font-tajawal ${
                    msg.role === 'user' 
                      ? 'bg-accent text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-[#0f1c2c] dark:text-gray-200 border border-black/5 dark:border-white/5 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#0f1c2c] p-3 rounded-2xl rounded-tl-sm border border-black/5 dark:border-white/5 shadow-sm">
                    <div className="flex gap-1 items-center h-6">
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white dark:bg-[#0A1A14] border-t border-black/5 dark:border-white/5">
              <div className="flex gap-2">
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-primary text-white p-3 rounded-xl disabled:opacity-50 hover:bg-primary/90 transition text-accent">
                  <Send size={20} className="mr-1 -ml-1 transform -rotate-45" />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اسأل عم بركة..."
                  className="flex-1 bg-gray-100 dark:bg-[#0f1c2c] rounded-xl px-4 py-2 font-tajawal focus:outline-none border-2 border-transparent focus:border-accent/30 transition dark:text-white"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
