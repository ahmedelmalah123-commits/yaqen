import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Shuffle, CheckCircle2, Mail, Sparkles, Heart, Wind } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useAppStore } from '../store/useAppStore';

// ── EmailJS config ──────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_q1bsbbe';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_86vq4k9';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'MuhO5R89GxlRH3KI_';
// ───────────────────────────────────────────────────────────────────────────

const RANDOM_MESSAGES = [
  'اللهم اجعلنا ممن يسمعون القول فيتبعون أحسنه 🌿',
  'تذكّر أن الله معك في كل خطوة — فلا تيأس ولا تحزن ❤️',
  'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ 📖',
  'وَعَسَى أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ — ثق بقدر الله 🌙',
  'اللهم اشفِ قلبي وأصلح حالي وثبّت قدمي 🤍',
  'أسعدك الله في الدارين، وجعل يومك من أفضل أيامك 🌸',
  'الصلاة على النبي ﷺ نور يمشي بك في ظلمات الحياة ✨',
  'اللهم اجعلنا من عبادك الشاكرين الذاكرين الصابرين 🌿',
  'كُلَّمَا ضاقت بك الدنيا فافتح القرآن — ستجد فيه ما يوسّع صدرك 📖',
  'اللهم اكفنا بحلالك عن حرامك وأغننا بفضلك عمَّن سواك 💚',
  'لا تنسَ ذكر الله — فإن القلوب لا تطمئن إلا به 🌙',
  'جعل الله يومك مليئاً بالبركة والعافية والسرور 🌻',
  'إِنَّ مَعَ الْعُسْرِ يُسْرًا — تذكّرها دائماً عند الشدة 💪',
  'اللهم بارك لنا في أوقاتنا وأعمارنا وأرزاقنا 🌟',
  'اغتنم لحظات الدعاء — فأنت تتكلم مع من بيده كل شيء 🤲',
];

