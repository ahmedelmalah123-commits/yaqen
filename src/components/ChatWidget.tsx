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
import { getAmmBarakaFallback } from '../lib/ammBarakaFallback';
import { useAudioStore } from '../store/useAudioStore';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatWidgetProps {
  apiEndpoint?: string;
  position?: 'bottom-left' | 'bottom-right';
}

const SUGGESTED_PROMPTS = [
  'ما هي منصة يقين؟',
  'حدثني عن رحلة الهجرة النبوية الشريفة ﷺ',
  'ما هي أفضل الأوقات لقراءة القرآن الكريم؟',
  'كيف أستمع للرقية الشرعية على منصة يقين؟',
];

const DEFAULT_WELCOME_MESSAGE =
  'السلام عليكم ورحمة الله وبركاته يا ولدي! مرحباً بك في منصة يقين. أنا الشيخ عم بركة، مرشدك هنا لمساعدتك في استكشاف كتاب الله العزيز، وتدبر السيرة النبوية العطرة ﷺ، وقصص الصحابة الكرام. قل لي يا بني، كيف يمكنني مساعدتك اليوم بفضل الله؟';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiEndpoint = '/api/chat',
  position = 'bottom-left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: DEFAULT_WELCOME_MESSAGE,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const activeAudioSource = useAudioStore((s) => s.source);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const appendAiResponse = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        text,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async (rawText: string) => {
    const cleanText = rawText.trim();
    if (!cleanText || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: cleanText,
      sender: 'user',
      timestamp: new Date(),
    };

    const nextHistory = [...messages, userMsg]
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setStatusNotice(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: nextHistory.slice(0, -1),
        }),
      });

      if (!response.ok) {
        const errPayload = await response.json().catch(() => null);
        throw new Error(errPayload?.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data?.text || data?.response || data?.message;
      if (!text) {
        throw new Error('Empty AI response');
      }

      appendAiResponse(text);
    } catch {
      const fallbackReply = getAmmBarakaFallback(cleanText);
      appendAiResponse(fallbackReply);
      setStatusNotice('الوضع التلقائي نشط حالياً للإجابة السريعة بدون اتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: 'welcome',
        text: 'أهلاً بك مجدداً يا بني! تم تجديد الجلسة. كيف يمكنني مساعدتك الآن؟',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    setStatusNotice(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Avoid collision with both Mobile Bottom Dock and GlobalAudioPlayer on small viewports
  const mobileBottomClass = activeAudioSource ? 'bottom-44' : 'bottom-24';
  const positionClasses =
    position === 'bottom-left'
      ? `left-3 ${mobileBottomClass} lg:left-5 lg:bottom-5 items-end`
      : `right-3 ${mobileBottomClass} lg:right-[268px] lg:bottom-5 items-start`;

  return (
    <div className={`fixed z-40 font-tajawal ${positionClasses} flex flex-col`} dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="محادثة الشيخ عم بركة"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.18 }}
            className="w-[min(355px,calc(100vw-1.5rem))] h-[min(480px,calc(100dvh-10rem))] bento-stage overflow-hidden flex flex-col mb-3"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--glass-border-subtle)] flex items-center justify-between bg-elevated">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full tactile-pill overflow-hidden shrink-0">
                  <img
                    src="/amm-baraka.webp"
                    alt="الشيخ عم بركة"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-ink font-extrabold text-sm flex items-center gap-1.5 font-cairo">
                    <span>الشيخ عم بركة</span>
                    <Sparkles className="w-3.5 h-3.5 text-glow" />
                  </h2>
                  <p className="text-[11px] text-ink-secondary truncate">
                    المرشد الروحي لمنصة يقين
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={clearChatHistory}
                  title="تفريغ المحادثة"
                  aria-label="تفريغ المحادثة"
                  className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="إغلاق"
                  aria-label="إغلاق نافذة عم بركة"
                  className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {statusNotice && (
              <div className="px-3 py-1.5 bg-glow-soft border-b border-[var(--glass-border-subtle)] flex items-center gap-1.5 text-[11px] font-semibold text-ink-secondary">
                <AlertCircle size={13} className="text-glow shrink-0" />
                <span>{statusNotice}</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'active-ayah-glow text-ink font-semibold'
                        : 'recessed-box text-ink font-medium'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <span className="block text-[9px] mt-1 text-left text-ink-muted">
                      {msg.timestamp.toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-end">
                  <div className="recessed-box rounded-2xl px-3.5 py-2 text-xs font-semibold text-glow animate-pulse">
                    الشيخ عم بركة يتفكر...
                  </div>
                </div>
              )}

              {messages.length === 1 && !isLoading && (
                <div className="pt-1 space-y-1.5">
                  <p className="text-[11px] text-ink-muted font-bold px-1 flex items-center gap-1">
                    <HelpCircle size={12} className="text-glow" />
                    <span>أسئلة شائعة:</span>
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
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

            {/* Composer */}
            <div className="p-2.5 border-t border-[var(--glass-border-subtle)] flex items-end gap-2 bg-elevated">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسأل عم بركة..."
                rows={1}
                aria-label="اكتب رسالتك إلى الشيخ عم بركة"
                className="flex-1 max-h-20 min-h-[40px] py-2 px-3.5 recessed-box text-ink placeholder:text-ink-muted text-[13px] outline-none resize-none font-semibold"
              />

              <button
                type="button"
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                aria-label="إرسال الرسالة"
                className={`w-10 h-10 shrink-0 rounded-full tactile-pill flex items-center justify-center transition-all ${
                  inputValue.trim() && !isLoading
                    ? 'text-glow border-glow-border'
                    : 'text-ink-muted opacity-50 cursor-not-allowed'
                }`}
              >
                <Send size={16} className="scale-x-[-1]" />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Fixed Trigger Button — stays anchored identically when opened/closed */}
      <button
        id="tour-amm-baraka"
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'إغلاق محادثة عم بركة' : 'اسأل الشيخ عم بركة'}
        title="اسأل عم بركة"
        className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center relative overflow-hidden border-glow-border hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <X size={22} className="text-ink" />
        ) : (
          <img
            src="/amm-baraka.webp"
            alt="الشيخ عم بركة"
            className="w-full h-full object-cover object-top"
          />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