const Nafha = () => {
  const { theme } = useAppStore();
  const [message, setMessage]     = useState('');
  const [email, setEmail]         = useState('');
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState('');
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'email' | 'whatsapp'
  const formRef = useRef();

  const isDark = theme === 'dark';

  // ── Random message ──────────────────────────────────────────────────────
  const pickRandom = () => {
    const filtered = RANDOM_MESSAGES.filter(m => m !== message);
    const pool = filtered.length ? filtered : RANDOM_MESSAGES;
    setMessage(pool[Math.floor(Math.random() * pool.length)]);
    setError('');
  };

  // ── Validate ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!message.trim()) { setError('✋ الرجاء كتابة رسالتك أولاً'); return false; }
    if (message.trim().length < 10) { setError('الرسالة قصيرة جداً — اكتب أكثر 🌿'); return false; }
    if (activeTab === 'email') {
      if (!email.trim()) { setError('📧 أدخل البريد الإلكتروني للمرسَل إليه'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('البريد الإلكتروني غير صحيح'); return false; }
    }
    return true;
  };

  // ── Send via EmailJS ────────────────────────────────────────────────────
  const sendEmail = async () => {
    if (!validate()) return;

    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
      setError('⚙️ يرجى إعداد EmailJS أولاً في ملف Nafha.jsx');
      return;
    }

    setSending(true);
    setError('');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          message: message.trim(),
          site_name: 'يقين',
          site_url: window.location.origin,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setTimeout(() => { setSent(false); setMessage(''); setEmail(''); }, 4000);
    } catch (e) {
      setError('حدث خطأ أثناء الإرسال. حاول مجدداً لاحقاً.');
    } finally {
      setSending(false);
    }
  };

  // ── Send via WhatsApp ───────────────────────────────────────────────────
  const sendWhatsApp = () => {
    if (!validate()) return;
    const text = encodeURIComponent(
      `🌿 *نفحة يقين*\n\n${message.trim()}\n\n— أُرسلت إليك من موقع يقين 💚\n${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const handleSend = () => activeTab === 'email' ? sendEmail() : sendWhatsApp();

  // ── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-[80vh] font-tajawal py-8 md:py-14 px-4`} dir="rtl">
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl mb-4 inline-block"
          >
            🌿
          </motion.div>
          <h1 className={`text-3xl md:text-5xl font-bold mb-3 ${isDark ? 'text-primary' : 'text-secondary'}`}>
            نفحة يقين
          </h1>
          <p className={`text-base md:text-lg leading-relaxed opacity-75 max-w-md mx-auto ${isDark ? 'text-white' : 'text-secondary'}`}>
            أرسل دعاءً أو كلمة طيبة لأحد أحبائك بشكل مجهول — فنشر الخير صدقة 💚
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`rounded-[2rem] border shadow-xl overflow-hidden
            ${isDark ? 'bg-[#111827] border-primary/20' : 'bg-white border-secondary/10'}
          `}
        >
          {/* Tabs */}
          <div className={`flex border-b ${isDark ? 'border-primary/15' : 'border-secondary/10'}`}>
            {[
              { key: 'whatsapp', label: 'واتساب', icon: MessageCircle },
              { key: 'email',    label: 'إيميل',   icon: Mail },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all
                    ${active
                      ? (isDark ? 'bg-primary/15 text-primary border-b-2 border-primary' : 'bg-secondary/8 text-secondary border-b-2 border-secondary')
                      : (isDark ? 'text-white/50 hover:text-white/80' : 'text-secondary/40 hover:text-secondary/70')
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 md:p-8 space-y-5">

            {/* Message textarea */}
            <div className="relative">
              <textarea
                value={message}
                onChange={e => { setMessage(e.target.value); setError(''); setSent(false); }}
                placeholder="اكتب دعاءك أو كلمتك الطيبة هنا... 🌿"
                rows={5}
                maxLength={500}
                className={`w-full resize-none rounded-2xl border px-4 py-3 text-base outline-none transition-all leading-relaxed
                  ${isDark
                    ? 'bg-[#0B1120]/50 border-primary/20 text-white placeholder-white/30 focus:border-primary/50'
                    : 'bg-[#f8faf9] border-secondary/15 text-secondary placeholder-secondary/30 focus:border-secondary/40'
                  }
                `}
              />
              <span className={`absolute bottom-3 left-3 text-xs opacity-40 ${isDark ? 'text-primary' : 'text-secondary'}`}>
                {message.length}/500
              </span>
            </div>

            {/* Random pick button */}
            <button
              onClick={pickRandom}
              className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95
                ${isDark
                  ? 'border-primary/30 text-primary hover:bg-primary/10'
                  : 'border-secondary/25 text-secondary hover:bg-secondary/5'
                }
              `}
            >
              <Shuffle size={15} />
              نفحة عشوائية
            </button>

            {/* Email input (only when tab = email) */}
            <AnimatePresence>
              {activeTab === 'email' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className={`block text-sm font-bold mb-1.5 ${isDark ? 'text-primary' : 'text-secondary'}`}>
                    📧 البريد الإلكتروني للمُرسَل إليه
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="example@email.com"
                    dir="ltr"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all
                      ${isDark
                        ? 'bg-[#0B1120]/50 border-primary/20 text-white placeholder-white/30 focus:border-primary/50'
                        : 'bg-[#f8faf9] border-secondary/15 text-secondary placeholder-secondary/30 focus:border-secondary/40'
                      }
                    `}
                  />
                  <p className={`mt-1.5 text-xs opacity-50 ${isDark ? 'text-white' : 'text-secondary'}`}>
                    سيُرسَل الإيميل باسم "يقين" دون الكشف عن هويتك
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WhatsApp hint */}
            {activeTab === 'whatsapp' && (
              <p className={`text-xs leading-relaxed opacity-55 ${isDark ? 'text-white' : 'text-secondary'}`}>
                💬 سيُفتح واتساب برسالة جاهزة — أنت من يختار المستلم ويضغط إرسال
              </p>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm
                    ${isDark ? 'bg-green-900/40 text-green-300 border border-green-700/30' : 'bg-green-50 text-green-700 border border-green-200'}
                  `}
                >
                  <CheckCircle2 size={20} className="flex-shrink-0" />
                  <span>
                    {activeTab === 'email'
                      ? '✉️ تم إرسال نفحتك بالإيميل — بارك الله فيك!'
                      : '💬 تم فتح واتساب — أرسل وانشر الخير!'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Send button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={sending}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg
                ${isDark
                  ? 'bg-primary text-secondary hover:opacity-80 disabled:opacity-60'
                  : 'bg-secondary text-white hover:opacity-80 disabled:opacity-60'
                }
              `}
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : activeTab === 'whatsapp' ? (
                <><MessageCircle size={20} fill="currentColor" /> إرسال عبر واتساب</>
              ) : (
                <><Send size={18} /> إرسال عبر الإيميل</>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Inspirational footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className={`text-center text-sm mt-8 leading-relaxed ${isDark ? 'text-white' : 'text-secondary'}`}
        >
          «الدَّالُّ على الخيرِ كفاعله» — كلمة طيبة قد تغير يوم شخص كامل 🌿
        </motion.p>
      </div>
    </div>
  );
};

export default Nafha;
